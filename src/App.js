import { useEffect, useState } from 'react';
import './App.css';
import { useMax } from './hooks/useMax';

import MainMenu from './components/MainMenu/MainMenu';
import CategoryList from './components/CategoryList/CategoryList';
import ProductList from './components/ProductList/ProductList';
import Form from './components/Form/Form';
import Specialist from './components/Specialist/Specialist';

// ============================================
// 🔥 ВСТРОЕННЫЕ ДАННЫЕ (пока нет реального сервера)
// Когда сервер будет готов — заменим на загрузку с API
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
  { id: 'ok-1', categoryId: 'online-kassy', title: 'Атол Онлайн', price: 24900, description: 'Фискальный регистратор для интернет-магазинов', icon: '💰', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop' },
  { id: 'ok-2', categoryId: 'online-kassy', title: 'Эвотор 7.2', price: 29900, description: 'Смарт-терминал с встроенным принтером', icon: '💰', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=200&fit=crop' },
  { id: 'ok-3', categoryId: 'online-kassy', title: 'Штрих-М ФР', price: 18500, description: 'Компактный фискальный регистратор', icon: '💰', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&h=200&fit=crop' },

  // Маркировка
  { id: 'mrk-1', categoryId: 'markirovka', title: 'Аппликатор этикеток', price: 45000, description: 'Автоматическое нанесение маркировки', icon: '🏷️', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&h=200&fit=crop' },
  { id: 'mrk-2', categoryId: 'markirovka', title: 'Принтер маркировки Zebra', price: 67000, description: 'Для печати DataMatrix кодов', icon: '🏷️', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=200&fit=crop' },

  // Принтеры этикеток
  { id: 'pe-1', categoryId: 'printery-etiketok', title: 'Zebra ZD220', price: 15900, description: 'Настольный термопринтер', icon: '🖨️', image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59e809?w=200&h=200&fit=crop' },
  { id: 'pe-2', categoryId: 'printery-etiketok', title: 'Godex G500', price: 12500, description: 'Термотрансферный принтер', icon: '🖨️', image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59e809?w=200&h=200&fit=crop' },
  { id: 'pe-3', categoryId: 'printery-etiketok', title: 'TSC TE244', price: 18900, description: 'Промышленный принтер', icon: '🖨️', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=200&fit=crop' },

  // ТСД
  { id: 'tsd-1', categoryId: 'tsd', title: 'Honeywell CK65', price: 89000, description: 'Промышленный терминал сбора данных', icon: '📱', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop' },
  { id: 'tsd-2', categoryId: 'tsd', title: 'Zebra MC3300', price: 75000, description: 'ТСД с Android', icon: '📱', image: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=200&h=200&fit=crop' },
  { id: 'tsd-3', categoryId: 'tsd', title: 'Urovo DT40', price: 42000, description: 'Бюджетный ТСД', icon: '📱', image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=200&h=200&fit=crop' },

  // Интеграция 1С
  { id: 'int-1', categoryId: 'integratsiya-1s', title: 'МойСклад + WB', price: 5900, description: 'Интеграция с Wildberries (месяц)', icon: '🔗', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop' },
  { id: 'int-2', categoryId: 'integratsiya-1s', title: '1С + Ozon', price: 4900, description: 'Синхронизация с Ozon (месяц)', icon: '🔗', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop' },

  // Автоматизация
  { id: 'avt-1', categoryId: 'avtomatizatsiya', title: 'Автоматизация магазина "под ключ"', price: 120000, description: 'Полный комплект оборудования и ПО', icon: '⚙️', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop' },
  { id: 'avt-2', categoryId: 'avtomatizatsiya', title: 'Автоматизация склада', price: 180000, description: 'Комплексное решение для склада', icon: '⚙️', image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=200&h=200&fit=crop' },

  // Сканеры
  { id: 'sc-1', categoryId: 'skanery', title: 'Zebra DS2208', price: 8900, description: '2D сканер штрих-кодов', icon: '📷', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=200&h=200&fit=crop' },
  { id: 'sc-2', categoryId: 'skanery', title: 'Honeywell 1900', price: 12500, description: 'Промышленный 2D сканер', icon: '📷', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=200&h=200&fit=crop' },
  { id: 'sc-3', categoryId: 'skanery', title: 'Mercury 230', price: 3500, description: 'Бюджетный 1D сканер', icon: '📷', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=200&h=200&fit=crop' },

  // 1С
  { id: '1c-1', categoryId: '1s', title: '1С:Розница 8', price: 13900, description: 'Лицензия на 1 ПК', icon: '📊', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop' },
  { id: '1c-2', categoryId: '1s', title: '1С:Управление торговлей 8', price: 22600, description: 'Лицензия ПРОФ', icon: '📊', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop' },
  { id: '1c-3', categoryId: '1s', title: '1С:Бухгалтерия 8', price: 14400, description: 'ПРОФ редакция', icon: '📊', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop' },

  // POS
  { id: 'pos-1', categoryId: 'pos-oborudovanie', title: 'POS-терминал Атол RT', price: 54000, description: 'Моноблок с сенсорным экраном', icon: '🖥️', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop' },
  { id: 'pos-2', categoryId: 'pos-oborudovanie', title: 'POS-монитор 15"', price: 18900, description: 'Сенсорный монитор для кассы', icon: '🖥️', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop' },

  // Весы
  { id: 'vs-1', categoryId: 'vesy', title: 'Весы CAS ER-Plus', price: 15900, description: 'Торговые весы с печатью этикеток', icon: '⚖️', image: 'https://images.unsplash.com/photo-1581578017426-5ff6d7097bce?w=200&h=200&fit=crop' },
  { id: 'vs-2', categoryId: 'vesy', title: 'Весы Штрих М5', price: 8900, description: 'Фасовочные весы', icon: '⚖️', image: 'https://images.unsplash.com/photo-1581578017426-5ff6d7097bce?w=200&h=200&fit=crop' },

  // ПО
  { id: 'po-1', categoryId: 'po', title: 'Frontol 6', price: 9900, description: 'Кассовое ПО', icon: '💿', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop' },
  { id: 'po-2', categoryId: 'po', title: '1С:Розница (облако)', price: 2500, description: 'Аренда в месяц', icon: '💿', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop' },

  // ОФД
  { id: 'ofd-1', categoryId: 'ofd', title: 'ОФД "Платформа" (15 мес)', price: 3000, description: 'Обслуживание на 15 месяцев', icon: '📡', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&h=200&fit=crop' },
  { id: 'ofd-2', categoryId: 'ofd', title: 'Яндекс.ОФД (15 мес)', price: 3000, description: 'Обслуживание на 15 месяцев', icon: '📡', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&h=200&fit=crop' },

  // Битрикс24
  { id: 'bx-1', categoryId: 'bitrix24', title: 'Битрикс24:Стандартный', price: 4900, description: 'Тариф на 1 год', icon: '🏢', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop' },
  { id: 'bx-2', categoryId: 'bitrix24', title: 'Битрикс24:Профессиональный', price: 14900, description: 'Тариф на 1 год', icon: '🏢', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop' },

  // Банковское
  { id: 'bo-1', categoryId: 'bankovskoe', title: 'PAX A920', price: 29000, description: 'Смарт-терминал для эквайринга', icon: '💳', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop' },
  { id: 'bo-2', categoryId: 'bankovskoe', title: 'Verifone VX520', price: 18500, description: 'Классический PIN-пад', icon: '💳', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&h=200&fit=crop' },

  // Распродажа
  { id: 'rs-1', categoryId: 'rasprodazha', title: 'Штрих-М ФР (акция)', price: 14900, description: 'Скидка 20%! Фискальный регистратор', icon: '🔥', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop' },
  { id: 'rs-2', categoryId: 'rasprodazha', title: 'Godex G500 (акция)', price: 9900, description: 'Скидка 21%! Принтер этикеток', icon: '🔥', image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59e809?w=200&h=200&fit=crop' },

  // ФН
  { id: 'fn-1', categoryId: 'fn', title: 'ФН на 15 месяцев', price: 9500, description: 'Фискальный накопитель ФН-1', icon: '💾', image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=200&h=200&fit=crop' },
  { id: 'fn-2', categoryId: 'fn', title: 'ФН на 36 месяцев', price: 12500, description: 'Фискальный накопитель ФН-1', icon: '💾', image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=200&h=200&fit=crop' },
  { id: 'fn-3', categoryId: 'fn', title: 'ФН на 60 месяцев', price: 16900, description: 'Фискальный накопитель ФН-1', icon: '💾', image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=200&h=200&fit=crop' }
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

  useEffect(() => {
    if (mx) {
      mx.ready();
      if (mx.expand) mx.expand();
    }
  }, [mx]);

  // 🔥 Фильтрация товаров по категории (без запросов к серверу)
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    const filtered = PRODUCTS.filter(p => p.categoryId === category.id);
    setProductsForCategory(filtered);
    setCurrentScreen('products');
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