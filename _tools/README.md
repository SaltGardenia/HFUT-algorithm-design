# 复习手册自检工具

这些脚本用于验证本手册的完整性与正确性，**不影响阅读**，可整体删除。
运行环境：Python 3.10+（需 `sympy` 仅用于 `verify_counts.py`）与 Node.js 18+。

## 脚本

| 文件 | 用途 | 运行方式 |
|---|---|---|
| `validate_handbook.py` | 静态校验：HTML 闭合、`<section>` id 唯一、`<h2>` 归属、站内链接与资源引用、`data-demo` 与 `HB.register` 一一对应、内联脚本语法 | `python _tools/validate_handbook.py` |
| `check_comments.py` | 严格核查「每个代码块每一行都有中文注释」 | `python _tools/check_comments.py` |
| `test_demos.js` | 无头 DOM 沙箱：真实执行 `assets/demos-*.js`，把全部动画的 `reset/prev/next` 全步走一遍 | `node _tools/test_demos.js` |
| `test_integration.js` | 端到端集成：真实解析 `index/deck*.html` 建 DOM → 真实触发 `handbook.js` 的 boot 时序 → 断言目录条目数 = 标题数 → 真实点击每个动画的 4 个按钮 → 断言渲染出 `<svg>` 且坐标合法 | `node _tools/test_integration.js` |
| `verify_counts.py` | 用 sympy 复算插入排序 / 选择排序的逐行计数，交叉验证 PPT 给出的 T(n) 结论 | `python _tools/verify_counts.py` |
| `verify_deck4.py` | 独立复算线性时间排序一讲的关键数据：计数排序算例逐帧、稳定性、基数排序逐趟、决策树下界数值校验 | `python _tools/verify_deck4.py` |
| `verify_new_decks.py` | 独立复算第 4~7 讲关键数据：最大最小比较次数、RANDOMIZED-SELECT 期望（蒙特卡洛）、快速幂乘法次数、整数划分、矩阵链 m/s 表、LCS c 表、OBST e 表、Prim MST 权值、哈夫曼码长与平均码长、活动选择贪心正确性、0-1 背包反例 | `python _tools/verify_new_decks.py` |
| `patch_nav.py` | 批量补齐各页 `site-nav` 导航项（新增讲次时用，幂等） | `python _tools/patch_nav.py` |
| `all_text.txt` | 八份 PPT 的全部文字抽取（含公式图片位置标记），手册内容的取材依据 | 只读参考 |
| `outline.txt` | 八份 PPT 的逐页标题清单，便于对照页码 | 只读参考 |

## 一次性全量核验

在手册根目录（本文件所在目录的上一级）执行：

```bash
python _tools/validate_handbook.py
python _tools/check_comments.py
python _tools/verify_counts.py
python _tools/verify_deck4.py
python _tools/verify_new_decks.py
node   _tools/test_demos.js
node   _tools/test_integration.js
```

期望结果：静态校验 `有问题的文件数: 0 / 9`；注释核查 `合计缺少注释的代码行: 0`；
三个 verify 脚本全部断言通过；两个 Node 脚本分别输出
「全部动画通过无头执行测试」与「端到端集成测试全部通过」。

## 关于 `_tools` 的说明

`validate_handbook.py` / `check_comments.py` / `test_demos.js` / `test_integration.js`
默认从脚本自身的上一级目录（即手册根目录）开始查找页面与资源，
因此这几个脚本**放在 `_tools/` 下即可直接运行**，无需改路径。
`verify_counts.py` / `verify_deck4.py` / `verify_new_decks.py` 是纯计算脚本，不读页面，放哪里都能跑。
