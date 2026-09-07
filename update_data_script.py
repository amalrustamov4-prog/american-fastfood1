import json

with open('products_database.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# 1. Generate js/data.js
data_js_content = f"""/**
 * Real Menu Catalog for AMERICAN | Premium Fast Food
 * Termez, Surkhandarya, Yubileyniy
 */

const CAFE_SETTINGS = {{
  name: 'AMERICAN | Premium Fast Food',
  brand: 'AMERICAN',
  slogan: 'Premium Fast Food, Pizza, Burgers, San Sebastian & Sushi',
  phone: '+998 90 822 01 01',
  phoneClean: '+998908220101',
  phoneSecondary: '+998 91 822 01 01',
  phoneSecondaryClean: '+998918220101',
  workHours: 'Ежедневно: 09:00 — 22:00',
  deliveryTime: '25–35 мин',
  deliveryFee: 10000,
  freeDeliveryThreshold: 150000,
  address: 'Узбекистан, Сурхандарья, г. Термез, район Юбилейный',
  coords: [37.2285, 67.2753],
  currency: 'сум'
}};

const ORIGINAL_MENU_PAGES = [
  {{ id: 'page-1', title: 'Бургеры и Мини-сеты', image: 'images/photo_2026-08-28_17-22-56.jpg', category: 'Бургеры' }},
  {{ id: 'page-2', title: 'Лаваши, Тандыр, Донар и Питта', image: 'images/photo_2026-08-28_17-24-51.jpg', category: 'Лаваши' }},
  {{ id: 'page-3', title: 'Хот-доги и Сэндвичи', image: 'images/photo_2026-08-28_17-25-05.jpg', category: 'Хот-доги' }},
  {{ id: 'page-4', title: 'Стрипсы, Байтсы и Картофель Фри', image: 'images/photo_2026-08-28_17-25-14.jpg', category: 'Курица & Фри' }},
  {{ id: 'page-5', title: 'Пирожные San Sebastian (Lotus, Nutella, Bounty)', image: 'images/photo_2026-08-28_17-25-23.jpg', category: 'Десерты' }},
  {{ id: 'page-6', title: 'Бельгийские и Гонконгские Вафли', image: 'images/photo_2026-08-28_17-23-28.jpg', category: 'Вафли' }},
  {{ id: 'page-7', title: 'American Pizza (Chicago, Las Vegas, Miami)', image: 'images/photo_2026-08-28_17-23-08.jpg', category: 'Пицца' }},
  {{ id: 'page-8', title: 'American Pizza (Qazili, Peperoni, Miks)', image: 'images/photo_2026-08-28_17-24-03.jpg', category: 'Пицца' }},
  {{ id: 'page-9', title: 'Турецкие Пиде (Go\\'shtli, Qazili, Asalli)', image: 'images/photo_2026-08-28_17-23-18.jpg', category: 'Пиде' }},
  {{ id: 'page-10', title: 'Фирменные Салаты', image: 'images/photo_2026-08-28_17-23-35.jpg', category: 'Салаты' }},
  {{ id: 'page-11', title: 'Суши и Роллы (Филадельфия, Калифорния)', image: 'images/photo_2026-08-28_17-23-49.jpg', category: 'Суши' }},
  {{ id: 'page-12', title: 'Запеченные роллы и маки', image: 'images/photo_2026-08-28_17-24-39.jpg', category: 'Суши' }},
  {{ id: 'page-13', title: 'Большие Сеты Суши (American, Avtorskiy, Similan)', image: 'images/photo_2026-08-28_17-24-19.jpg', category: 'Сеты' }},
  {{ id: 'page-14', title: 'Чай, Милкшейки и Мохито', image: 'images/photo_2026-08-28_17-25-33.jpg', category: 'Напитки' }}
];

const INITIAL_CATEGORIES = [
  {{ id: 'all', name: 'Все меню', icon: '🔥' }},
  {{ id: 'burgers', name: 'Бургеры', icon: '🍔' }},
  {{ id: 'lavash', name: 'Лаваш & Тандыр', icon: '🌯' }},
  {{ id: 'hotdogs', name: 'Хот-доги & Клаб', icon: '🌭' }},
  {{ id: 'pizza', name: 'American Pizza & Пиде', icon: '🍕' }},
  {{ id: 'desserts', name: 'Сан-Себастьян & Вафли', icon: '🍰' }},
  {{ id: 'chicken', name: 'Стрипсы & Картофель Фри', icon: '🍗' }},
  {{ id: 'sushi', name: 'Суши & Сеты', icon: '🍱' }},
  {{ id: 'salads', name: 'Салаты', icon: '🥗' }},
  {{ id: 'drinks', name: 'Напитки & Милкшейки', icon: '🥤' }}
];

const INITIAL_PRODUCTS = {json.dumps(products, ensure_ascii=False, indent=2)};

const INITIAL_PROMOTIONS = [
  {{
    id: 'promo-1',
    title: 'Быстрая доставка по Термезу',
    badge: 'Спецпредложение',
    description: 'Доставим ваш заказ горячим и свежим за 25-35 минут!',
    image: 'images/photo_2026-08-28_17-23-01.jpg',
    discountCode: 'TERMEZ',
    discountPercent: 10,
    freeDelivery: false,
    active: true
  }}
];

const INITIAL_REVIEWS = [
  {{
    id: 'rev-1',
    author: 'Фаррух Каримов',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=farrukh',
    rating: 5,
    date: '2026-08-27',
    text: 'Самые лучшие бургеры и чизкейк Сан-Себастьян в Термезе! Всё очень свежее и сочное.',
    status: 'approved'
  }},
  {{
    id: 'rev-2',
    author: 'Шахноза Алиева',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=shahnoza',
    rating: 5,
    date: '2026-08-26',
    text: 'Тандырный лаваш просто бомба! Доставка в Юбилейный приехала всего за 20 минут.',
    status: 'approved'
  }},
  {{
    id: 'rev-3',
    author: 'Джамшид Рахимов',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=jamshid',
    rating: 5,
    date: '2026-08-25',
    text: 'Пицца Чикаго и суши American Set – высший класс. Будем заказывать постоянно!',
    status: 'approved'
  }}
];

const INITIAL_ORDERS = [];
"""

with open('js/data.js', 'w', encoding='utf-8') as f:
    f.write(data_js_content)

print("Updated js/data.js successfully!")
