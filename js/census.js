/* ============================================================================
 * source/js/census.js —— 网站统计页：Umami 分享看板直读
 * ----------------------------------------------------------------------------
 * 为什么不用 iframe：cloud.umami.is 的分享页响应头是 X-Frame-Options: SAMEORIGIN，
 * 浏览器会直接拦截嵌入并显示「被浏览器阻止」。分享页前端本身走的是
 * /analytics/eu/api/share/<slug> 拿 token，再带 x-umami-share-token /
 * x-umami-share-context 请求 /websites/<id>/stats；这里照同一套接口取数，
 * 在页面内渲染成 KPI，不再依赖 iframe。
 * ========================================================================== */
(function () {
  'use strict'

  var API = 'https://cloud.umami.is/analytics/eu/api'
  var DAY = 86400000
  var RANGE_DAYS = 30
  var cards = document.querySelectorAll('[data-umami-site]')
  if (!cards.length) return

  var fmtNumber = function (value) {
    var n = Number(value)
    return isFinite(n) ? n.toLocaleString('zh-CN') : '--'
  }

  var fmtDuration = function (seconds) {
    var total = Math.round(Number(seconds) || 0)
    var h = Math.floor(total / 3600)
    var m = Math.floor((total % 3600) / 60)
    var s = total % 60
    if (h) return h + ' 小时 ' + m + ' 分'
    return m + ' 分 ' + (s < 10 ? '0' : '') + s + ' 秒'
  }

  var fmtTime = function (date) {
    var pad = function (n) { return (n < 10 ? '0' : '') + n }
    return pad(date.getHours()) + ':' + pad(date.getMinutes()) + ' 更新'
  }

  var setState = function (card, state, text) {
    card.setAttribute('data-state', state)
    var el = card.querySelector('[data-umami-state]')
    if (el) el.textContent = text
  }

  var render = function (card, stats) {
    var visits = Number(stats.visits) || 0
    var values = {
      visitors: fmtNumber(stats.visitors),
      pageviews: fmtNumber(stats.pageviews),
      visits: fmtNumber(stats.visits),
      duration: visits ? fmtDuration((Number(stats.totaltime) || 0) / visits) : '--'
    }
    Object.keys(values).forEach(function (key) {
      var el = card.querySelector('[data-umami-field="' + key + '"]')
      if (el) el.textContent = values[key]
    })
    setState(card, 'ready', fmtTime(new Date()))
  }

  var load = function (card) {
    var slug = card.getAttribute('data-umami-site')
    if (!slug) return
    fetch(API + '/share/' + encodeURIComponent(slug), { credentials: 'omit' })
      .then(function (res) {
        if (!res.ok) throw new Error('分享配置 HTTP ' + res.status)
        return res.json()
      })
      .then(function (share) {
        var endAt = Date.now()
        var startAt = endAt - RANGE_DAYS * DAY
        return fetch(
          API + '/websites/' + encodeURIComponent(share.websiteId) +
          '/stats?startAt=' + startAt + '&endAt=' + endAt,
          {
            credentials: 'omit',
            headers: {
              'x-umami-share-token': share.token,
              'x-umami-share-context': '1'
            }
          }
        )
      })
      .then(function (res) {
        if (!res.ok) throw new Error('统计接口 HTTP ' + res.status)
        return res.json()
      })
      .then(function (stats) {
        render(card, stats)
      })
      .catch(function (error) {
        console.log('umami:', error)
        setState(card, 'error', '读取失败，稍后刷新试试')
      })
  }

  var pending = cards.length
  var done = function () {
    pending -= 1
    if (pending > 0) return
    var updated = document.getElementById('umami-updated')
    if (updated) updated.textContent = fmtTime(new Date())
  }
  Array.prototype.forEach.call(cards, function (card) {
    load(card)
    var observer = new MutationObserver(function () {
      if (card.getAttribute('data-state') !== 'loading') {
        observer.disconnect()
        done()
      }
    })
    observer.observe(card, { attributes: true, attributeFilter: ['data-state'] })
  })
})()
