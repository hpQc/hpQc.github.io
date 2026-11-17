/* ============================================================================
 * js/search/local-search.js —— 站内本地搜索
 * ----------------------------------------------------------------------------
 * 背景（2026-11-16）：主题 layout/includes/additional-js.pug 在
 * local_search.enable 为 true 时会输出 <script src="/js/search/local-search.js">，
 * 但 themes/fomalhaut/source/js/search/ 下只有 algolia.js —— 这个文件在主题里
 * 根本不存在，线上一直是 404，点开搜索框只会一直转圈。
 *
 * 本文件按主题既有约定补齐，不另起一套：
 *   ① 索引地址与文案来自 layout/includes/head/config.pug 写入的
 *      GLOBAL_CONFIG.localSearch（path = config.root + config.search.path，
 *      默认 /search.xml，由 hexo-generator-search 生成；preload 控制是否预载）。
 *   ② DOM 见 layout/includes/third-party/search/local-search.pug：
 *      #local-search > .search-dialog > .search-wrap
 *        > #local-search-input / #local-search-results
 *      #loading-database（加载中）/ #loading-status（条数文案）
 *   ③ 结果样式见 source/css/_search/local-search.styl，要求的结构是
 *      .search-result-list > .local-search__hit-item > a + .search-result
 *   ④ 开合动画复用 utils.js 的 btf.animateIn / btf.animateOut，和 algolia.js 一致。
 * ========================================================================== */

;(function () {
  // 注意：主题用 `const GLOBAL_CONFIG = {...}` 声明配置，顶层 const 不会成为
  // window 的属性，只能以裸标识符访问；所以这里不能只读 window.GLOBAL_CONFIG。
  const globalCfg = (typeof GLOBAL_CONFIG !== 'undefined' && GLOBAL_CONFIG) || window.GLOBAL_CONFIG || {}
  const raw = globalCfg.localSearch
  if (!raw) return
  const config = raw

  let index = null // [{ title, url, content }]
  let ready = false
  let loading = false

  const $ = (sel, root) => (root || document).querySelector(sel)
  const dialog = () => $('#local-search .search-dialog')
  const mask = () => document.getElementById('search-mask')
  const resultBox = () => document.getElementById('local-search-results')
  const searchInput = () => $('#local-search .local-search-box--input')
  const loadingDb = () => document.getElementById('loading-database')
  const loadingStatus = () => document.getElementById('loading-status')

  const escapeHtml = s =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

  const showWrap = () => {
    const wrap = $('#local-search .search-wrap')
    if (wrap) wrap.style.display = 'block'
    const db = loadingDb()
    if (db) db.style.display = 'none'
  }

  const buildIndex = xmlText => {
    const doc = new DOMParser().parseFromString(xmlText, 'application/xml')
    return Array.from(doc.querySelectorAll('entry')).map(entry => {
      const field = name => {
        const node = entry.querySelector(name)
        return node ? node.textContent : ''
      }
      return {
        title: field('title').trim(),
        url: field('url').trim(),
        // 正文里可能带 HTML 片段，去掉标签后压成一行，便于截取摘要
        content: field('content').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      }
    })
  }

  const loadIndex = () => {
    if (ready || loading) return
    loading = true
    const status = loadingStatus()
    if (status) status.textContent = ' 索引加载中…'

    fetch(config.path, { credentials: 'same-origin' })
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status)
        return res.text()
      })
      .then(text => {
        index = buildIndex(text)
        ready = true
        loading = false
        if (status) status.textContent = ''
        showWrap()
        const kw = searchInput() && searchInput().value.trim()
        if (kw) doSearch(kw)
      })
      .catch(err => {
        loading = false
        if (status) status.textContent = ' 索引加载失败'
        showWrap()
        const box = resultBox()
        if (box) {
          box.innerHTML =
            '<div class="search-result-list"><div class="local-search__hit-item">' +
            escapeHtml('索引 /search.xml 加载失败，请检查该文件是否已生成。') +
            '</div></div>'
        }
        console.error('[local-search] 索引加载失败：', err)
      })
  }

  const highlight = (text, keyword) => {
    const lower = text.toLowerCase()
    const k = keyword.toLowerCase()
    const at = lower.indexOf(k)
    if (at < 0) return escapeHtml(text.slice(0, 90)) + (text.length > 90 ? '…' : '')

    const start = Math.max(0, at - 40)
    const end = Math.min(text.length, at + k.length + 60)
    return (
      (start > 0 ? '…' : '') +
      escapeHtml(text.slice(start, at)) +
      '<em class="search-keyword">' +
      escapeHtml(text.slice(at, at + k.length)) +
      '</em>' +
      escapeHtml(text.slice(at + k.length, end)) +
      (end < text.length ? '…' : '')
    )
  }

  const doSearch = keyword => {
    const box = resultBox()
    if (!box) return
    const kw = keyword.trim()
    const status = loadingStatus()

    if (!kw) {
      box.innerHTML = ''
      if (status) status.textContent = ''
      return
    }
    if (!ready) {
      if (status) status.textContent = ' 索引还没加载完，请稍候'
      return
    }

    const k = kw.toLowerCase()
    const hits = index
      .filter(p => p.title.toLowerCase().indexOf(k) > -1 || p.content.toLowerCase().indexOf(k) > -1)
      .slice(0, 20)

    if (!hits.length) {
      const emptyTpl = (config.languages && config.languages.hits_empty) || '没有找到「${query}」相关的内容'
      box.innerHTML =
        '<div class="search-result-list"><div class="local-search__hit-item">' +
        escapeHtml(emptyTpl.replace('${query}', kw)) +
        '</div></div>'
      if (status) status.textContent = ' 0 条'
      return
    }

    const html = hits
      .map(p => {
        return (
          '<div class="local-search__hit-item">' +
          '<a href="' + p.url + '">' + escapeHtml(p.title || p.url) + '</a>' +
          '<div class="search-result">' + (p.content ? highlight(p.content, kw) : '') + '</div>' +
          '</div>'
        )
      })
      .join('')

    box.innerHTML = '<div class="search-result-list">' + html + '</div>'
    if (status) status.textContent = ' 共 ' + hits.length + ' 条'
  }

  const onKeydown = event => {
    if (event.code === 'Escape') {
      closeSearch()
      document.removeEventListener('keydown', onKeydown)
    }
  }

  const openSearch = () => {
    const bodyStyle = document.body.style
    bodyStyle.width = '100%'
    bodyStyle.overflow = 'hidden'
    if (typeof btf !== 'undefined' && btf.animateIn) {
      btf.animateIn(mask(), 'to_show 0.5s')
      btf.animateIn(dialog(), 'titleScale 0.5s')
    } else {
      if (mask()) mask().style.display = 'block'
      if (dialog()) dialog().style.display = 'block'
    }

    loadIndex()
    setTimeout(() => {
      const input = searchInput()
      input && input.focus()
    }, 100)

    document.addEventListener('keydown', onKeydown)
  }

  const closeSearch = () => {
    const bodyStyle = document.body.style
    bodyStyle.width = ''
    bodyStyle.overflow = ''
    if (typeof btf !== 'undefined' && btf.animateOut) {
      btf.animateOut(dialog(), 'search_close .5s')
      btf.animateOut(mask(), 'to_hide 0.5s')
    } else {
      if (dialog()) dialog().style.display = ''
      if (mask()) mask().style.display = ''
    }
  }

  const bind = () => {
    const trigger = $('#search-button > .search')
    trigger && trigger.addEventListener('click', openSearch)
    const m = mask()
    m && m.addEventListener('click', closeSearch)
    const closeBtn = $('#local-search .search-close-button')
    closeBtn && closeBtn.addEventListener('click', closeSearch)

    const input = searchInput()
    input && input.addEventListener('input', e => doSearch(e.target.value))

    // preload: true —— 页面空闲时就把索引拉进内存，点开即搜
    if (config.preload) {
      const warm = () => loadIndex()
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(warm, { timeout: 3000 })
      } else {
        setTimeout(warm, 1200)
      }
    }
  }

  if (document.readyState === 'complete') {
    bind()
  } else {
    window.addEventListener('load', bind)
  }
})()
