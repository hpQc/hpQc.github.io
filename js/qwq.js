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
/* 仅作用于左下角固定播放器：内嵌在正文里的 .aplayer 保持主题原样 */
.aplayer.aplayer-fixed.aplayer-narrow .aplayer-body{
    left:-66px!important;
    transition-delay: 2s;
}/*隐藏播放器*/
.aplayer.aplayer-fixed.aplayer-narrow .aplayer-body:hover{
    left:0!important;
    transition-delay: 0s;
}
/*aplayer日间模式调整*/
/*背景色*/
.aplayer.aplayer-fixed{
	background: rgba(255, 255, 255, 0.60)!important;
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07),0 1px 5px 0 rgba(0,0,0,.1);
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
.aplayer.aplayer-fixed .aplayer-list{
	backdrop-filter: blur(3px);
}
.aplayer.aplayer-fixed .aplayer-info{
	backdrop-filter: blur(3px);
}
/*滚动条*/
.aplayer.aplayer-fixed .aplayer-list ol::-webkit-scrollbar {
	width: 5px
}
.aplayer.aplayer-fixed .aplayer-list ol::-webkit-scrollbar-thumb {
	border-radius: 3px;
	background-color: #b0e1ff
}
.aplayer.aplayer-fixed .aplayer-list ol::-webkit-scrollbar-thumb:hover {
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
.aplayer.aplayer-fixed .aplayer-body{
    border-radius:0 6px 6px 0!important;
}
.aplayer.no-destroy.no-reload.aplayer-withlist.aplayer-fixed{
    border-radius:6px 6px 0 0!important;
}
/*选中与播放中歌曲激活颜色*/
.aplayer.aplayer-fixed .aplayer-list ol li:hover{
    background: #b0e1ff!important;
}
.aplayer.aplayer-fixed .aplayer-list ol li.aplayer-list-light{
    background: #ffdffa!important;
}
/*aplayer黑暗模式*/
[data-theme=dark]
.aplayer.aplayer-fixed{
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
.aplayer.aplayer-fixed .aplayer-info .aplayer-controller .aplayer-time .aplayer-icon path{
	fill: #d4d4d4;
}
[data-theme=dark]	
.aplayer.aplayer-fixed .aplayer-list ol li:hover{
    background: #407290!important;
}
[data-theme=dark]
.aplayer.aplayer-fixed .aplayer-list ol li.aplayer-list-light{
    background: #9c8098!important;
}
[data-theme=dark]
.aplayer.aplayer-fixed .aplayer-info .aplayer-controller .aplayer-time{
    color: #d4d4d4;
}
[data-theme=dark]
.aplayer.aplayer-fixed .aplayer-list ol li .aplayer-list-index{
    color: #d4d4d4;
}
[data-theme=dark]
.aplayer.aplayer-fixed .aplayer-list ol li .aplayer-list-author{
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
  const isChinesePage = htmlLanguage.startsWith('zh');
  const isChineseBrowser = userLanguage.startsWith('zh');

  // 如果用户浏览器是中文，且页面语言也是中文，无需翻译
  if (isChineseBrowser && isChinesePage) {

    return;
  }

  // 检查用户是否已经处理过通知
  if (localStorage.getItem('translatePromptAcknowledged') === 'true') {

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

  promptBrowserTranslate('English');
});

// PJAX 页面切换完成事件
document.addEventListener('pjax:complete', () => {

  promptBrowserTranslate('English');
});

//翻译选择框
// 控制 .translateSelectLanguage 的显示与隐藏
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

//翻译初始化（translate.js 4.x）
//旧版 3.2.1 没有 service.use / selectLanguageTag.languages / request.listener.start，
//直接调用会抛 TypeError，把后面所有逻辑（繁简按钮、播放器列表收起）一起中断。
//所以这里逐项做能力检测，任一环节缺失只跳过该环节，不影响其余功能。
(function initTranslate() {
  // 先把真正的 API 对象存一份引用：translate.js 会创建 id="translate" 的容器 div，
  // 同名 id 的全局访问、以及 translate.js 被重复引入时的自拦截抛错，都可能让之后
  // 再取全局 translate 时拿到的不是这个对象；繁/简按钮统一走这份引用更稳。
  if (typeof translate === 'undefined' || !translate || typeof translate.execute !== 'function') {
    console.warn('[qwq] translate.js 未加载或全局不可用，翻译功能已跳过');
    return;
  }
  window.__qwqTranslate = translate;

  const safe = (label, fn) => {
    try {
      fn();
    } catch (err) {
      console.warn('[qwq] translate 初始化环节失败已跳过：' + label, err);
    }
  };

  // 语言下拉框只保留这五种
  safe('selectLanguageTag.languages', () => {
    if (translate.selectLanguageTag && typeof translate.selectLanguageTag === 'object') {
      translate.selectLanguageTag.languages = 'english,chinese_simplified,chinese_traditional,korean,japanese';
    }
  });

  // 本地语种＝简体中文（不设置则由 translate.js 自动识别）
  safe('language.setLocal', () => {
    if (translate.language && typeof translate.language.setLocal === 'function') {
      translate.language.setLocal('chinese_simplified');
    }
  });

  // 机器翻译通道：纯客户端 edge，不依赖服务端（文档 http://translate.zvo.cn/43086.html）
  safe('service.use', () => {
    if (translate.service && typeof translate.service.use === 'function') {
      translate.service.use('client.edge');
    }
  });

  // 开启动态内容监控：ajax 与 js 改动后的文本也会被翻译
  safe('request.listener.start', () => {
    if (translate.request && translate.request.listener && typeof translate.request.listener.start === 'function') {
      translate.request.listener.start();
    } else if (translate.listener && typeof translate.listener.start === 'function') {
      translate.listener.start();
    }
  });

  // 执行翻译
  safe('execute', () => {
    if (typeof translate.execute === 'function') {
      translate.execute();
    }
  });
})();

// 右下角「繁/简」按钮：translate.js 本身不绑定 #translateLink，需要手动接管。
// 必须用 __qwqTranslate 这份引用——页面上的全局 translate 已被 id="translate" 的容器 div 遮蔽。
(function () {
  const btn = document.getElementById('translateLink');
  const T = window.__qwqTranslate;
  if (!btn || !T || typeof T.changeLanguage !== 'function') return;
  const isTraditional = () => {
    try {
      return T.language.getCurrent() === 'chinese_traditional';
    } catch (err) {
      return false;
    }
  };
  const syncLabel = () => { btn.textContent = isTraditional() ? '简' : '繁'; };
  syncLabel();
  btn.addEventListener('click', function () {
    const target = isTraditional() ? 'chinese_simplified' : 'chinese_traditional';
    btn.textContent = target === 'chinese_traditional' ? '简' : '繁';
    T.changeLanguage(target);
  });
})();

//关闭歌曲列表
(function() {
  const initAPlayerSmooth = () => {
    const container = document.querySelector('.aplayer-fixed');
    if (!container) return;

    const switcher = container.querySelector('.aplayer-miniswitcher');
    const menuBtn = container.querySelector('.aplayer-icon-menu');
    const listEl = container.querySelector('.aplayer-list');
    const bodyEl = container.querySelector('.aplayer-body'); // 获取主体以操作 transition-delay
    
    let isInternalClick = false; // 防死循环标记

    switcher.addEventListener('click', function(e) {
      if (isInternalClick) return;

      // 1. 判断播放器当前是否展开 (非 narrow 状态)
      const isPlayerExpanded = !container.classList.contains('aplayer-narrow');
      
      // 2. 物理高度检查：判断列表是否真的在显示
      // 如果 offsetHeight 大于 5（留点误差余量），说明列表是打开状态
      const isListOpen = listEl && listEl.offsetHeight > 5;

      if (isPlayerExpanded) {
        // 如果列表开着，我们需要先处理列表
        if (isListOpen) {
          // 拦截本次原生的折叠动作
          e.stopImmediatePropagation();
          e.preventDefault();

          // 【新增】执行期间屏蔽 2s 延迟，设置为 0s 立即响应
          if (bodyEl) {
            bodyEl.style.setProperty('transition-delay', '0s', 'important');
          }

          // 模拟点击菜单按钮关闭列表（触发 CSS 的 max-height 动画）
          menuBtn.click();

          // 开启标记，等待动画结束后触发真正的折叠
          isInternalClick = true;
          setTimeout(() => {
            switcher.click();
            isInternalClick = false;

            // 【新增】执行完折叠动作后，恢复原来的 transition-delay
            // 延迟 500ms 是为了确保收缩动画彻底完成后再移除样式
            setTimeout(() => {
              if (bodyEl) {
                bodyEl.style.removeProperty('transition-delay');
              }
            }, 400);

          }, 400); // 400ms 对应 CSS 中的 transition 时间
        } 
        // 如果列表本来就是关的 (offsetHeight <= 5)，则不拦截，直接走原生折叠
      }
    }, true); // 使用捕获阶段
  };

  // 轮询确保 APlayer 加载完成
  const checkAPlayer = setInterval(() => {
    const switcher = document.querySelector('.aplayer-fixed .aplayer-miniswitcher');
    if (switcher) {
      initAPlayerSmooth();
      clearInterval(checkAPlayer);
    }
  }, 500);
})();