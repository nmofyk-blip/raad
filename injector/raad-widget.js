(function() {
  'use strict';

  var RAAD_API = 'http://localhost:3001';
  var RAAD_PREFIX = 'raad-';

  function injectCSS() {
    var css = [
      '.raad-widget { box-sizing: border-box; font-family: Segoe UI, Arial, sans-serif; }',
      '.raad-bar { background: #1a1a2e; color: white; padding: 12px 20px; text-align: center; position: fixed; top: 0; left: 0; right: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; gap: 12px; direction: rtl; }',
      '.raad-notif { position: fixed; bottom: 24px; right: 24px; background: white; border-radius: 16px; padding: 16px 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 14px; max-width: 320px; border-right: 4px solid #ff6b35; z-index: 9999; direction: rtl; }',
      '.raad-wa { position: fixed; bottom: 24px; left: 24px; z-index: 9999; width: 60px; height: 60px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 8px 25px rgba(37,211,102,0.4); }',
      '.raad-btn { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; border: none; border-radius: 50px; padding: 10px 20px; font-size: 14px; font-weight: 700; cursor: pointer; }',
      '.raad-close { background: none; border: none; cursor: pointer; font-size: 16px; color: #999; position: absolute; top: 8px; left: 8px; }',
    ].join('\n');

    var style = document.createElement('style');
    style.id = 'raad-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function showAnnouncementBar(settings) {
    var bar = document.createElement('div');
    bar.className = 'raad-widget raad-bar';

    var icon = document.createElement('span');
    icon.textContent = '🚚';
    icon.style.fontSize = '20px';

    var text = document.createElement('span');
    text.textContent = settings.message || 'توصيل مجاني للطلبات فوق 200 ريال';
    text.style.color = 'white';
    text.style.fontSize = '14px';

    var btn = document.createElement('button');
    btn.className = 'raad-btn';
    btn.textContent = settings.cta || 'تسوق الآن';
    btn.style.padding = '6px 16px';
    btn.style.fontSize = '12px';

    var close = document.createElement('button');
    close.className = 'raad-close';
    close.textContent = '✕';
    close.style.position = 'static';
    close.onclick = function() { bar.remove(); document.body.style.paddingTop = '0'; };

    bar.appendChild(icon);
    bar.appendChild(text);
    bar.appendChild(btn);
    bar.appendChild(close);

    document.body.style.paddingTop = '50px';
    document.body.insertBefore(bar, document.body.firstChild);
  }

  function showSalesNotification(settings) {
    var names = settings.names || ['أحمد', 'سارة', 'محمد', 'نورة'];
    var products = settings.products || ['ساعة ذكية', 'سماعات', 'عطر فاخر'];
    var times = ['منذ دقيقتين', 'منذ 5 دقائق', 'منذ 10 دقائق'];
    var index = 0;

    function show() {
      var existing = document.querySelector('.raad-notif');
      if (existing) existing.remove();

      var name = names[index % names.length];
      var product = products[index % products.length];
      var time = times[index % times.length];

      var notif = document.createElement('div');
      notif.className = 'raad-widget raad-notif';

      var avatar = document.createElement('div');
      avatar.style.cssText = 'width:44px;height:44px;background:linear-gradient(135deg,#ff6b35,#f7931e);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0';
      avatar.textContent = '🛍️';

      var content = document.createElement('div');

      var nameEl = document.createElement('div');
      nameEl.style.cssText = 'font-weight:700;color:#333;font-size:14px';
      nameEl.textContent = name;

      var action = document.createElement('div');
      action.style.cssText = 'color:#666;font-size:13px';
      action.textContent = 'اشترى ' + product;

      var timeEl = document.createElement('div');
      timeEl.style.cssText = 'color:#aaa;font-size:11px;margin-top:2px';
      timeEl.textContent = time + ' ✓ موثق';

      var closeBtn = document.createElement('button');
      closeBtn.className = 'raad-close';
      closeBtn.textContent = '✕';
      closeBtn.onclick = function() { notif.remove(); };

      content.appendChild(nameEl);
      content.appendChild(action);
      content.appendChild(timeEl);

      notif.appendChild(avatar);
      notif.appendChild(content);
      notif.appendChild(closeBtn);
      document.body.appendChild(notif);

      setTimeout(function() { notif.remove(); }, 4000);
      index++;
      setTimeout(show, 7000);
    }

    setTimeout(show, 3000);
  }

  function showWhatsappButton(settings) {
    var btn = document.createElement('div');
    btn.className = 'raad-widget raad-wa';
    btn.title = 'تواصل معنا على واتساب';

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '30');
    svg.setAttribute('height', '30');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'white');

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z');

    svg.appendChild(path);
    btn.appendChild(svg);

    btn.onclick = function() {
      var phone = settings.phone || '966500000000';
      var msg = settings.message || 'مرحباً، أحتاج مساعدة';
      window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(msg), '_blank');
    };

    document.body.appendChild(btn);
  }

  function getDefaultWidgets() {
    return [
      { type: 'announcement_bar', settings: { message: '🚚 توصيل مجاني للطلبات فوق 200 ريال', cta: 'تسوق الآن' } },
      { type: 'sales_notification', settings: { names: ['أحمد', 'سارة', 'محمد', 'نورة'], products: ['ساعة ذكية', 'سماعات', 'عطر فاخر'] } },
      { type: 'whatsapp_button', settings: { phone: '966500000000', message: 'مرحباً، أحتاج مساعدة' } },
    ];
  }

  function renderWidget(widget) {
    if (widget.type === 'announcement_bar') showAnnouncementBar(widget.settings);
    else if (widget.type === 'sales_notification') showSalesNotification(widget.settings);
    else if (widget.type === 'whatsapp_button') showWhatsappButton(widget.settings);
  }

  function init() {
    injectCSS();
    var activeWidgets = getDefaultWidgets();
    for (var i = 0; i < activeWidgets.length; i++) {
      renderWidget(activeWidgets[i]);
    }
    console.log('🌩️ رعد v1.0 — تم تحميل ' + activeWidgets.length + ' widgets');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();