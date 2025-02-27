import{_ as i,c as l,o as a,ae as r}from"./chunks/framework.BHrE6nLq.js";const o="/assets/6.jpg",p=JSON.parse('{"title":"常见问题","description":"","frontmatter":{"title":"常见问题"},"headers":[],"relativePath":"guide/faq.md","filePath":"guide/faq.md"}'),e={name:"guide/faq.md"};function n(s,t,g,h,d,u){return a(),l("div",null,t[0]||(t[0]=[r('<div style="width:100%;height:300px;overflow:hidden;margin-bottom:20px;"><img src="'+o+'" alt="头部图片" style="width:100%;height:auto;object-fit:cover;"></div><h1 id="❓-起点站-常见问题" tabindex="-1">❓ 起点站 常见问题 <a class="header-anchor" href="#❓-起点站-常见问题" aria-label="Permalink to &quot;❓ 起点站 常见问题&quot;">​</a></h1><h2 id="❓-为什么播放会卡顿" tabindex="-1">❓ 为什么播放会卡顿？ <a class="header-anchor" href="#❓-为什么播放会卡顿" aria-label="Permalink to &quot;❓ 为什么播放会卡顿？&quot;">​</a></h2><p>检查线路，cdn线路可不用梯子： 这个问题可能会在部分设备和客户端上有所影响，导致观看时卡顿。从理论上讲，播放流畅与否可能由多个因素决定：</p><ol><li><strong>服务器带宽较低以及负载</strong></li><li><strong>用户网络连接问题</strong></li><li><strong>视频编码格式较新或设备不支持的编码</strong>（例如较高比特率的 4K 视频），播放器软件有时无法自动转码</li></ol><p>如果服务器带宽较低，比如带宽卡顿、网络环境较差，或者用户本地设备性能不佳（解码能力差），那么播放流畅度会受影响。此外，4K 视频往往码率较高，设备硬件解码能力不足时，也会造成画面卡顿。</p><h3 id="优化建议" tabindex="-1"><strong>优化建议</strong> <a class="header-anchor" href="#优化建议" aria-label="Permalink to &quot;**优化建议**&quot;">​</a></h3><ul><li>选择较低码率的视频</li><li>服务器端调整带宽占用，减少负载</li><li>设备端更换解码能力更强的播放器</li></ul><hr><h2 id="🎞️-播放提示-没有兼容的流" tabindex="-1">🎞️ 播放提示 <strong>“没有兼容的流”</strong> <a class="header-anchor" href="#🎞️-播放提示-没有兼容的流" aria-label="Permalink to &quot;🎞️ 播放提示 **“没有兼容的流”**&quot;">​</a></h2><ul><li>大多数情况是视频文件为 <strong>VC-1 / H.263 / 10bit 编码</strong>，所以会出现这个报错，建议转换格式再播放</li><li>亦有可能是播放器 <strong>Bug</strong>，请尝试更换播放器</li><li>部分设备不支持某些视频格式，建议测试不同版本播放器，以匹配最佳效果</li></ul><hr><h2 id="🎬-为什么无法成功加载服务器" tabindex="-1">🎬 为什么无法成功加载服务器？ <a class="header-anchor" href="#🎬-为什么无法成功加载服务器" aria-label="Permalink to &quot;🎬 为什么无法成功加载服务器？&quot;">​</a></h2><ul><li>服务器地址错误，建议检查地址拼写</li><li>网络环境问题（国内部分网络可能受限）</li><li>服务器端口未正确开放</li><li>播放器 版本过旧或 Bug，建议升级</li><li><strong>Emby 账号被封禁</strong>（请检查是否违反规定）</li><li>客户端缓存问题，建议清除缓存后重试</li><li>服务器负载过高，建议错峰访问</li><li>网络代理导致连接失败，建议关闭代理后尝试</li></ul><hr><h2 id="🚀-为什么搜索不到电影-剧集" tabindex="-1">🚀 为什么搜索不到电影/剧集？ <a class="header-anchor" href="#🚀-为什么搜索不到电影-剧集" aria-label="Permalink to &quot;🚀 为什么搜索不到电影/剧集？&quot;">​</a></h2><p>如果搜索不到电影或剧集，可能是索引问题或数据未同步。建议：</p><ul><li>确保 <strong>服务器端元数据更新</strong>，可在 播放器 设置里 <strong>手动刷新库</strong></li><li>检查 <strong>影片命名格式</strong>，确保符合 播放器 的识别规则</li><li>可能是 <strong>数据库损坏</strong>，建议 <strong>重新扫描库</strong></li><li>服务器端日志可能会显示详细错误信息，可以查看日志文件</li></ul><hr><h2 id="🎭-为什么播放画面出现错误" tabindex="-1">🎭 为什么播放画面出现错误？ <a class="header-anchor" href="#🎭-为什么播放画面出现错误" aria-label="Permalink to &quot;🎭 为什么播放画面出现错误？&quot;">​</a></h2><p>如果播放画面异常，例如黑屏、卡顿、字幕不同步，可能是：</p><ul><li><strong>解码方式不兼容</strong>（建议切换软件解码/硬件解码）</li><li><strong>播放器版本过旧</strong>（请更新播放器）</li><li><strong>字幕格式不兼容</strong>（部分 SSA/ASS 字幕可能存在问题）</li><li><strong>视频编码格式不支持</strong>（某些特殊编码设备可能无法解码）</li><li><strong>播放器 Bug</strong>（建议尝试更换不同的播放器）</li></ul>',22)]))}const _=i(e,[["render",n]]);export{p as __pageData,_ as default};
