import { useEffect, useState } from 'react';
import './App.css';
import { useMax } from './hooks/useMax';

import MainMenu from './components/MainMenu/MainMenu';
import CategoryList from './components/CategoryList/CategoryList';
import ProductList from './components/ProductList/ProductList';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Form from './components/Form/Form';
import Specialist from './components/Specialist/Specialist';

// ============================================
// 🔥 ВСТРОЕННЫЕ ДАННЫЕ (пока нет реального сервера)
// ============================================

const CATEGORIES = [
  { id: 'online-kassy', title: 'Онлайн-кассы', icon: '💰', description: 'Фискальные регистраторы и смарт-терминалы' },
  { id: 'markirovka', title: 'Маркировка', icon: '🏷️', description: 'Оборудование для маркировки товаров' },
  { id: 'printery-etiketok', title: 'Принтеры этикеток', icon: '🖨️', description: 'Термо и термотрансферные принтеры' },
  { id: 'tsd', title: 'ТСД', icon: '📱', description: 'Терминалы сбора данных' },
  { id: 'integratsiya-1s', title: 'Интеграция 1С с маркетплейсами', icon: '🔗', description: 'Синхронизация с Wildberries, Ozon, Яндекс.Маркет' },
  { id: 'avtomatizatsiya', title: 'Автоматизация', icon: '⚙️', description: 'Комплексные решения для бизнеса' },
  { id: 'skanery', title: 'Сканеры штрих-кода', icon: '📷', description: '1D и 2D сканеры' },
  { id: '1s', title: '1С', icon: '📊', description: 'Лицензии и конфигурации 1С' },
  { id: 'pos-oborudovanie', title: 'POS-оборудование', icon: '🖥️', description: 'POS-терминалы и периферия' },
  { id: 'vesy', title: 'Весы', icon: '⚖️', description: 'Торговые и фасовочные весы' },
  { id: 'po', title: 'Программное обеспечение', icon: '💿', description: 'Кассовое и складское ПО' },
  { id: 'ofd', title: 'Подключение к ОФД', icon: '📡', description: 'Операторы фискальных данных' },
  { id: 'bitrix24', title: 'Битрикс24', icon: '🏢', description: 'CRM и корпоративный портал' },
  { id: 'bankovskoe', title: 'Банковское оборудование', icon: '💳', description: 'Платежные терминалы и PIN-пады' },
  { id: 'rasprodazha', title: 'Распродажа', icon: '🔥', description: 'Товары со скидками' },
  { id: 'fn', title: 'Фискальный накопитель', icon: '💾', description: 'ФН на 15, 36 и 60 месяцев' }
];

const PRODUCTS = [
  // Онлайн-кассы
  { 
    id: 'ok-1', categoryId: 'online-kassy', title: 'Атол Онлайн', price: 24900, 
    description: 'Фискальный регистратор для интернет-магазинов',
    fullDescription: 'Атол Онлайн — современный фискальный регистратор, разработанный специально для интернет-магазинов. Поддерживает все требования 54-ФЗ, работает с маркировкой, имеет высокую скорость печати и надёжную конструкцию. Идеально подходит для среднего и крупного бизнеса.',
    specs: [
      { label: 'Скорость печати', value: '100 мм/с' },
      { label: 'Ширина чека', value: '80 мм' },
      { label: 'Интерфейсы', value: 'USB, Ethernet, Wi-Fi' },
      { label: 'ФН', value: 'В комплект не входит' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '💰', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop' 
  },
  { 
    id: 'ok-2', categoryId: 'online-kassy', title: 'Эвотор 7.2', price: 29900, 
    description: 'Смарт-терминал с встроенным принтером',
    fullDescription: 'Эвотор 7.2 — умный смарт-терминал с сенсорным экраном и встроенным принтером чеков. Работает на базе Android, поддерживает установку приложений из собственного магазина. Идеален для малого бизнеса, розничных магазинов и сферы услуг.',
    specs: [
      { label: 'Экран', value: '7" сенсорный' },
      { label: 'ОС', value: 'ЭвоторОС (Android)' },
      { label: 'Принтер', value: 'Встроенный, 57 мм' },
      { label: 'Аккумулятор', value: 'До 12 часов' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '💰', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop' 
  },
  { 
    id: 'ok-3', categoryId: 'online-kassy', title: 'Штрих-М ФР', price: 18500, 
    description: 'Компактный фискальный регистратор',
    fullDescription: 'Штрих-М ФР — надёжный и компактный фискальный регистратор для небольших магазинов. Отличается простой настройкой и низкой стоимостью владения. Поддерживает все форматы фискальных данных.',
    specs: [
      { label: 'Скорость печати', value: '75 мм/с' },
      { label: 'Ширина чека', value: '57 мм' },
      { label: 'Интерфейсы', value: 'USB, RS-232' },
      { label: 'Габариты', value: 'Компактный' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '💰', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop' 
  },

  // Маркировка
  { 
    id: 'mrk-1', categoryId: 'markirovka', title: 'Аппликатор этикеток', price: 45000, 
    description: 'Автоматическое нанесение маркировки',
    fullDescription: 'Профессиональный аппликатор этикеток для автоматического нанесения маркировки на продукцию. Подходит для линий упаковки и складов с высокой пропускной способностью.',
    specs: [
      { label: 'Производительность', value: 'до 60 этикеток/мин' },
      { label: 'Макс. размер этикетки', value: '100×150 мм' },
      { label: 'Интерфейс', value: 'Ethernet, USB' },
      { label: 'Питание', value: '220В' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '🏷️', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop' 
  },
  { 
    id: 'mrk-2', categoryId: 'markirovka', title: 'Принтер маркировки Zebra', price: 67000, 
    description: 'Для печати DataMatrix кодов',
    fullDescription: 'Промышленный принтер Zebra для печати кодов маркировки DataMatrix. Высокое разрешение печати обеспечивает идеальную читаемость кодов сканерами любого типа.',
    specs: [
      { label: 'Разрешение', value: '300 dpi' },
      { label: 'Скорость', value: '152 мм/с' },
      { label: 'Ширина печати', value: 'до 104 мм' },
      { label: 'Интерфейсы', value: 'USB, Ethernet, Wi-Fi' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '🏷️', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop' 
  },

  // Принтеры этикеток
  { 
    id: 'pe-1', categoryId: 'printery-etiketok', title: 'Zebra ZD220', price: 15900, 
    description: 'Настольный термопринтер',
    fullDescription: 'Настольный термопринтер Zebra ZD220 — идеальное решение для печати этикеток в малом бизнесе. Прост в настройке, надёжен в работе, поддерживает печать штрих-кодов любого типа.',
    specs: [
      { label: 'Тип печати', value: 'Термо' },
      { label: 'Разрешение', value: '203 dpi' },
      { label: 'Скорость', value: '152 мм/с' },
      { label: 'Ширина этикетки', value: 'до 104 мм' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '🖨️', image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59e809?w=400&h=400&fit=crop' 
  },
  { 
    id: 'pe-2', categoryId: 'printery-etiketok', title: 'Godex G500', price: 12500, 
    description: 'Термотрансферный принтер',
    fullDescription: 'Термотрансферный принтер Godex G500 — универсальное решение для печати этикеток. Поддерживает как термо-, так и термотрансферную печать, что обеспечивает долговечность этикеток.',
    specs: [
      { label: 'Тип печати', value: 'Термо/Термотрансфер' },
      { label: 'Разрешение', value: '203 dpi' },
      { label: 'Скорость', value: '127 мм/с' },
      { label: 'Память', value: '8 MB Flash, 16 MB SDRAM' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '🖨️', image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59e809?w=400&h=400&fit=crop' 
  },
  { 
    id: 'pe-3', categoryId: 'printery-etiketok', title: 'TSC TE244', price: 18900, 
    description: 'Промышленный принтер',
    fullDescription: 'Промышленный принтер TSC TE244 для больших объёмов печати. Металлическая конструкция обеспечивает надёжную работу в режиме 24/7.',
    specs: [
      { label: 'Тип печати', value: 'Термотрансфер' },
      { label: 'Разрешение', value: '300 dpi' },
      { label: 'Скорость', value: '127 мм/с' },
      { label: 'Диаметр рулона', value: 'до 128 мм' },
      { label: 'Гарантия', value: '24 месяца' }
    ],
    icon: '🖨️', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop' 
  },

  // ТСД
  { 
    id: 'tsd-1', categoryId: 'tsd', title: 'Honeywell CK65', price: 89000, 
    description: 'Промышленный терминал сбора данных',
    fullDescription: 'Honeywell CK65 — флагманский терминал сбора данных для сложных условий эксплуатации. Защищённый корпус IP67, выдерживает падения с высоты до 1.8 м. Работает на Android 10.',
    specs: [
      { label: 'ОС', value: 'Android 10' },
      { label: 'Экран', value: '4" IPS, 480×640' },
      { label: 'Защита', value: 'IP67, MIL-STD-810G' },
      { label: 'Сканер', value: '1D/2D, дальность до 20 м' },
      { label: 'Гарантия', value: '24 месяца' }
    ],
    icon: '📱', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop' 
  },
  { 
    id: 'tsd-2', categoryId: 'tsd', title: 'Zebra MC3300', price: 75000, 
    description: 'ТСД с Android',
    fullDescription: 'Zebra MC3300 — мощный терминал сбора данных с ergonomичным дизайном. Подходит для складов, логистики и розничной торговли. Поддержка Wi-Fi, Bluetooth, 4G.',
    specs: [
      { label: 'ОС', value: 'Android' },
      { label: 'Экран', value: '4.3" цветной' },
      { label: 'Сканер', value: 'SE4710 1D/2D' },
      { label: 'Связь', value: 'Wi-Fi, BT, 4G LTE' },
      { label: 'Гарантия', value: '24 месяца' }
    ],
    icon: '📱', image: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=400&h=400&fit=crop' 
  },
  { 
    id: 'tsd-3', categoryId: 'tsd', title: 'Urovo DT40', price: 42000, 
    description: 'Бюджетный ТСД',
    fullDescription: 'Urovo DT40 — доступный терминал сбора данных с хорошим соотношением цена/качество. Идеален для небольших складов и магазинов.',
    specs: [
      { label: 'ОС', value: 'Android 9' },
      { label: 'Экран', value: '4" цветной' },
      { label: 'Сканер', value: '1D/2D' },
      { label: 'Защита', value: 'IP65' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '📱', image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop' 
  },

  // Интеграция 1С
  { 
    id: 'int-1', categoryId: 'integratsiya-1s', title: 'МойСклад + WB', price: 5900, 
    description: 'Интеграция с Wildberries (месяц)',
    fullDescription: 'Сервис интеграции МойСклад с маркетплейсом Wildberries. Автоматическая синхронизация остатков, заказов и цен. Экономит время и исключает ошибки ручного ввода.',
    specs: [
      { label: 'Маркетплейс', value: 'Wildberries' },
      { label: 'Синхронизация', value: 'Каждые 15 минут' },
      { label: 'Функции', value: 'Остатки, заказы, цены' },
      { label: 'Период', value: '1 месяц' },
      { label: 'Поддержка', value: '24/7' }
    ],
    icon: '🔗', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop' 
  },
  { 
    id: 'int-2', categoryId: 'integratsiya-1s', title: '1С + Ozon', price: 4900, 
    description: 'Синхронизация с Ozon (месяц)',
    fullDescription: 'Готовое решение для интеграции 1С с маркетплейсом Ozon. Автоматическая выгрузка товаров, обновление остатков и получение заказов.',
    specs: [
      { label: 'Маркетплейс', value: 'Ozon' },
      { label: 'Версия 1С', value: 'УТ 11, Розница 2' },
      { label: 'Функции', value: 'Товары, остатки, заказы' },
      { label: 'Период', value: '1 месяц' },
      { label: 'Поддержка', value: '24/7' }
    ],
    icon: '🔗', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop' 
  },

  // Автоматизация
  { 
    id: 'avt-1', categoryId: 'avtomatizatsiya', title: 'Автоматизация магазина "под ключ"', price: 120000, 
    description: 'Полный комплект оборудования и ПО',
    fullDescription: 'Комплексное решение для автоматизации магазина: касса, сканер, принтер этикеток, весы, ПО 1С:Розница. Включает установку, настройку и обучение персонала.',
    specs: [
      { label: 'Состав', value: 'Касса + сканер + принтер + весы' },
      { label: 'ПО', value: '1С:Розница' },
      { label: 'Установка', value: 'Включена' },
      { label: 'Обучение', value: '2 часа' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '⚙️', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop' 
  },
  { 
    id: 'avt-2', categoryId: 'avtomatizatsiya', title: 'Автоматизация склада', price: 180000, 
    description: 'Комплексное решение для склада',
    fullDescription: 'Полная автоматизация складского учёта: ТСД, принтеры этикеток, стеллажи, ПО для управления складом. Оптимизирует процессы приёмки, хранения и отгрузки.',
    specs: [
      { label: 'ТСД', value: '2 шт' },
      { label: 'Принтеры', value: '2 шт' },
      { label: 'ПО', value: '1С:WMS' },
      { label: 'Внедрение', value: 'до 2 недель' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '⚙️', image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=400&fit=crop' 
  },

  // Сканеры
  { 
    id: 'sc-1', categoryId: 'skanery', title: 'Zebra DS2208', price: 8900, 
    description: '2D сканер штрих-кодов',
    fullDescription: 'Zebra DS2208 — универсальный 2D сканер для розничной торговли. Считывает все типы штрих-кодов, включая QR и DataMatrix. Простая настройка, надёжная работа.',
    specs: [
      { label: 'Тип', value: '2D (1D/2D)' },
      { label: 'Интерфейс', value: 'USB' },
      { label: 'Скорость', value: '60 скан/сек' },
      { label: 'Защита', value: 'IP42' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '📷', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop' 
  },
  { 
    id: 'sc-2', categoryId: 'skanery', title: 'Honeywell 1900', price: 12500, 
    description: 'Промышленный 2D сканер',
    fullDescription: 'Honeywell 1900 — промышленный сканер для сложных условий. Выдерживает падения с высоты до 1.8 м, работает в пыли и при низкой температуре.',
    specs: [
      { label: 'Тип', value: '2D' },
      { label: 'Защита', value: 'IP52' },
      { label: 'Падение', value: 'до 1.8 м' },
      { label: 'Интерфейс', value: 'USB, RS-232' },
      { label: 'Гарантия', value: '24 месяца' }
    ],
    icon: '📷', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop' 
  },
  { 
    id: 'sc-3', categoryId: 'skanery', title: 'Mercury 230', price: 3500, 
    description: 'Бюджетный 1D сканер',
    fullDescription: 'Mercury 230 — бюджетный 1D сканер для небольших магазинов. Считывает линейные штрих-коды EAN, UPC, Code 39 и другие.',
    specs: [
      { label: 'Тип', value: '1D' },
      { label: 'Интерфейс', value: 'USB' },
      { label: 'Скорость', value: '100 скан/сек' },
      { label: 'Питание', value: 'От USB' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '📷', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop' 
  },

  // 1С
  { 
    id: '1c-1', categoryId: '1s', title: '1С:Розница 8', price: 13900, 
    description: 'Лицензия на 1 ПК',
    fullDescription: '1С:Розница 8 — специализированное решение для автоматизации розничных магазинов. Управление продажами, складом, лояльностью, отчётность.',
    specs: [
      { label: 'Версия', value: '8.3' },
      { label: 'Лицензия', value: 'На 1 ПК' },
      { label: 'Обновления', value: '12 месяцев' },
      { label: 'Поддержка', value: 'Консультации' },
      { label: 'Совместимость', value: 'Windows, Linux' }
    ],
    icon: '📊', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop' 
  },
  { 
    id: '1c-2', categoryId: '1s', title: '1С:Управление торговлей 8', price: 22600, 
    description: 'Лицензия ПРОФ',
    fullDescription: '1С:Управление торговлей 8 ПРОФ — комплексное решение для оптовой и розничной торговли. Управление закупками, продажами, складом, финансами.',
    specs: [
      { label: 'Версия', value: '8.3 ПРОФ' },
      { label: 'Лицензия', value: 'На 1 ПК' },
      { label: 'Обновления', value: '12 месяцев' },
      { label: 'Функции', value: 'Полный комплект' },
      { label: 'Совместимость', value: 'Windows, Linux' }
    ],
    icon: '📊', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop' 
  },
  { 
    id: '1c-3', categoryId: '1s', title: '1С:Бухгалтерия 8', price: 14400, 
    description: 'ПРОФ редакция',
    fullDescription: '1С:Бухгалтерия 8 ПРОФ — автоматизация бухгалтерского и налогового учёта. Формирование отчётности, расчёт зарплаты, учёт основных средств.',
    specs: [
      { label: 'Версия', value: '8.3 ПРОФ' },
      { label: 'Лицензия', value: 'На 1 ПК' },
      { label: 'Обновления', value: '12 месяцев' },
      { label: 'Учёт', value: 'Бухгалтерский, налоговый' },
      { label: 'Совместимость', value: 'Windows, Linux' }
    ],
    icon: '📊', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop' 
  },

  // POS
  { 
    id: 'pos-1', categoryId: 'pos-oborudovanie', title: 'POS-терминал Атол RT', price: 54000, 
    description: 'Моноблок с сенсорным экраном',
    fullDescription: 'POS-терминал Атол RT — готовое решение для кассовой зоны. Встроенный компьютер, сенсорный экран, всё необходимое для работы кассира.',
    specs: [
      { label: 'Экран', value: '15" сенсорный' },
      { label: 'Процессор', value: 'Intel Celeron' },
      { label: 'ОЗУ', value: '4 GB' },
      { label: 'Накопитель', value: 'SSD 128 GB' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '🖥️', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop' 
  },
  { 
    id: 'pos-2', categoryId: 'pos-oborudovanie', title: 'POS-монитор 15"', price: 18900, 
    description: 'Сенсорный монитор для кассы',
    fullDescription: 'POS-монитор 15 дюймов с сенсорным экраном. Совместим с любыми POS-системами, надёжный и долговечный.',
    specs: [
      { label: 'Диагональ', value: '15"' },
      { label: 'Тип', value: 'Сенсорный' },
      { label: 'Разрешение', value: '1024×768' },
      { label: 'Интерфейс', value: 'VGA, HDMI' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '🖥️', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop' 
  },

  // Весы
  { 
    id: 'vs-1', categoryId: 'vesy', title: 'Весы CAS ER-Plus', price: 15900, 
    description: 'Торговые весы с печатью этикеток',
    fullDescription: 'CAS ER-Plus — торговые весы с функцией печати этикеток. Идеальны для супермаркетов и магазинов самообслуживания. Быстрая печать, удобная клавиатура.',
    specs: [
      { label: 'Макс. вес', value: '15 кг' },
      { label: 'Точность', value: '5 г' },
      { label: 'Дисплей', value: 'LCD' },
      { label: 'Принтер', value: 'Термо, 58 мм' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '⚖️', image: 'https://images.unsplash.com/photo-1581578017426-5ff6d7097bce?w=400&h=400&fit=crop' 
  },
  { 
    id: 'vs-2', categoryId: 'vesy', title: 'Весы Штрих М5', price: 8900, 
    description: 'Фасовочные весы',
    fullDescription: 'Штрих М5 — простые и надёжные фасовочные весы для магазина. Подходят для взвешивания товаров на кассе или в зоне самообслуживания.',
    specs: [
      { label: 'Макс. вес', value: '6 кг' },
      { label: 'Точность', value: '2 г' },
      { label: 'Дисплей', value: 'LCD' },
      { label: 'Платформа', value: '230×330 мм' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '⚖️', image: 'https://images.unsplash.com/photo-1581578017426-5ff6d7097bce?w=400&h=400&fit=crop' 
  },

  // ПО
  { 
    id: 'po-1', categoryId: 'po', title: 'Frontol 6', price: 9900, 
    description: 'Кассовое ПО',
    fullDescription: 'Frontol 6 — современное кассовое ПО для розничных магазинов. Поддерживает все требования 54-ФЗ, работает с маркировкой, интеграция с 1С.',
    specs: [
      { label: 'Версия', value: '6' },
      { label: 'Лицензия', value: 'На 1 кассу' },
      { label: 'Обновления', value: '12 месяцев' },
      { label: 'Совместимость', value: 'Windows' },
      { label: 'Поддержка', value: '54-ФЗ, маркировка' }
    ],
    icon: '💿', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop' 
  },
  { 
    id: 'po-2', categoryId: 'po', title: '1С:Розница (облако)', price: 2500, 
    description: 'Аренда в месяц',
    fullDescription: '1С:Розница в облаке — не нужно покупать сервер и лицензию. Доступ с любого устройства, автоматические обновления, резервное копирование.',
    specs: [
      { label: 'Формат', value: 'Облако (SaaS)' },
      { label: 'Период', value: '1 месяц' },
      { label: 'Доступ', value: 'С любого устройства' },
      { label: 'Бэкапы', value: 'Ежедневные' },
      { label: 'Обновления', value: 'Автоматические' }
    ],
    icon: '💿', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop' 
  },

  // ОФД
  { 
    id: 'ofd-1', categoryId: 'ofd', title: 'ОФД "Платформа" (15 мес)', price: 3000, 
    description: 'Обслуживание на 15 месяцев',
    fullDescription: 'ОФД "Платформа ОФД" — передача фискальных данных в налоговую. Полное соответствие 54-ФЗ, личный кабинет с аналитикой продаж.',
    specs: [
      { label: 'Оператор', value: 'Платформа ОФД' },
      { label: 'Период', value: '15 месяцев' },
      { label: 'Личный кабинет', value: 'Есть' },
      { label: 'Аналитика', value: 'Есть' },
      { label: 'Поддержка', value: '24/7' }
    ],
    icon: '📡', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=400&fit=crop' 
  },
  { 
    id: 'ofd-2', categoryId: 'ofd', title: 'Яндекс.ОФД (15 мес)', price: 3000, 
    description: 'Обслуживание на 15 месяцев',
    fullDescription: 'Яндекс.ОФД — надёжный оператор фискальных данных от Яндекса. Высокая скорость передачи данных, удобная аналитика, интеграция с Яндекс.Кассой.',
    specs: [
      { label: 'Оператор', value: 'Яндекс.ОФД' },
      { label: 'Период', value: '15 месяцев' },
      { label: 'Личный кабинет', value: 'Есть' },
      { label: 'Интеграция', value: 'Яндекс.Касса' },
      { label: 'Поддержка', value: '24/7' }
    ],
    icon: '📡', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=400&fit=crop' 
  },

  // Битрикс24
  { 
    id: 'bx-1', categoryId: 'bitrix24', title: 'Битрикс24:Стандартный', price: 4900, 
    description: 'Тариф на 1 год',
    fullDescription: 'Битрикс24 Стандартный — CRM и корпоративный портал для малого бизнеса. Управление клиентами, задачами, проектами, внутренняя коммуникация.',
    specs: [
      { label: 'Тариф', value: 'Стандартный' },
      { label: 'Пользователи', value: 'До 50' },
      { label: 'Период', value: '1 год' },
      { label: 'Облачное хранилище', value: '100 GB' },
      { label: 'Функции', value: 'CRM, задачи, чат' }
    ],
    icon: '🏢', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop' 
  },
  { 
    id: 'bx-2', categoryId: 'bitrix24', title: 'Битрикс24:Профессиональный', price: 14900, 
    description: 'Тариф на 1 год',
    fullDescription: 'Битрикс24 Профессиональный — расширенный тариф для среднего бизнеса. Все функции Стандартного + автоматизация, аналитика, интеграции.',
    specs: [
      { label: 'Тариф', value: 'Профессиональный' },
      { label: 'Пользователи', value: 'До 100' },
      { label: 'Период', value: '1 год' },
      { label: 'Облачное хранилище', value: '1 TB' },
      { label: 'Функции', value: 'CRM, BPM, аналитика' }
    ],
    icon: '🏢', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop' 
  },

  // Банковское
  { 
    id: 'bo-1', categoryId: 'bankovskoe', title: 'PAX A920', price: 29000, 
    description: 'Смарт-терминал для эквайринга',
    fullDescription: 'PAX A920 — современный смарт-терминал для приёма платежей. Работает на Android, поддерживает все типы карт, NFC, QR-коды. Встроенный принтер чеков.',
    specs: [
      { label: 'ОС', value: 'Android' },
      { label: 'Экран', value: '5.72" сенсорный' },
      { label: 'Принтер', value: 'Встроенный' },
      { label: 'Приём', value: 'Карты, NFC, QR' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '💳', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop' 
  },
  { 
    id: 'bo-2', categoryId: 'bankovskoe', title: 'Verifone VX520', price: 18500, 
    description: 'Классический PIN-пад',
    fullDescription: 'Verifone VX520 — классический платёжный терминал. Надёжный, проверенный временем, подходит для магазинов с умеренным потоком клиентов.',
    specs: [
      { label: 'Тип', value: 'Стационарный' },
      { label: 'Приём', value: 'Карты с чипом и магнитной полосой' },
      { label: 'Интерфейс', value: 'Ethernet, RS-232' },
      { label: 'Принтер', value: 'Встроенный' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '💳', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop' 
  },

  // Распродажа
  { 
    id: 'rs-1', categoryId: 'rasprodazha', title: 'Штрих-М ФР (акция)', price: 14900, 
    description: 'Скидка 20%! Фискальный регистратор',
    fullDescription: 'Специальное предложение! Фискальный регистратор Штрих-М ФР со скидкой 20%. Компактный, надёжный, подходит для небольших магазинов. Количество ограничено!',
    specs: [
      { label: 'Скорость печати', value: '75 мм/с' },
      { label: 'Ширина чека', value: '57 мм' },
      { label: 'Скидка', value: '20%' },
      { label: 'Старая цена', value: '18 500 ₽' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '🔥', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop' 
  },
  { 
    id: 'rs-2', categoryId: 'rasprodazha', title: 'Godex G500 (акция)', price: 9900, 
    description: 'Скидка 21%! Принтер этикеток',
    fullDescription: 'Акция! Принтер этикеток Godex G500 со скидкой 21%. Термотрансферная печать, надёжная конструкция. Идеально для малого бизнеса.',
    specs: [
      { label: 'Тип печати', value: 'Термо/Термотрансфер' },
      { label: 'Разрешение', value: '203 dpi' },
      { label: 'Скидка', value: '21%' },
      { label: 'Старая цена', value: '12 500 ₽' },
      { label: 'Гарантия', value: '12 месяцев' }
    ],
    icon: '🔥', image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59e809?w=400&h=400&fit=crop' 
  },

  // ФН
  { 
    id: 'fn-1', categoryId: 'fn', title: 'ФН на 15 месяцев', price: 9500, 
    description: 'Фискальный накопитель ФН-1',
    fullDescription: 'Фискальный накопитель ФН-1 на 15 месяцев. Обязателен для работы онлайн-кассы. Соответствует требованиям 54-ФЗ, зарегистрирован в ФНС.',
    specs: [
      { label: 'Срок действия', value: '15 месяцев' },
      { label: 'Модель', value: 'ФН-1' },
      { label: 'Регистрация', value: 'В ФНС' },
      { label: 'Совместимость', value: 'Все ФР' },
      { label: 'Гарантия', value: 'На весь срок' }
    ],
    icon: '💾', image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=400&fit=crop' 
  },
  { 
    id: 'fn-2', categoryId: 'fn', title: 'ФН на 36 месяцев', price: 12500, 
    description: 'Фискальный накопитель ФН-1',
    fullDescription: 'Фискальный накопитель ФН-1 на 36 месяца. Экономия на замене — работает в 2 раза дольше, чем ФН на 15 месяцев.',
    specs: [
      { label: 'Срок действия', value: '36 месяцев' },
      { label: 'Модель', value: 'ФН-1' },
      { label: 'Регистрация', value: 'В ФНС' },
      { label: 'Совместимость', value: 'Все ФР' },
      { label: 'Гарантия', value: 'На весь срок' }
    ],
    icon: '💾', image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=400&fit=crop' 
  },
  { 
    id: 'fn-3', categoryId: 'fn', title: 'ФН на 60 месяцев', price: 16900, 
    description: 'Фискальный накопитель ФН-1',
    fullDescription: 'Фискальный накопитель ФН-1 на 60 месяцев. Максимальный срок действия — 5 лет без замены. Идеально для стабильного бизнеса.',
    specs: [
      { label: 'Срок действия', value: '60 месяцев' },
      { label: 'Модель', value: 'ФН-1' },
      { label: 'Регистрация', value: 'В ФНС' },
      { label: 'Совместимость', value: 'Все ФР' },
      { label: 'Гарантия', value: 'На весь срок' }
    ],
    icon: '💾', image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=400&fit=crop' 
  }
];

// ============================================
// КОМПОНЕНТ ПРИЛОЖЕНИЯ
// ============================================

function App() {
  const { mx } = useMax();
  
  const [currentScreen, setCurrentScreen] = useState('main');
  const [cartItems, setCartItems] = useState([]);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productsForCategory, setProductsForCategory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (mx) {
      mx.ready();
      if (mx.expand) mx.expand();
    }
  }, [mx]);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    const filtered = PRODUCTS.filter(p => p.categoryId === category.id);
    setProductsForCategory(filtered);
    setCurrentScreen('products');
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentScreen('productDetail');
  };

  // Универсальная функция обновления количества товара в корзине
  const updateCartQuantity = (product, delta) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (delta > 0) {
        if (existingItem) {
          return prevItems.map(item =>
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          );
        }
        return [...prevItems, { ...product, quantity: 1 }];
      } else {
        if (existingItem && existingItem.quantity > 1) {
          return prevItems.map(item =>
            item.id === product.id 
              ? { ...item, quantity: item.quantity - 1 } 
              : item
          );
        }
        return prevItems.filter(item => item.id !== product.id);
      }
    });
  };

  return (
    <div className="App">
      {currentScreen === 'main' && (
        <MainMenu onNavigate={setCurrentScreen} />
      )}

      {currentScreen === 'categories' && (
        <CategoryList 
          categories={CATEGORIES}
          onSelectCategory={handleSelectCategory}
          onNavigateToMain={() => setCurrentScreen('main')}
        />
      )}
      
      {currentScreen === 'products' && (
        <ProductList 
          category={selectedCategory}
          products={productsForCategory}
          cartItems={cartItems}
          setCartItems={setCartItems}
          onNavigateToForm={() => setCurrentScreen('form')}
          onBackToCategories={() => setCurrentScreen('categories')}
          onProductClick={handleSelectProduct}
        />
      )}

      {currentScreen === 'productDetail' && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          quantity={cartItems.find(i => i.id === selectedProduct.id)?.quantity || 0}
          onUpdateQuantity={updateCartQuantity}
          onBack={() => setCurrentScreen('products')}
        />
      )}
      
      {currentScreen === 'form' && (
        <Form 
          cartItems={cartItems}
          setCartItems={setCartItems}
          onBack={() => setCurrentScreen('products')}
        />
      )}

      {currentScreen === 'specialist' && (
        <Specialist onBack={() => setCurrentScreen('main')} />
      )}
    </div>
  );
}

export default App;