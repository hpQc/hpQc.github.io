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
@media screen and (min-width: 1024px) {
    .tk-master .tk-avatar {
        position: relative;
        left: 0!important;
    }
}
@media screen and (min-width: 1024px) {
    .tk-master .tk-content {
        width: fit-content!important;
    }
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
      bottom: 10%;
      right: 25%;
      margin:auto;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 14px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      opacity: 0;
      transform: translateY(20px);
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
translate.selectLanguageTag.languages = 'english,chinese_simplified,korean,Japanese,chinese_traditional';
translate.request.listener.start();
translate.language.setLocal('chinese_simplified'); //设置本地语种（当前网页的语种）。如果不设置，默认自动识别当前网页显示文字的语种。 可填写如 'english'、'chinese_simplified' 等，具体参见文档下方关于此的说明。
translate.service.use('client.edge'); //设置机器翻译服务通道，直接客户端本身，不依赖服务端 。相关说明参考 http://translate.zvo.cn/43086.html
translate.execute();//进行翻译