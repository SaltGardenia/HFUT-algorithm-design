#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check_comments.py —— 严格核查「每个代码块每一行都有中文注释」

规则：
  - 提取页面里所有 <pre class="code"> 内的 <code> 文本
  - 忽略空行
  - 忽略不承载逻辑的“纯结构行”：单独的 { } } else { 等，以及纯注释行本身
  - 其余每一行都必须出现注释标记：// 、# 、/* 、<!-- 或全角注释引导
  - 另外报告“注释里没有中文”的行

用法： python _extract/check_comments.py
"""
import os
import re
import sys
import glob
import html

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                   '..'))

CJK = re.compile(r'[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]')

# 允许“无注释也不算错”的纯结构行
STRUCTURAL = re.compile(r'^\s*(\{|\}|\)|\(|else\s*\{?|else|\}\s*else\s*\{|then|do|'
                        r'```|/\*.*\*/|//.*|#.*|\*.*)\s*$')


def code_blocks(src):
    """提取 <pre class="code..."> ... <code> ... </code> ... </pre> 的内容"""
    out = []
    for m in re.finditer(r'<pre[^>]*class="[^"]*\bcode\b[^"]*"[^>]*>(.*?)</pre>',
                         src, re.S | re.I):
        inner = m.group(1)
        cm = re.search(r'<code[^>]*>(.*?)</code>', inner, re.S | re.I)
        body = cm.group(1) if cm else inner
        body = re.sub(r'<[^>]+>', '', body)
        out.append(html.unescape(body))
    return out


def main():
    total_missing = 0
    for path in sorted(glob.glob(os.path.join(ROOT, '*.html'))):
        name = os.path.basename(path)
        with open(path, encoding='utf-8') as f:
            src = f.read()
        blocks = code_blocks(src)
        missing = []
        no_cjk = []
        n_lines = 0
        for bi, blk in enumerate(blocks, 1):
            for li, line in enumerate(blk.split('\n'), 1):
                if not line.strip():
                    continue
                n_lines += 1
                s = line.strip()
                has_marker = ('//' in s) or s.startswith('#') or ('/*' in s and '*/' in s)
                if has_marker:
                    # 注释里是否有中文
                    idx = s.find('//')
                    if idx < 0:
                        idx = 0 if s.startswith('#') else s.find('/*')
                    comment_part = s[idx:]
                    if not CJK.search(comment_part):
                        no_cjk.append((bi, li, s[:70]))
                elif STRUCTURAL.match(s):
                    pass
                else:
                    missing.append((bi, li, s[:70]))
        print('--- %s ---' % name)
        print('  代码块数: %d   非空代码行: %d' % (len(blocks), n_lines))
        if missing:
            total_missing += len(missing)
            print('  [缺少注释] %d 行:' % len(missing))
            for bi, li, s in missing[:20]:
                print('     块%d 行%d: %s' % (bi, li, s))
            if len(missing) > 20:
                print('     … 其余 %d 行' % (len(missing) - 20))
        else:
            print('  [OK] 所有非结构行都有注释标记')
        if no_cjk:
            print('  [提示] %d 行注释不含中文（英文注释，可接受但建议中文）:' % len(no_cjk))
            for bi, li, s in no_cjk[:8]:
                print('     块%d 行%d: %s' % (bi, li, s))
        print()
    print('=' * 70)
    print('合计缺少注释的代码行: %d' % total_missing)
    print('=' * 70)
    return 0


if __name__ == '__main__':
    sys.exit(main())
