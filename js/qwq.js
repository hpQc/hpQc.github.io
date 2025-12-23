// CSS 部分通过 JS 插入
const css = `
.translateSelectLanguage{
  position: fixed;
  bottom:50px;
  right:-300px;
  width: 10%;
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  appearance: none; /* 隐藏默认箭头 */
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: rgb(234, 234, 234);
} 
[data-theme="dark"] .translateSelectLanguage{
  background-color: rgb(106, 106, 106);
  color: rgb(234, 234, 234);
}
.translateSelectLanguage:hover {
  border-color: #007bff;
}
.translateSelectLanguage:focus {
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
  border-color: #007bff;
}
.recent-post-item:nth-child(2){
    display: none;/*隐藏多余冰箱贴*/
}
.aplayer.aplayer-fixed.aplayer-narrow .aplayer-body{
    left:-66px!important;
    transition-delay: 2s;
}/*隐藏播放器*/
.aplayer.aplayer-fixed.aplayer-narrow .aplayer-body:hover{
    left:0!important;
    transition-delay: 0s;
}
.aplayer .aplayer-body{
    bottom: 36px !important;
}
.aplayer.no-destroy.no-reload.aplayer-withlist.aplayer-fixed{
  bottom: 36px !important;
}
/*aplayer日间模式调整*/
/*背景色*/
.aplayer{
	background: rgba(255, 255, 255, 0.60)!important;
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07),0 1px 5px 0 rgba(0,0,0,.1);
	position: relative;
}
.aplayer.aplayer-fixed .aplayer-lrc:after,.aplayer.aplayer-fixed .aplayer-lrc:before {
	display: none
}
.aplayer.aplayer.aplayer-fixed .aplayer-body{
	background:rgba(255, 255, 255, 0.60)!important;
	box-shadow: 0 2px 2px 0 rgba(0,0,0,.07),0 1px 5px 0 rgba(0,0,0,.1);
	position: fixed;
}
/*毛玻璃效果*/
.aplayer-list{
	backdrop-filter: blur(3px);
}
.aplayer-info{
	backdrop-filter: blur(3px);
}
/*滚动条*/
.aplayer .aplayer-list ol::-webkit-scrollbar {
	width: 5px
}
.aplayer .aplayer-list ol::-webkit-scrollbar-thumb {
	border-radius: 3px;
	background-color: #b0e1ff
}
.aplayer .aplayer-list ol::-webkit-scrollbar-thumb:hover {
	background-color: #b0e1ff
}
/*圆角*/
.aplayer.aplayer-fixed .aplayer-list{
    border-radius: 6px 6px 0 0!important;
}
.aplayer.aplayer-fixed .aplayer-miniswitcher{
    border-radius: 0 6px 6px 0!important;
}
.aplayer.aplayer-fixed.aplayer-narrow .aplayer-body{
    border-radius: 6px!important;
}	
.aplayer-body{
    border-radius:0 6px 6px 0!important;
}
.aplayer.no-destroy.no-reload.aplayer-withlist.aplayer-fixed{
    border-radius:6px 6px 0 0!important;
}
/*选中与播放中歌曲激活颜色*/
.aplayer .aplayer-list ol li:hover{
    background: #b0e1ff!important;
}
.aplayer .aplayer-list ol li.aplayer-list-light{
    background: #ffdffa!important;
}
/*aplayer黑暗模式*/
[data-theme=dark]
.aplayer{
    background: rgba(22, 22, 22, 0.60)!important;
    color: rgb(255, 255, 255);
	box-shadow: 0 2px 2px 0 rgba(0,0,0,.07),0 1px 5px 0 rgba(0,0,0,.1);
}
[data-theme=dark]
.aplayer.aplayer-fixed .aplayer-body{
    background: rgba(22, 22, 22, 0.60)!important;
    color: rgb(255, 255, 255);
	box-shadow: 0 2px 2px 0 rgba(0,0,0,.07),0 1px 5px 0 rgba(0,0,0,.1);
}
[data-theme=dark]
.aplayer .aplayer-info .aplayer-controller .aplayer-time .aplayer-icon path{
	fill: #d4d4d4;
}
[data-theme=dark]	
.aplayer .aplayer-list ol li:hover{
    background: #407290!important;
}
[data-theme=dark]
.aplayer .aplayer-list ol li.aplayer-list-light{
    background: #9c8098!important;
}
[data-theme=dark]
.aplayer .aplayer-info .aplayer-controller .aplayer-time{
    color: #d4d4d4;
}
[data-theme=dark]
.aplayer .aplayer-list ol li .aplayer-list-index{
    color: #d4d4d4;
}
[data-theme=dark]
.aplayer .aplayer-list ol li .aplayer-list-author{
    color: #d4d4d4;
}
.thumbnail{
    border-radius: 10px;
}
`;
// 将 CSS 添加到页面
const style = document.createElement('style');
style.innerHTML = css;
document.head.appendChild(style);
//翻译提醒通知
// 创建通知容器
function createNotificationContainer() {
  let notificationContainer = document.getElementById('translate-notification');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'translate-notification';
    notificationContainer.style.cssText = `
    position: fixed;
    width: 50%;
    min-height: 50px;
    bottom: 10%;
    right: 25%;
    margin: auto;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 14px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    opacity: 0;
    transform: translate3d(0, 20px, 0);
    transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    document.body.appendChild(notificationContainer);
  }
  return notificationContainer;
}
// 显示通知
function showNotification(message, duration = 5000) {
  const notification = createNotificationContainer();
  notification.innerHTML = `
    ${message}
    <span style="margin-left: 10px; cursor: pointer; color: #00aaff;" onclick="dismissNotification()">OK</span>
  `;
  notification.style.opacity = '1';
  notification.style.transform = 'translateY(0)';

  // 自动隐藏通知
  if (duration > 0) {
    setTimeout(() => {
      dismissNotification();
    }, duration);
  }
}
// 隐藏通知
function dismissNotification() {
  const notification = document.getElementById('translate-notification');
  if (notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
}
// 提示浏览器翻译功能
function promptBrowserTranslate(targetLanguage) {
  const userLanguage = navigator.language || navigator.userLanguage;
  const htmlLanguage = document.documentElement.lang || 'zh';

  console.log('User browser language:', userLanguage);
  console.log('Page declared language:', htmlLanguage);

  const isChinesePage = htmlLanguage.startsWith('zh');
  const isChineseBrowser = userLanguage.startsWith('zh');

  // 如果用户浏览器是中文，且页面语言也是中文，无需翻译
  if (isChineseBrowser && isChinesePage) {
    // console.log('Both user language and page language are Chinese, no translation needed.');
    return;
  }

  // 检查用户是否已经处理过通知
  if (localStorage.getItem('translatePromptAcknowledged') === 'true') {
    // console.log('User has already acknowledged the translation prompt, no more popups.');
    return;
  }

// 非阻塞伪类通知
showNotification(
  `Detected that the current page is in Chinese. Would you like to enable the browser's translation feature to translate the page content into ${targetLanguage || 'the target language'}? You can also adjust the language in the blog's bottom-right corner settings - Language.:D`,
  0 // 不自动关闭，用户必须点击关闭
);


  // 用户确认后记录状态
  document
    .getElementById('translate-notification')
    .querySelector('span')
    .addEventListener('click', () => {
      localStorage.setItem('translatePromptAcknowledged', 'true');
    });
}

// 页面加载完成事件
document.addEventListener('DOMContentLoaded', () => {
  // console.log('Page loaded, initializing language detection...');
  promptBrowserTranslate('English');
});

// PJAX 页面切换完成事件
document.addEventListener('pjax:complete', () => {
  // console.log('PJAX load completed, reinitializing language detection...');
  promptBrowserTranslate('English');
});

//翻译选择框
// 控制 .translateSelectLanguage 的显示与隐藏
let languageBoxClickCount = 0;
function languageBox() {
  const languageBox = document.querySelector('.translateSelectLanguage');
  if (!languageBox) {
    console.warn('.translateSelectLanguage element not found.');
    return;
  }

  const isOpen = languageBox.style.right === '60px';

  if (isOpen) {
    languageBox.style.right = '-300px'; // 隐藏到屏幕外
  } else {
    languageBox.style.right = '60px'; // 显示在屏幕内

    // 点击页面其他地方时自动隐藏
    const clickHandler = (event) => {
      const target = event.target;
      if (!languageBox.contains(target) && target.closest('.translateSelectLanguage') === null) {
        languageBox.style.right = '-300px';
        document.removeEventListener('click', clickHandler); // 移除事件监听
      }
    };

    setTimeout(() => {
      document.addEventListener('click', clickHandler);
    }, 0); // 延迟绑定事件，避免点击按钮本身触发隐藏
  }

  languageBox.style.transition = 'right 0.4s ease-in-out'; // 添加动画过渡
}

//翻译
translate.selectLanguageTag.languages = 'english,chinese_simplified,korean,Japanese';
translate.request.listener.start();
translate.language.setLocal('chinese_simplified'); //设置本地语种（当前网页的语种）。如果不设置，默认自动识别当前网页显示文字的语种。 可填写如 'english'、'chinese_simplified' 等，具体参见文档下方关于此的说明。
translate.service.use('client.edge'); //设置机器翻译服务通道，直接客户端本身，不依赖服务端 。相关说明参考 http://translate.zvo.cn/43086.html
translate.execute();//进行翻译