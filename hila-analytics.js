/* Hila · medición con Google Analytics 4 (G-D3S0FPCSXH)
   - Aviso de cookies: analítica solo se activa si la persona acepta.
   - Eventos del embudo: ver experiencia → reservar → pasos del cuestionario → pago.
   - Nunca se envían datos personales (nombre, correo, celular, salud). */
(function () {
  var KEY = 'hila-cookies';
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function g() { if (typeof window.gtag === 'function') window.gtag.apply(null, arguments); }

  // API para el resto de la página
  window.hilaTrack = window.hilaTrack || function (name, params) { g('event', name, params || {}); };

  var EXP = {
    vf: { item_id: 'vf', item_name: 'Hike + vía ferrata', price: 5800 },
    col: { item_id: 'col', item_name: 'Nevado de Colima', price: 5100 },
    rap: { item_id: 'rap', item_name: 'Rapel en Corral de Piedra', price: 4300 },
    kay: { item_id: 'kay', item_name: 'Kayak al amanecer', price: 1000 }
  };
  window.hilaExp = EXP;
  var PAGE = { 'via-ferrata.html': 'vf', 'nevado-de-colima.html': 'col', 'rapel-corral-de-piedra.html': 'rap', 'kayak-xochimilco.html': 'kay' };
  var SLUG = { vf: 'via_ferrata', col: 'nevado_colima', rap: 'rapel', kay: 'kayak' };
  var file = location.pathname.split('/').pop() || 'index.html';

  // ---------- Aviso de cookies ----------
  function banner() {
    if (get()) return;
    var b = document.createElement('div');
    b.id = 'hila-cookies';
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Aviso de cookies');
    b.innerHTML =
      '<p>Usamos cookies de analítica para entender qué funciona en la página y mejorarla. ' +
      '<a href="aviso-de-privacidad.html#cookies" target="_blank" rel="noopener">Más info</a></p>' +
      '<div><button type="button" data-c="no">Solo necesarias</button><button type="button" data-c="si">Aceptar</button></div>';
    var s = document.createElement('style');
    s.textContent =
      '#hila-cookies{position:fixed;left:16px;right:16px;bottom:16px;z-index:90;max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #DDDDDD;border-radius:18px;box-shadow:0 10px 30px rgba(0,0,0,.15);padding:16px 18px;font:14px/1.45 Figtree,sans-serif;color:#222222;display:flex;gap:14px;align-items:center;flex-wrap:wrap}' +
      '#hila-cookies p{margin:0;flex:1 1 260px}#hila-cookies a{color:#1F6B45;font-weight:600}' +
      '#hila-cookies div{display:flex;gap:8px}' +
      '#hila-cookies button{font:inherit;font-weight:700;border-radius:999px;padding:10px 16px;cursor:pointer;border:1px solid #222222;background:#FFFFFF;color:#222222}' +
      '#hila-cookies button[data-c="si"]{background:#2E7D4F;border-color:#2E7D4F;color:#FFFFFF}';
    document.head.appendChild(s);
    document.body.appendChild(b);
    b.addEventListener('click', function (e) {
      var c = e.target.getAttribute && e.target.getAttribute('data-c');
      if (!c) return;
      set(c);
      if (c === 'si') {
        g('consent', 'update', { analytics_storage: 'granted' });
        g('event', 'page_view');
      }
      b.remove();
    });
  }

  // ---------- Eventos automáticos ----------
  function onReady() {
    banner();

    // Página de experiencia vista
    if (PAGE[file]) {
      var it = EXP[PAGE[file]];
      g('event', 'view_item', { currency: 'MXN', value: it.price, experiencia: SLUG[PAGE[file]], items: [it] });
      g('event', 'vista_' + SLUG[PAGE[file]], { experiencia: SLUG[PAGE[file]] });
    }

    // Clics que importan (delegado: funciona con elementos que se crean después)
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a,button');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      var where = (a.closest('section[id],header,footer,aside,nav') || {}).id || (a.closest('footer') ? 'footer' : a.closest('header') ? 'header' : file);

      if (href.indexOf('reservar.html') > -1) {
        var m = href.match(/exp=([a-z,]+)/);
        var ks = m ? m[1].split(',') : [];
        g('event', 'clic_reservar', { ubicacion: where, experiencia: ks.map(function (k) { return SLUG[k] || k; }).join(',') || 'sin_elegir' });
        if (ks.length) g('event', 'select_item', { items: ks.map(function (k) { return EXP[k]; }).filter(Boolean) });
      } else if (/(via-ferrata|nevado-de-colima|rapel-corral-de-piedra|kayak-xochimilco)\.html/.test(href)) {
        var k = PAGE[href.split('/').pop().split('?')[0].split('#')[0]];
        g('event', 'clic_ver_experiencia', { experiencia: SLUG[k], ubicacion: where });
        g('event', 'clic_ver_' + SLUG[k], { ubicacion: where });
      } else if (href.indexOf('wa.me') > -1 || href.indexOf('whatsapp.com') > -1) {
        g('event', 'contacto', { metodo: 'whatsapp', ubicacion: where });
        g('event', 'contacto_whatsapp', { ubicacion: where });
      } else if (href.indexOf('instagram.com') > -1 || href.indexOf('ig.me') > -1) {
        g('event', 'contacto', { metodo: 'instagram', ubicacion: where });
        g('event', 'contacto_instagram', { ubicacion: where });
      } else if (href.indexOf('mailto:') === 0) {
        g('event', 'contacto', { metodo: 'correo', ubicacion: where });
        g('event', 'contacto_correo', { ubicacion: where });
      } else if (a.id === 'share') {
        g('event', 'share', { method: navigator.share ? 'nativo' : 'copiar_link', item_id: PAGE[file] || '' });
      } else if (a.classList.contains('cat')) {
        g('event', 'filtro_categoria', { categoria: a.dataset.cat });
      } else if (a.classList.contains('g-all') || a.classList.contains('g')) {
        g('event', 'ver_fotos', { item_id: PAGE[file] || '' });
      }
    }, true);

    // Preguntas frecuentes abiertas
    document.querySelectorAll('details').forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) {
          var s = d.querySelector('summary');
          g('event', 'faq_abierta', { pregunta: s ? s.textContent.trim().slice(0, 90) : '' });
        }
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady); else onReady();
})();
