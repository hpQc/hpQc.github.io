// CSS 部分通过 JS 插入
const css = `
.translateSelectLanguage{
  position: fixed;
  right:-200px;
  bottom:84px;
  width:132px;
  height:40px;
  box-sizing:border-box;
  padding:0 26px 0 12px;
  font:500 14px/38px system-ui,-apple-system,"Segoe UI",sans-serif;
  color:#333;
  border:1px solid #d5d5d5;
  border-radius:8px;
  background-color:#eaeaea;
  background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23666' stroke-width='2'/%3E%3C/svg%3E");
  background-repeat:no-repeat;
  background-position:right 10px center;
  background-size:12px 8px;
  box-shadow:0 2px 4px rgba(0,0,0,.1);
  appearance:none;
  outline:none;
  cursor:pointer;
  transition:right .3s ease,border-color .2s ease,box-shadow .2s ease;
}
[data-theme="dark"] .translateSelectLanguage{
  background-color:#5f5f5f;
  border-color:#7a7a7a;
  color:#eaeaea;
  background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23eaeaea' stroke-width='2'/%3E%3C/svg%3E");
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
    languageBox.style.right = '-200px'; // 隐藏到屏幕外（框宽 132px，留余量）
  } else {
    languageBox.style.right = '60px'; // 显示在屏幕内

    // 点击页面其他地方时自动隐藏
    const clickHandler = (event) => {
      const target = event.target;
      if (!languageBox.contains(target) && target.closest('.translateSelectLanguage') === null) {
        languageBox.style.right = '-200px';
        document.removeEventListener('click', clickHandler); // 移除事件监听
      }
    };

    setTimeout(() => {
      document.addEventListener('click', clickHandler);
    }, 0); // 延迟绑定事件，避免点击按钮本身触发隐藏
  }

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