# 阅读索引与年度系列维护

两站独立构建。中文根路径是 /，英文根路径是 /en/；不要在索引数据中手写日期 URL，也不要让构建读取另一仓库。

## 添加已有笔记

1. 确认文章已在 source/_posts 发布，有真实 date 和已有 description。不要编造读完日期、评分、推荐语。
2. 在 source/_data/discovery.yml 的 reading 添加 post（不含 .md 的精确文件名）、kind 和可选 aliases。
3. kind 只允许 book-note、book-screen、external-review。外链书评仍链接到原博客入口页。
4. aliases 只使用已有标题、配对译名或有依据的称呼，不堆叠关键词。标题、日期、摘要、链接由文章模型读取。
5. 如另一语种已有对应文章，在另一仓库单独维护对应数据，不生成不存在的翻译链接。

## 添加年度总结

在 series 的 year-in-review.items 添加 post 和总结年份 year。年份不是发表年份；同年不可重复。只加入已发布且确属该系列的文章。前后导航按 year 排序，首尾不循环。不要创建空的 /series/ 页面。

## 验证

使用 Node 24，执行 npm ci、npm run check、npm run validate:reading、npm run validate:discovery。
检查 /reading/、/series/year-in-review/（英文加 /en/），以及新增条目和系列首尾。
搜索保持原有 NeXT local search 及快捷键，不新增搜索页、搜索词采集或搜索运行库。

## 兼容补丁与边界

tools/patch-markdown-renderer.cjs 在安装和构建前应用经批准的 renderer 7.1.1 最小补丁：从解析器实际 token 实例获取构造器，避免导入 markdown-it 私有路径。版本或源码不符就失败，需要重新审查，不能删除保护检查。
scripts/markdown-compat.js 保留已有裸域名自动链接行为。公式、脚注、HTML、表格和锚点夹具由 prebuild 执行。

模板是固定 NeXT 8.27.0 的受控副本。升级主题前比较原模板，不能直接修改 themes/next、手改 public 或手工修补 node_modules。
静态历史评论、Utterances、图片和文章观点不属于索引维护范围。

2026-09-09 经作者批准，最多比较两个替代库后停止：MiniSearch 与 FlexSearch 在本站手机模拟下均未通过首次搜索耗时门槛，因此保留原搜索。Pagefind 试验也未通过，试验源码与证据仅保存在 workspace/review，不随博客发布。
侧车 aliases 保留为已核对的元数据，但当前旧搜索不读取它们；不要宣称别名搜索已上线。
发布需要作者另行批准；本轮命令不包含提交、推送或部署。
