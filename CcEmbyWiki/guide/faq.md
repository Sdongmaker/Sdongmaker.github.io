---
title: 常见问题
---
<div style="width: 100%; height: 300px; overflow: hidden; margin-bottom: 20px;">
    <img src="/assets/6.jpg" alt="头部图片" style="width: 100%; height: auto; object-fit: cover;">
</div>

# ❓ 起点站 常见问题

## ❓ 为什么播放会卡顿？
检查线路，cdn线路可不用梯子：
这个问题可能会在部分设备和客户端上有所影响，导致观看时卡顿。从理论上讲，播放流畅与否可能由多个因素决定：

1. **服务器带宽较低以及负载**
2. **用户网络连接问题**
3. **视频编码格式较新或设备不支持的编码**（例如较高比特率的 4K 视频），播放器软件有时无法自动转码

如果服务器带宽较低，比如带宽卡顿、网络环境较差，或者用户本地设备性能不佳（解码能力差），那么播放流畅度会受影响。此外，4K 视频往往码率较高，设备硬件解码能力不足时，也会造成画面卡顿。

### **优化建议**
- 选择较低码率的视频
- 服务器端调整带宽占用，减少负载
- 设备端更换解码能力更强的播放器

---

## 🎞️ 播放提示 **“没有兼容的流”**
- 大多数情况是视频文件为 **VC-1 / H.263 / 10bit 编码**，所以会出现这个报错，建议转换格式再播放
- 亦有可能是播放器 **Bug**，请尝试更换播放器
- 部分设备不支持某些视频格式，建议测试不同版本播放器，以匹配最佳效果

---

## 🎬 为什么无法成功加载服务器？
- 服务器地址错误，建议检查地址拼写
- 网络环境问题（国内部分网络可能受限）
- 服务器端口未正确开放
- 播放器 版本过旧或 Bug，建议升级
- **Emby 账号被封禁**（请检查是否违反规定）
- 客户端缓存问题，建议清除缓存后重试
- 服务器负载过高，建议错峰访问
- 网络代理导致连接失败，建议关闭代理后尝试

---

## 🚀 为什么搜索不到电影/剧集？
如果搜索不到电影或剧集，可能是索引问题或数据未同步。建议：
- 确保 **服务器端元数据更新**，可在 播放器 设置里 **手动刷新库**
- 检查 **影片命名格式**，确保符合 播放器 的识别规则
- 可能是 **数据库损坏**，建议 **重新扫描库**
- 服务器端日志可能会显示详细错误信息，可以查看日志文件

---

## 🎭 为什么播放画面出现错误？
如果播放画面异常，例如黑屏、卡顿、字幕不同步，可能是：
- **解码方式不兼容**（建议切换软件解码/硬件解码）
- **播放器版本过旧**（请更新播放器）
- **字幕格式不兼容**（部分 SSA/ASS 字幕可能存在问题）
- **视频编码格式不支持**（某些特殊编码设备可能无法解码）
- **播放器 Bug**（建议尝试更换不同的播放器）
