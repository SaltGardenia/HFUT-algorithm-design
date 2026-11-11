# -*- coding: utf-8 -*-
"""verify_deck4.py —— 独立复算 deck4（线性时间排序）的关键结论

1) 计数排序：按 PPT 四段循环逐帧复算 A = <4,1,3,4,3>（k=4），打印每个阶段状态
2) 计数排序：验证最终 B = <1,3,3,4,4>，且 C 末态 = [0,1,1,3]
3) 计数排序稳定性：对带标号的重复元素，验证相等元素的相对次序不变
4) 基数排序：对 329,457,657,839,436,720,355 做 LSD 三趟，逐步打印
5) 决策树下界：验算 n! <= 2^h 的最小整数 h 与 lg(n!) 的关系（n=3..12）
"""
import sys
import math
from itertools import permutations

sys.stdout.reconfigure(encoding='utf-8')


def counting_sort_trace(A, k):
    """完全按 PPT 的伪代码四段循环，返回各阶段快照"""
    n = len(A)
    # 伪代码使用 1 起下标，这里用 0 起下标数组但保持同样语义
    C = [0] * (k + 1)          # 下标 1..k，0 号位不用
    B = [None] * n

    snap = {}
    ### 循环1
    for i in range(1, k + 1):
        C[i] = 0
    snap['loop1'] = C[1:].copy()

    ### 循环2
    per_j = []
    for j in range(1, n + 1):
        C[A[j - 1]] += 1
        per_j.append((j, A[j - 1], C[1:].copy()))
    snap['loop2'] = C[1:].copy()
    snap['loop2_per_j'] = per_j

    ### 循环3
    per_i = []
    for i in range(2, k + 1):
        C[i] += C[i - 1]
        per_i.append((i, C[1:].copy()))
    snap['loop3'] = C[1:].copy()
    snap['loop3_per_i'] = per_i

    ### 循环4（反向）
    per_j4 = []
    for j in range(n, 0, -1):
        val = A[j - 1]
        pos = C[val]
        B[pos - 1] = val
        C[val] -= 1
        per_j4.append((j, val, pos, B.copy(), C[1:].copy()))
    snap['B'] = B
    snap['C_after4'] = C[1:].copy()
    snap['loop4_per_j'] = per_j4
    return snap


def radix_lsd(A, digits=3, base=10):
    """LSD 基数排序（每一位用稳定计数排序），返回每趟结果"""
    arr = A[:]
    passes = []
    for d in range(digits):          # d=0 个位, 1 十位, 2 百位
        buckets = [[] for _ in range(base)]
        for x in arr:
            digit = (x // (base ** d)) % base
            buckets[digit].append(x)   # 顺序 append ⇒ 稳定
        arr = [x for b in buckets for x in b]
        passes.append((d, arr[:]))
    return passes


def main():
    print('=' * 74)
    print('1) 计数排序逐帧复算  A = <4,1,3,4,3>,  n=5, k=4')
    print('=' * 74)
    A = [4, 1, 3, 4, 3]
    k = 4
    s = counting_sort_trace(A, k)
    print('循环1 后 C[1..4] = %s' % s['loop1'])
    print('循环2 逐元素：')
    for (j, v, c) in s['loop2_per_j']:
        print('   j=%d, A[%d]=%d -> C=%s' % (j, j, v, c))
    print('循环2 后 C[1..4] = %s   （期望 [1, 0, 2, 2]）' % s['loop2'])
    print('循环3 逐项累加：')
    for (i, c) in s['loop3_per_i']:
        print('   i=%d -> C=%s' % (i, c))
    print('循环3 后 C[1..4] = %s   （期望 [1, 1, 3, 5]）' % s['loop3'])
    print('循环4 反向填充：')
    for (j, v, pos, B, c) in s['loop4_per_j']:
        print('   j=%d, A[%d]=%d -> B[%d]=%d, C=%s' % (j, j, v, pos, v, c))
    print('最终 B = %s   （期望 [1, 3, 3, 4, 4]）' % s['B'])
    print('最终 C = %s   （期望 [0, 1, 1, 3]）' % s['C_after4'])
    assert s['loop2'] == [1, 0, 2, 2], s['loop2']
    assert s['loop3'] == [1, 1, 3, 5], s['loop3']
    assert s['B'] == [1, 3, 3, 4, 4], s['B']
    assert s['C_after4'] == [0, 1, 1, 3], s['C_after4']
    print('>>> 与 PPT slide 30–44 完全一致 ✔')

    print()
    print('=' * 74)
    print('2) 计数排序的稳定性（相等元素相对次序不变）')
    print('=' * 74)
    # 用 (值, 原始序号) 标记；若稳定，则相同值的序号递增
    items = [(4, 'a'), (1, 'b'), (3, 'c'), (4, 'd'), (3, 'e')]
    n = len(items)
    C = [0] * (k + 1)
    for i in range(1, k + 1):
        C[i] = 0
    for j in range(1, n + 1):
        C[items[j - 1][0]] += 1
    for i in range(2, k + 1):
        C[i] += C[i - 1]
    B = [None] * n
    for j in range(n, 0, -1):
        v, tag = items[j - 1]
        B[C[v] - 1] = (v, tag)
        C[v] -= 1
    print('输入（带原始标记）: %s' % items)
    print('输出（排序后）    : %s' % B)
    order_ok = True
    seen = {}
    for idx, (v, tag) in enumerate(B):
        if v in seen and seen[v] > tag:
            order_ok = False
        seen[v] = tag
    print('值为 4 的相对次序: %s ; 值为 3 的相对次序: %s'
          % ([t for v, t in B if v == 4], [t for v, t in B if v == 3]))
    print('>>> 稳定性保持: %s（4 的 a 在 d 前，3 的 c 在 e 前）' % order_ok)
    assert order_ok

    print()
    print('=' * 74)
    print('3) 基数排序 LSD 逐趟复算')
    print('=' * 74)
    R = [329, 457, 657, 839, 436, 720, 355]
    print('初始: %s' % R)
    for (d, arr) in radix_lsd(R):
        name = ['个位', '十位', '百位'][d]
        print('第 %d 趟（按%s）: %s' % (d + 1, name, arr))
    final = radix_lsd(R)[-1][1]
    expect = [329, 355, 436, 457, 657, 720, 839]
    print('最终: %s' % final)
    print('期望: %s' % expect)
    assert final == expect, final
    print('>>> 与 PPT slide 52 / image42 的最终序列一致 ✔')

    print()
    print('=' * 74)
    print('4) 决策树下界：n! <= 2^h 的最小整数 h  vs  lg(n!)')
    print('=' * 74)
    print('  n |      n!      | 最小 h 使 2^h>=n! |  lg(n!)  | h >= lg(n!)')
    for n in range(3, 13):
        nf = math.factorial(n)
        h = 0
        while (1 << h) < nf:
            h += 1
        lgnf = math.log2(nf)
        print('%3d | %12d | %18d | %8.3f | %s'
              % (n, nf, h, lgnf, h >= lgnf))
    print('>>> 验证 h >= lg(n!) 恒成立（下界推导第 ③ 步）✔')

    print()
    print('=' * 74)
    print('5) lg(n!) 的 Stirling 放缩数值校验')
    print('=' * 74)
    print('  n |      lg(n!) |  n*lg n - n*lg e | 差值')
    for n in (8, 16, 32, 64, 128, 1024):
        lgnf = math.log2(math.factorial(n)) if n <= 200 else None
        # n! 太大时用 Stirling: log2(sqrt(2*pi*n)*(n/e)^n)
        stir = 0.5 * math.log2(2 * math.pi * n) + n * math.log2(n / math.e)
        approx = n * math.log2(n) - n * math.log2(math.e)
        base = lgnf if lgnf is not None else stir
        print('%4d | %11.3f | %17.3f | %+.3f'
              % (n, base, approx, approx - base))
    print('>>> n lg n - n lg e 是 lg(n!) 的同阶下界（差值为低阶项）✔')

    print()
    print('全部断言通过。')


if __name__ == '__main__':
    main()
