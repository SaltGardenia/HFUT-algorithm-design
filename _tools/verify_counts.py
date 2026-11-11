import sys
sys.stdout.reconfigure(encoding="utf-8")
from sympy import symbols, simplify, expand, summation, Rational

n, k, j = symbols('n k j', integer=True, positive=True)

print("=" * 70)
print("选择排序：按 PPT slide 176 的逐行计数复算（外层 i=1..n-1，内层 j=i+1..n）")
print("=" * 70)
# PPT 给出的每行次数：
#   n 次             (for i = 1 to n-1 的循环头，PPT 记 n)
#   (n-1) 次         初始化 cur_min / cur_min_pos
#   sum_{k=1}^{n-1} (n-k) 次   for j = i+1 to n 的循环头
#   sum_{k=1}^{n-1} (n-k) 次   if A[j] < cur_min 比较
#   sum_{k=1}^{n-1} (n-k) 次   循环体内更新语句
#   sum_{k=0}^{n-2} (n-k) 次   末尾交换
#   (n-1) 次         ...
S1 = summation(n - k, (k, 1, n - 1))
S2 = summation(n - k, (k, 0, n - 2))
print("sum_{k=1..n-1}(n-k) =", simplify(S1))
print("sum_{k=0..n-2}(n-k) =", simplify(S2))

T_sel_ppt = 2*n**2 + 3*n - 4
print("\nPPT 文字抽取值     2n^2 + 3n - 4  =", T_sel_ppt)
combo = n + (n-1) + 3*S1 + S2 + (n-1)
print("由逐行次数组合       n + (n-1) + 3*S1 + S2 + (n-1) =", expand(simplify(combo)))
print("是否吻合:", expand(simplify(combo)) == expand(T_sel_ppt))
print("若按 2/3 系数 (2/3)n^2+3n-4 是否吻合:",
      expand(simplify(combo)) == expand(Rational(2,3)*n**2 + 3*n - 4))

print()
print("=" * 70)
print("插入排序：按 PPT slide 175 的逐行计数复算（最坏情况）")
print("=" * 70)
# n, n-1, n-1, sum_{j=2..n} j, sum_{j=2..n}(j-1), sum_{j=2..n}(j-1), n-1
A1 = summation(j, (j, 2, n))
A2 = summation(j - 1, (j, 2, n))
print("sum_{j=2..n} j     =", simplify(A1))
print("sum_{j=2..n}(j-1)  =", simplify(A2))
T_ins = n + (n-1) + (n-1) + A1 + A2 + A2 + (n-1)
print("逐行组合 =", expand(simplify(T_ins)))
target = Rational(3,2)*n**2 + Rational(7,2)*n - 4
print("PPT 文字抽取值 3/2 n^2 + 7/2 n - 4 =", target)
print("是否吻合:", expand(simplify(T_ins)) == expand(target))
print()
print("n=16 时：插入排序 =", T_ins.subs(n, 16), " 选择排序(2n^2+3n-4) =", T_sel_ppt.subs(n, 16),
      " 选择排序(2/3 n^2+3n-4) =", (Rational(2,3)*n**2+3*n-4).subs(n,16))
print()
print("渐近阶：都等价于 Theta(n^2) ——",
      "插入 n^2 系数", Rational(3,2), "；选择 n^2 系数", 2, "或", Rational(2,3))
