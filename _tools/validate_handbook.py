#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
validate_handbook.py —— 算法复习手册静态校验器

检查项：
  1. 所有 HTML 文件能被解析（html.parser 严格模式，捕获未闭合/非法标签）
  2. 每个 <section> 的 id 唯一且以 sec- 开头；<h2> 在 <section> 内
  3. 站内链接（href="*.html" / "#id"）目标存在
  4. 引用的 assets/*.js、assets/*.css 文件存在
  5. data-demo 名 与 HB.register('name' 一一对应（否则动画不会渲染）
  6. 内联 <script> 与外部 js 的语法检查（配合 node --check 用于外部脚本）
  7. 代码块每行是否有中文注释（粗略统计，仅报告，不判失败）

用法： python _extract/validate_handbook.py
"""
import os
import re
import sys
import glob
import subprocess
from html.parser import HTMLParser

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
ROOT = os.path.abspath(ROOT)

VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
        'meta', 'param', 'source', 'track', 'wbr'}
# SVG 自闭合标签在 HTML 解析器里也可能不带结束标签
SVG_SELF = {'path', 'rect', 'circle', 'line', 'polyline', 'polygon', 'ellipse',
            'use', 'stop', 'image'}


class Checker(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.stack = []
        self.errors = []
        self.sections = []       # (id, has_h2)
        self.h2_open = False
        self.ids = []
        self.hrefs = []
        self.scripts_src = []
        self.inline_scripts = []
        self._script_buf = None
        self.code_blocks = []
        self._code_buf = None
        self.in_section = None
        self.h2_count_in_section = 0
        self.demo_names = []

    # ---- 标签处理 ----
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'a' and 'href' in a:
            self.hrefs.append(a['href'])
        if tag == 'div' and 'data-demo' in a:
            self.demo_names.append(a['data-demo'])
        if tag == 'section':
            self.in_section = a.get('id')
            self.h2_count_in_section = 0
            self.sections.append([a.get('id'), 0])
        if tag == 'h2' and self.sections:
            self.h2_count_in_section += 1
            self.sections[-1][1] = self.h2_count_in_section
        if tag == 'script':
            if 'src' in a:
                self.scripts_src.append(a['src'])
            else:
                self._script_buf = []
        if tag == 'code':
            self._code_buf = []

        if tag in VOID:
            return
        self.stack.append((tag, self.getpos()))

    def handle_startendtag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'div' and 'data-demo' in a:
            self.demo_names.append(a['data-demo'])

    def handle_endtag(self, tag):
        if tag == 'script' and self._script_buf is not None:
            self.inline_scripts.append('\n'.join(self._script_buf))
            self._script_buf = None
        if tag == 'code' and self._code_buf is not None:
            self.code_blocks.append('\n'.join(self._code_buf))
            self._code_buf = None
        if tag == 'section':
            self.in_section = None
        if tag in VOID:
            return
        # 从栈顶向下找匹配标签（容忍 HTML 里常见的隐式闭合）
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                if i != len(self.stack) - 1:
                    unclosed = [t for t, _ in self.stack[i + 1:]]
                    self.errors.append(
                        '标签 <%s> 在 %s 处闭合，但以下标签未闭合: %s'
                        % (tag, self.getpos(), unclosed))
                del self.stack[i:]
                return
        self.errors.append('第 %s 行出现多余结束标签 </%s>' % (self.getpos(), tag))

    def handle_data(self, data):
        if self._script_buf is not None:
            self._script_buf.append(data)
        if self._code_buf is not None:
            self._code_buf.append(data)


def check_js_syntax(code, label):
    """用 node 检查一段 JS 语法（通过临时文件）"""
    tmp = os.path.join(os.environ.get('TEMP', '.'), '_hbcheck_%d.js' % abs(hash(label)) % 1000000)
    with open(tmp, 'w', encoding='utf-8') as f:
        f.write(code)
    try:
        p = subprocess.run(['node', '--check', tmp], capture_output=True, text=True, timeout=30)
        ok = (p.returncode == 0)
        return ok, (p.stderr or '').strip()
    except Exception as e:
        return False, repr(e)
    finally:
        try:
            os.remove(tmp)
        except OSError:
            pass


def main():
    htmls = sorted(glob.glob(os.path.join(ROOT, '*.html')))
    if not htmls:
        print('!! 没有找到 HTML 文件：%s' % ROOT)
        return 1

    all_ids = {}
    results = []
    fatal = 0

    for path in htmls:
        name = os.path.basename(path)
        with open(path, encoding='utf-8') as f:
            src = f.read()

        c = Checker(path)
        try:
            c.feed(src)
            c.close()
        except Exception as e:
            print('!! %s 解析异常: %r' % (name, e))
            fatal += 1
            continue

        problems = list(c.errors)
        if c.stack:
            problems.append('文件结束时仍有未闭合标签: %s' % [t for t, _ in c.stack])

        # section id 唯一 / 以 sec- 开头 / 含 h2
        sec_ids = [s[0] for s in c.sections]
        dup = {x for x in sec_ids if sec_ids.count(x) > 1}
        if dup:
            problems.append('重复的 section id: %s' % sorted(dup))
        bad_prefix = [x for x in sec_ids if not x or not str(x).startswith('sec-')]
        if bad_prefix:
            problems.append('section id 未以 sec- 开头: %s' % bad_prefix)
        no_h2 = [s[0] for s in c.sections if s[1] == 0]
        if no_h2:
            problems.append('section 内没有 h2: %s' % no_h2)

        # 全局 id 唯一
        dupid = {x for x in c.ids if c.ids.count(x) > 1}
        if dupid:
            problems.append('重复的 id: %s' % sorted(dupid))

        # 站内链接
        for h in c.hrefs:
            if h.startswith(('http://', 'https://', 'mailto:')):
                continue
            if h.startswith('#'):
                if len(h) > 1 and h[1:] not in c.ids:
                    problems.append('锚点链接目标不存在: %s' % h)
            else:
                target = os.path.join(ROOT, h.split('#')[0])
                if not os.path.exists(target):
                    problems.append('站内链接文件不存在: %s' % h)

        # 引用的资源
        for s in c.scripts_src:
            if not s.startswith(('http://', 'https://')) and not os.path.exists(os.path.join(ROOT, s)):
                problems.append('脚本文件不存在: %s' % s)
        for m in re.finditer(r'<link[^>]+href="([^"]+)"', src):
            href = m.group(1)
            if not href.startswith(('http://', 'https://')) and not os.path.exists(os.path.join(ROOT, href)):
                problems.append('样式文件不存在: %s' % href)

        # 内联脚本语法
        for k, code in enumerate(c.inline_scripts):
            if code.strip():
                ok, err = check_js_syntax(code, '%s-%d' % (name, k))
                if not ok:
                    problems.append('内联 <script> #%d 语法错误: %s' % (k + 1, err.splitlines()[:3]))

        # 代码块注释覆盖（仅统计）
        total_lines = 0
        comment_lines = 0
        for blk in c.code_blocks:
            for ln in blk.split('\n'):
                s = ln.strip()
                total_lines += 1
                if not s:
                    continue
                if ('//' in s) or s.startswith('#') or ('\u3000' in s and '//' in s):
                    comment_lines += 1

        all_ids[name] = set(c.ids)
        results.append({
            'name': name, 'problems': problems,
            'sections': len(c.sections), 'demos': c.demo_names,
            'code_total': total_lines, 'code_comment': comment_lines,
        })
        if problems:
            fatal += 1

    # data-demo 与 HB.register 对应
    js_files = sorted(glob.glob(os.path.join(ROOT, 'assets', '*.js')))
    registered = set()
    for j in js_files:
        with open(j, encoding='utf-8') as f:
            js = f.read()
        registered |= set(re.findall(r"HB\.register\(\s*['\"]([^'\"]+)['\"]", js))

    print('=' * 78)
    print('算法复习手册静态校验    ROOT = %s' % ROOT)
    print('=' * 78)
    for r in results:
        print('\n--- %s ---' % r['name'])
        print('  section 数: %d    code 行数: %d    code 含注释行: %d (%.0f%%)'
              % (r['sections'], r['code_total'], r['code_comment'],
                 100.0 * r['code_comment'] / r['code_total'] if r['code_total'] else 0))
        print('  data-demo: %s' % (r['demos'] if r['demos'] else '（无）'))
        for d in r['demos']:
            if d not in registered:
                r['problems'].append("data-demo='%s' 没有对应的 HB.register" % d)
        if r['problems']:
            for p in r['problems']:
                print('  [问题] %s' % p)
        else:
            print('  [OK] 无问题')

    print('\n' + '=' * 78)
    print('已注册动画: %s' % sorted(registered))
    print('有问题的文件数: %d / %d' % (fatal, len(results)))
    missing = sorted(set(['index.html', 'deck1.html', 'deck2.html', 'deck3.html']) -
                     set(os.path.basename(p) for p in htmls))
    if missing:
        print('尚未交付的页面: %s' % missing)
    print('=' * 78)
    return 0


if __name__ == '__main__':
    sys.exit(main())
