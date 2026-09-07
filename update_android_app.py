import json

with open('products_database.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

app_js_content = f"""// American Premium Fast Food — Offline Native Client Engine for Android
// Location: Termez, Surkhandarya, Yubileyniy

const PRODUCTS_DATA = {json.dumps(products, ensure_ascii=False, indent=2)};

const PHOTO_MENU_PAGES = [
  {{ title: 'Бургеры и Сеты', img: 'images/photo_2026-08-28_17-22-56.jpg', tag: 'Бургеры' }},
  {{ title: 'Лаваш, Тандыр, Донар и Питта', img: 'images/photo_2026-08-28_17-24-51.jpg', tag: 'Лаваши' }},
  {{ title: 'Хот-доги и Клаб Сэндвич', img: 'images/photo_2026-08-28_17-25-05.jpg', tag: 'Хот-доги' }},
  {{ title: 'Стрипсы, Байтсы и Картофель Фри', img: 'images/photo_2026-08-28_17-25-14.jpg', tag: 'Курица & Фри' }},
  {{ title: 'Пирожные San Sebastian', img: 'images/photo_2026-08-28_17-25-23.jpg', tag: 'Десерты' }},
  {{ title: 'Бельгийские и Гонконгские Вафли', img: 'images/photo_2026-08-28_17-23-28.jpg', tag: 'Вафли' }},
  {{ title: 'American Pizza (Chicago, Las Vegas, Miami)', img: 'images/photo_2026-08-28_17-23-08.jpg', tag: 'Пицца' }},
  {{ title: 'American Pizza (Qazili, Peperoni, Miks)', img: 'images/photo_2026-08-28_17-24-03.jpg', tag: 'Пицца' }},
  {{ title: 'Турецкие Пиде (Go\\'shtli, Qazili, Asalli)', img: 'images/photo_2026-08-28_17-23-18.jpg', tag: 'Пиде' }},
  {{ title: 'Фирменные Салаты', img: 'images/photo_2026-08-28_17-23-35.jpg', tag: 'Салаты' }},
  {{ title: 'Суши и Роллы (Филадельфия, Калифорния)', img: 'images/photo_2026-08-28_17-23-49.jpg', tag: 'Суши' }},
  {{ title: 'Запеченные роллы и маки', img: 'images/photo_2026-08-28_17-24-39.jpg', tag: 'Суши' }},
  {{ title: 'Большие Сеты Суши (American, Avtorskiy, Similan)', img: 'images/photo_2026-08-28_17-24-19.jpg', tag: 'Сеты' }},
  {{ title: 'Чай, Милкшейки и Мохито', img: 'images/photo_2026-08-28_17-25-33.jpg', tag: 'Напитки' }}
];

let cart = [];
let activeCategory = 'all';
let activeOrder = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {{
  renderProducts();
  renderPhotoMenu();
  setupEventListeners();
  updateCartBadge();
}});

function setupEventListeners() {{
  // Search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {{
    searchInput.addEventListener('input', (e) => {{
      renderProducts(e.target.value.toLowerCase().trim());
    }});
  }}

  // Category filters
  document.querySelectorAll('.cat-pill').forEach(btn => {{
    btn.addEventListener('click', (e) => {{
      document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-cat');
      renderProducts();
    }});
  }});

  // Top header actions
  document.getElementById('openCartBtn')?.addEventListener('click', openCartModal);
  document.getElementById('openPresentationBtn')?.addEventListener('click', openPresentationModal);
  document.getElementById('heroPresBtn')?.addEventListener('click', openPresentationModal);

  // Tab switchers
  document.getElementById('tabMenu')?.addEventListener('click', () => switchTab('menu'));
  document.getElementById('tabPhotoMenu')?.addEventListener('click', () => switchTab('photo'));
  document.getElementById('tabRadar')?.addEventListener('click', () => switchTab('radar'));

  // Bottom Navigation
  document.getElementById('bNavHome')?.addEventListener('click', () => switchTab('menu'));
  document.getElementById('bNavPhoto')?.addEventListener('click', () => switchTab('photo'));
  document.getElementById('bNavCart')?.addEventListener('click', openCartModal);
  document.getElementById('bNavRadar')?.addEventListener('click', () => switchTab('radar'));
  document.getElementById('bNavInfo')?.addEventListener('click', showAboutModal);

  // Modal outside clicks
  document.querySelectorAll('.modal-overlay').forEach(modal => {{
    modal.addEventListener('click', (e) => {{
      if (e.target === modal) closeModals();
    }});
  }});
}}

function renderProducts(query = '') {{
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const filtered = PRODUCTS_DATA.filter(p => {{
    const matchesCat = (activeCategory === 'all') || (p.category === activeCategory);
    const matchesQuery = !query || p.name.toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query));
    return matchesCat && matchesQuery;
  }});

  if (filtered.length === 0) {{
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding: 40px 20px; color: #94A3B8;">
        <div style="font-size: 40px; margin-bottom: 8px;">🔍</div>
        <p>Ничего не найдено по запросу</p>
      </div>
    `;
    return;
  }}

  grid.innerHTML = filtered.map(p => {{
    const inCartItem = cart.find(c => c.id === p.id);
    const inCartQty = inCartItem ? inCartItem.quantity : 0;

    return `
      <div class="product-card" onclick="openProductModal('${{p.id}}')">
        <div class="card-img-wrap">
          <img src="${{p.image}}" alt="${{p.name}}" class="card-img" loading="lazy">
          ${{inCartQty > 0 ? `<div class="in-cart-badge">${{inCartQty}} в заказе</div>` : ''}}
        </div>
        <div class="card-body">
          <h3 class="card-title">${{p.name}}</h3>
          <p class="card-desc">${{p.description || ''}}</p>
          <div class="card-footer">
            <div class="card-price-col">
              <span class="card-price">${{p.price.toLocaleString('ru-RU')}} <small>сум</small></span>
            </div>
            <div class="qty-btn-wrap" onclick="event.stopPropagation()">
              ${{inCartQty > 0 ? `
                <div class="qty-control-inline">
                  <button class="qty-btn-sm" onclick="changeQty('${{p.id}}', -1)">-</button>
                  <span class="qty-num">${{inCartQty}}</span>
                  <button class="qty-btn-sm" onclick="changeQty('${{p.id}}', 1)">+</button>
                </div>
              ` : `
                <button class="btn-add-cart" onclick="quickAddToCart('${{p.id}}')">
                  <span>+</span>
                </button>
              `}}
            </div>
          </div>
        </div>
      </div>
    `;
  }}).join('');
}}

function renderPhotoMenu() {{
  const grid = document.getElementById('photoCardsGrid');
  if (!grid) return;

  grid.innerHTML = PHOTO_MENU_PAGES.map((page, idx) => `
    <div class="photo-menu-card" onclick="openLightbox('${{page.img}}', '${{page.title}}')">
      <div class="photo-img-wrap">
        <span class="photo-tag">${{page.tag}}</span>
        <img src="${{page.img}}" alt="${{page.title}}" class="photo-card-img" loading="lazy">
      </div>
      <div class="photo-card-info">
        <h4 class="photo-card-title">${{page.title}}</h4>
        <span class="photo-card-sub">Нажмите для HD просмотра 🔍</span>
      </div>
    </div>
  `).join('');
}}

function quickAddToCart(id) {{
  const prod = PRODUCTS_DATA.find(p => p.id === id);
  if (!prod) return;

  const existing = cart.find(i => i.id === id);
  if (existing) {{
    existing.quantity += 1;
  }} else {{
    cart.push({{
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      quantity: 1
    }});
  }}

  updateCartBadge();
  renderProducts();
}}

function changeQty(id, delta) {{
  const idx = cart.findIndex(i => i.id === id);
  if (idx !== -1) {{
    cart[idx].quantity += delta;
    if (cart[idx].quantity <= 0) {{
      cart.splice(idx, 1);
    }}
  }}
  updateCartBadge();
  renderProducts();
  const cartModal = document.getElementById('cartModal');
  if (cartModal && cartModal.style.display === 'flex') {{
    openCartModal();
  }}
}}

function updateCartBadge() {{
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cartCountBadge');
  if (badge) {{
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }}
}}

function switchTab(tab) {{
  // Nav highlight
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

  const menuView = document.getElementById('menuView');
  const catalogControls = document.getElementById('catalogControls');
  const photoView = document.getElementById('photoMenuView');
  const radarView = document.getElementById('radarView');

  if (tab === 'menu') {{
    document.getElementById('tabMenu')?.classList.add('active');
    document.getElementById('bNavHome')?.classList.add('active');
    menuView.style.display = 'block';
    catalogControls.style.display = 'block';
    photoView.style.display = 'none';
    radarView.style.display = 'none';
    renderProducts();
  }} else if (tab === 'photo') {{
    document.getElementById('tabPhotoMenu')?.classList.add('active');
    document.getElementById('bNavPhoto')?.classList.add('active');
    menuView.style.display = 'none';
    catalogControls.style.display = 'none';
    photoView.style.display = 'block';
    radarView.style.display = 'none';
  }} else if (tab === 'radar') {{
    document.getElementById('tabRadar')?.classList.add('active');
    document.getElementById('bNavRadar')?.classList.add('active');
    menuView.style.display = 'none';
    catalogControls.style.display = 'none';
    photoView.style.display = 'none';
    radarView.style.display = 'block';
    renderRadar();
  }}
}}

function openProductModal(id) {{
  const prod = PRODUCTS_DATA.find(p => p.id === id);
  if (!prod) return;

  const modal = document.getElementById('productModal');
  const content = document.getElementById('productModalContent');

  const inCart = cart.find(i => i.id === id);
  const qty = inCart ? inCart.quantity : 0;

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <h3 style="font-size:18px; font-weight:900; margin:0;">${{prod.name}}</h3>
      <button onclick="closeModals()" style="background:none; border:none; color:#fff; font-size:22px; cursor:pointer;">✕</button>
    </div>
    <div style="position:relative; width:100%; height:200px; border-radius:14px; overflow:hidden; margin-bottom:12px;">
      <img src="${{prod.image}}" style="width:100%; height:100%; object-fit:cover;">
      <span style="position:absolute; bottom:8px; left:8px; background:rgba(0,0,0,0.7); color:#fff; font-size:11px; padding:4px 8px; border-radius:6px;">${{prod.weight || ''}}</span>
    </div>
    <p style="color:#94A3B8; font-size:13px; line-height:1.5; margin-bottom:14px;">${{prod.description || ''}}</p>
    
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <div>
        <div style="font-size:11px; color:#94A3B8;">Цена</div>
        <div style="font-size:20px; font-weight:900; color:#FFB800;">
          ${{prod.price.toLocaleString('ru-RU')}} сум
        </div>
      </div>
      
      <div style="display:flex; align-items:center; gap:10px;">
        ${{qty > 0 ? `
          <button class="qty-btn-sm" style="width:36px; height:36px; font-size:18px;" onclick="changeQty('${{prod.id}}', -1); openProductModal('${{prod.id}}');">-</button>
          <span style="font-size:16px; font-weight:800;">${{qty}}</span>
          <button class="qty-btn-sm" style="width:36px; height:36px; font-size:18px;" onclick="changeQty('${{prod.id}}', 1); openProductModal('${{prod.id}}');">+</button>
        ` : `
          <button class="btn-primary-sm" style="padding:10px 20px;" onclick="quickAddToCart('${{prod.id}}'); openProductModal('${{prod.id}}');">
            + В корзину
          </button>
        `}}
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}}

function openCartModal() {{
  const modal = document.getElementById('cartModal');
  const content = document.getElementById('cartModalContent');

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const delivery = total >= 150000 || total === 0 ? 0 : 10000;
  const grandTotal = total + delivery;

  if (cart.length === 0) {{
    content.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="font-size:18px; font-weight:900;">Корзина</h3>
        <button onclick="closeModals()" style="background:none; border:none; color:#fff; font-size:22px; cursor:pointer;">✕</button>
      </div>
      <div style="text-align:center; padding:40px 0;">
        <div style="font-size:48px; margin-bottom:10px;">🛍️</div>
        <p style="color:#94A3B8; font-size:14px;">Корзина пока пуста</p>
      </div>
    `;
  }} else {{
    content.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <h3 style="font-size:18px; font-weight:900; margin:0;">Корзина заказа (${{cart.reduce((s, i) => s + i.quantity, 0)}} шт)</h3>
        <button onclick="closeModals()" style="background:none; border:none; color:#fff; font-size:22px; cursor:pointer;">✕</button>
      </div>
      <div style="max-height:240px; overflow-y:auto; margin-bottom:14px; padding-right:4px;">
        ${{cart.map(item => `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; background:#10131E; padding:10px 12px; border-radius:12px; border:1px solid #1E2333;">
            <div style="display:flex; align-items:center; gap:10px;">
              <img src="${{item.image}}" style="width:44px; height:44px; border-radius:8px; object-fit:cover;">
              <div>
                <div style="font-weight:700; font-size:13px; max-width:140px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${{item.name}}</div>
                <div style="font-size:12px; color:#FFB800; font-weight:700;">${{(item.price * item.quantity).toLocaleString('ru-RU')}} сум</div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <button onclick="changeQty('${{item.id}}', -1)" style="background:#212638; color:#fff; border:none; width:28px; height:28px; border-radius:8px; font-weight:800; cursor:pointer;">-</button>
              <span style="font-weight:800; font-size:14px; min-width:16px; text-align:center;">${{item.quantity}}</span>
              <button onclick="changeQty('${{item.id}}', 1)" style="background:#212638; color:#fff; border:none; width:28px; height:28px; border-radius:8px; font-weight:800; cursor:pointer;">+</button>
            </div>
          </div>
        `).join('')}}
      </div>
      <div style="border-top:1px solid #212638; padding-top:12px; margin-bottom:14px; font-size:13px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; color:#94A3B8;">
          <span>Сумма блюд:</span>
          <span>${{total.toLocaleString('ru-RU')}} сум</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; color:#94A3B8;">
          <span>Доставка (по Термезу):</span>
          <span>${{delivery === 0 ? '<strong style=\"color:#10B981;\">БЕСПЛАТНО</strong>' : delivery.toLocaleString('ru-RU') + ' сум'}}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-weight:900; font-size:17px; color:#FFB800; padding-top:4px;">
          <span>К оплате:</span>
          <span>${{grandTotal.toLocaleString('ru-RU')}} сум</span>
        </div>
      </div>
      <input type="text" id="custName" placeholder="Ваше имя" value="Клиент" style="width:100%; box-sizing:border-box; background:#10131E; border:1px solid #212638; color:#fff; padding:12px; border-radius:10px; margin-bottom:8px; font-size:13px;">
      <input type="text" id="custPhone" placeholder="Телефон (+998 ...)" value="+998 90 822 01 01" style="width:100%; box-sizing:border-box; background:#10131E; border:1px solid #212638; color:#fff; padding:12px; border-radius:10px; margin-bottom:8px; font-size:13px;">
      <input type="text" id="custAddress" placeholder="Адрес доставки в Термезе" value="г. Термез, район Юбилейный" style="width:100%; box-sizing:border-box; background:#10131E; border:1px solid #212638; color:#fff; padding:12px; border-radius:10px; margin-bottom:14px; font-size:13px;">
      <button class="btn-primary-sm" style="width:100%; padding:14px; font-size:15px; font-weight:800; text-align:center; cursor:pointer;" onclick="checkoutOrder(${{grandTotal}})">
        Оформить заказ (${{grandTotal.toLocaleString('ru-RU')}} сум)
      </button>
    `;
  }}

  modal.style.display = 'flex';
}}

function checkoutOrder(grandTotal) {{
  const name = document.getElementById('custName')?.value || 'Клиент';
  const address = document.getElementById('custAddress')?.value || 'г. Термез, район Юбилейный';
  const phone = document.getElementById('custPhone')?.value || '+998 90 822 01 01';

  activeOrder = {{
    id: `FF-${{Math.floor(1000 + Math.random() * 9000)}}`,
    name,
    phone,
    address,
    total: grandTotal,
    items: [...cart],
    date: new Date().toLocaleTimeString('ru-RU', {{ hour: '2-digit', minute: '2-digit' }})
  }};

  cart = [];
  updateCartBadge();
  renderProducts();
  closeModals();
  openReceiptModal(activeOrder);
}}

function openReceiptModal(order) {{
  const modal = document.getElementById('receiptModal');
  const content = document.getElementById('receiptContent');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <h3 style="font-size:16px; font-weight:800; color:#10B981; margin:0;">Заказ #${{order.id}} принят!</h3>
      <button onclick="closeModals(); switchTab('radar');" style="background:none; border:none; color:#fff; font-size:22px; cursor:pointer;">✕</button>
    </div>
    <div class="pos-receipt-paper">
      <div style="text-align:center; font-weight:900; font-size:15px;">AMERICAN FAST FOOD</div>
      <div style="text-align:center; font-size:10px; color:#555;">г. Термез, район Юбилейный</div>
      <div style="text-align:center; font-size:10px; color:#555;">Тел: +998 90 822 01 01</div>
      <hr class="receipt-divider">
      <div class="receipt-row"><span>ЧЕК ЗАКАЗА:</span><strong>#${{order.id}}</strong></div>
      <div class="receipt-row"><span>ВРЕМЯ:</span><span>${{order.date}}</span></div>
      <div class="receipt-row"><span>КЛИЕНТ:</span><span>${{order.name}}</span></div>
      <div class="receipt-row"><span>АДРЕС:</span><span>${{order.address}}</span></div>
      <hr class="receipt-divider">
      ${{order.items.map(i => `
        <div class="receipt-row">
          <span>${{i.quantity}}x ${{i.name}}</span>
          <span>${{(i.price * i.quantity).toLocaleString('ru-RU')}}</span>
        </div>
      `).join('')}}
      <hr class="receipt-divider">
      <div class="receipt-row" style="font-size:14px; font-weight:900;">
        <span>ИТОГО:</span>
        <span>${{order.total.toLocaleString('ru-RU')}} сум</span>
      </div>
      <div style="text-align:center; margin-top:10px; font-size:11px; color:#666;">
        Готовим сочно и свежо!<br>Приятного аппетита!
      </div>
    </div>
    <button class="btn-primary-sm" style="width:100%; margin-top:14px; padding:13px; text-align:center; cursor:pointer;" onclick="closeModals(); switchTab('radar');">
      Отслеживать курьера на радаре 🛵
    </button>
  `;

  modal.style.display = 'flex';
}}

function renderRadar() {{
  const card = document.getElementById('radarCard');
  if (!card) return;

  if (!activeOrder) {{
    card.innerHTML = `
      <div style="text-align:center; padding:40px 16px;">
        <div style="font-size:48px; margin-bottom:12px;">🛵</div>
        <h3 style="font-size:17px; font-weight:800;">Нет активных доставок</h3>
        <p style="color:#94A3B8; font-size:13px; margin-top:6px;">Сделайте заказ в меню, чтобы отслеживать путь курьера по Термезу</p>
      </div>
    `;
  }} else {{
    card.innerHTML = `
      <div style="background:#151824; border:1px solid #212638; border-radius:18px; padding:18px; margin:0 16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span style="font-weight:900; font-size:16px;">Заказ #${{activeOrder.id}}</span>
          <span style="background:rgba(16,185,129,0.2); color:#10B981; padding:4px 8px; border-radius:6px; font-size:11px; font-weight:800;">В ПУТИ 🚗</span>
        </div>
        <div style="background:#0B0D14; border-radius:14px; padding:20px; text-align:center; margin-bottom:14px;">
          <div style="font-size:36px; margin-bottom:8px;">🛵</div>
          <div style="font-weight:800; font-size:15px;">Курьер везет заказ по Термезу</div>
          <div style="color:#FFB800; font-size:12px; margin-top:4px;">Ориентировочное время: ~20 мин</div>
        </div>
        <div style="font-size:12px; color:#94A3B8; margin-bottom:6px;">Адрес доставки: <strong style="color:#fff;">${{activeOrder.address}}</strong></div>
        <div style="font-size:12px; color:#94A3B8;">Телефон кафе: <a href="tel:+998908220101" style="color:#FFB800; text-decoration:none; font-weight:700;">+998 90 822 01 01</a></div>
      </div>
    `;
  }}
}}

function openPresentationModal() {{
  const modal = document.getElementById('presentationModal');
  const content = document.getElementById('presentationContent');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
      <h3 style="font-size:16px; font-weight:900; margin:0;">⭐ Хиты Продаж</h3>
      <button onclick="closeModals()" style="background:none; border:none; color:#fff; font-size:22px; cursor:pointer;">✕</button>
    </div>
    <div style="text-align:center; padding:10px 0;">
      <img src="images/photo_2026-08-28_17-25-23.jpg" style="width:100%; height:180px; object-fit:cover; border-radius:14px; margin-bottom:12px;">
      <h3 style="font-size:17px; font-weight:900; margin:0;">San Sebastian Lotus</h3>
      <p style="color:#94A3B8; font-size:12px; margin:6px 0 14px;">Легендарный баскский чизкейк со свежей карамелью Lotus Biscoff.</p>
      <button class="btn-primary-sm" style="width:100%; padding:12px; text-align:center; cursor:pointer;" onclick="quickAddToCart('prod-cake-1'); closeModals();">
        Заказать за 65 000 сум
      </button>
    </div>
  `;

  modal.style.display = 'flex';
}}

function openLightbox(img, title) {{
  const modal = document.getElementById('lightboxModal');
  const content = document.getElementById('lightboxContent');

  content.innerHTML = `
    <div style="position:relative; width:90vw; max-height:85vh; text-align:center;" onclick="event.stopPropagation()">
      <button onclick="closeModals()" style="position:absolute; top:-36px; right:0; background:rgba(255,255,255,0.2); color:#fff; border:none; width:32px; height:32px; border-radius:50%; font-size:16px; cursor:pointer;">✕</button>
      <img src="${{img}}" style="max-width:100%; max-height:75vh; border-radius:14px; object-fit:contain; box-shadow:0 20px 50px rgba(0,0,0,0.8);">
      <div style="color:#fff; font-size:15px; font-weight:700; margin-top:10px;">${{title}}</div>
    </div>
  `;

  modal.style.display = 'flex';
}}

function showAboutModal() {{
  const modal = document.getElementById('presentationModal');
  const content = document.getElementById('presentationContent');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
      <h3 style="font-size:17px; font-weight:900; margin:0;">📍 О ресторане</h3>
      <button onclick="closeModals()" style="background:none; border:none; color:#fff; font-size:22px; cursor:pointer;">✕</button>
    </div>
    <div style="padding:10px 0; font-size:13px; color:#CBD5E1; line-height:1.6;">
      <div style="font-weight:900; font-size:16px; color:#fff; margin-bottom:4px;">AMERICAN | Premium Fast Food</div>
      <div style="color:#FFB800; font-weight:700; margin-bottom:12px;">г. Термез, район Юбилейный</div>
      
      <div style="background:#10131E; padding:12px; border-radius:10px; border:1px solid #212638; margin-bottom:12px;">
        <div style="margin-bottom:6px;">🕒 <strong>Режим работы:</strong> с 09:00 утра до 22:00 ночи</div>
        <div style="margin-bottom:6px;">📞 <strong>Телефон 1:</strong> <a href="tel:+998908220101" style="color:#38BDF8; font-weight:700; text-decoration:none;">+998 90 822 01 01</a></div>
        <div>📞 <strong>Телефон 2:</strong> <a href="tel:+998918220101" style="color:#38BDF8; font-weight:700; text-decoration:none;">+998 91 822 01 01</a></div>
      </div>
      
      <div style="margin-bottom:14px; text-align:center;">
        <a href="https://yandex.uz/maps/?text=Surkhandarya+Termez+Yubileyniy" target="_blank" class="btn-secondary-sm" style="display:inline-block; text-decoration:none; padding:10px 16px; margin:4px;">
          🗺️ Яндекс Карты
        </a>
        <a href="https://www.google.com/maps/search/?api=1&query=Termez+Uzbekistan" target="_blank" class="btn-secondary-sm" style="display:inline-block; text-decoration:none; padding:10px 16px; margin:4px;">
          📍 Google Maps
        </a>
      </div>
      <button class="btn-primary-sm" style="width:100%; padding:12px; text-align:center; cursor:pointer;" onclick="closeModals()">
        Закрыть
      </button>
    </div>
  `;

  modal.style.display = 'flex';
}}

function closeModals() {{
  document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
}}
"""

with open('android_app/app/src/main/assets/www/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js_content)

print("Updated android_app/app/src/main/assets/www/app.js successfully!")
