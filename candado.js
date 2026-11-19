/* Candado del sitio · Spring Awakening México
   Mientras config.sitio_publico = false, solo un admin con sesión ve la página.
   Para abrir el sitio al público: update config set valor='true' where clave='sitio_publico'; */
(function () {
  var URL_SB = 'https://lbvgwsyxuhgjpstnuqxf.supabase.co';
  var KEY_SB = 'sb_publishable_Vwa0YLndlojcJbZ6ipXAEQ_0teqwIVX';
  var DOM = '@usuarios.springawakeningmexico.com';
  var html = document.documentElement;
  html.classList.add('candado');

  var css = document.createElement('style');
  css.textContent =
    "html.candado body>*:not(#candado){display:none!important}" +
    "#candado{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:1.2rem;" +
    "background:#f4f1ea;background-image:radial-gradient(rgba(120,100,80,.05) 1px,transparent 1px);background-size:4px 4px;" +
    "font-family:'Manrope',sans-serif;color:#2a2622}" +
    "#candado .cd-car{width:100%;max-width:380px;margin:0 auto;background:#fffdf8;border:1px solid #ddd6ca;border-radius:4px 18px 18px 18px;padding:1.8rem 1.5rem;position:relative;text-align:center}" +
    "#candado .cd-car::before{content:'';position:absolute;top:-1.1rem;left:-1px;width:40%;height:1.2rem;background:#fffdf8;border:1px solid #ddd6ca;border-bottom:none;border-radius:4px 14px 0 0}" +
    "#candado .cd-pre{font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#5d5750}" +
    "#candado h1{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:2.1rem;line-height:1;margin:.35rem 0 .5rem}" +
    "#candado p{font-size:14px;color:#5d5750;margin:0 0 1.2rem}" +
    "#candado input{display:block;width:100%;box-sizing:border-box;font:inherit;font-size:16px;border:1px solid #ddd6ca;border-radius:12px;padding:.7rem .9rem;margin-bottom:.7rem;background:#f4f1ea;outline:none;color:#2a2622}" +
    "#candado input:focus{border-color:#8aa5b5;background:#fff}" +
    "#candado button{width:100%;font:inherit;font-weight:700;font-size:15px;border:none;border-radius:12px;padding:.8rem;background:#3f5866;color:#fff;cursor:pointer}" +
    "#candado button:disabled{opacity:.6;cursor:default}" +
    "#candado .cd-err{color:#b5655c;font-size:13px;font-weight:600;min-height:1.2em;margin-top:.7rem}" +
    "#candado .cd-esp{font-size:14px;color:#9a938a}" +
    "@media print{html.candado body>*:not(#candado){display:none!important}}";
  document.head.appendChild(css);

  function quitar() {
    html.classList.remove('candado');
    var c = document.getElementById('candado');
    if (c) c.remove();
  }

  function caja(contenido) {
    var c = document.getElementById('candado');
    if (!c) { c = document.createElement('div'); c.id = 'candado'; document.body.appendChild(c); }
    c.innerHTML = contenido;
    return c;
  }

  function conLibreria(fn) {
    if (window.supabase && window.supabase.createClient) return fn();
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    s.onload = fn;
    s.onerror = function () { caja('<div class="cd-car"><p class="cd-esp">No se pudo conectar; revisa tu internet y recarga la página.</p></div>'); };
    document.head.appendChild(s);
  }

  function login(sb) {
    caja(
      '<div class="cd-car">' +
      '<div class="cd-pre">NOS Teatro</div>' +
      '<h1>Spring Awakening</h1>' +
      '<p>Sitio en preparación; entra con tu usuario.</p>' +
      '<form id="cd-form" autocomplete="on">' +
      '<input id="cd-u" name="username" autocomplete="username" placeholder="Usuario" autocapitalize="none" spellcheck="false" required>' +
      '<input id="cd-p" name="password" type="password" autocomplete="current-password" placeholder="Contraseña" required>' +
      '<button id="cd-b" type="submit">Entrar</button>' +
      '<div class="cd-err" id="cd-e"></div>' +
      '</form></div>'
    );
    document.getElementById('cd-form').addEventListener('submit', async function (e) {
      e.preventDefault();
      var u = document.getElementById('cd-u').value.trim().toLowerCase();
      var p = document.getElementById('cd-p').value;
      var b = document.getElementById('cd-b'), er = document.getElementById('cd-e');
      b.disabled = true; er.textContent = '';
      var r = await sb.auth.signInWithPassword({ email: u.indexOf('@') > -1 ? u : u + DOM, password: p });
      if (r.error) { er.textContent = 'Usuario o contraseña incorrectos'; b.disabled = false; return; }
      var ok = await sb.rpc('sitio_abierto');
      if (ok.data === true) { location.reload(); return; }
      await sb.auth.signOut();
      er.textContent = 'Tu usuario aún no tiene acceso a esta página';
      b.disabled = false;
    });
  }

  function revisar() {
    caja('<div class="cd-car"><p class="cd-esp">Cargando…</p></div>');
    conLibreria(async function () {
      var sb = window.supabase.createClient(URL_SB, KEY_SB, { auth: { persistSession: true } });
      try {
        var r = await sb.rpc('sitio_abierto');
        if (r.data === true) return quitar();
      } catch (e) {}
      login(sb);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', revisar);
  else revisar();
})();
