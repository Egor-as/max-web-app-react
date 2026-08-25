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
  { id: 'ok-1', categoryId: 'online-kassy', title: 'Атол Онлайн', price: 24900, description: 'Фискальный регистратор для интернет-магазинов' },
  { id: 'ok-2', categoryId: 'online-kassy', title: 'Эвотор 7.2', price: 29900, description: 'Смарт-терминал с встроенным принтером' },
  { id: 'ok-3', categoryId: 'online-kassy', title: 'Штрих-М ФР', price: 18500, description: 'Компактный фискальный регистратор' },

  // Маркировка
  { id: 'mrk-1', categoryId: 'markirovka', title: 'Аппликатор этикеток', price: 45000, description: 'Автоматическое нанесение маркировки' },
  { id: 'mrk-2', categoryId: 'markirovka', title: 'Принтер маркировки Zebra', price: 67000, description: 'Для печати DataMatrix кодов' },

  // Принтеры этикеток
  { id: 'pe-1', categoryId: 'printery-etiketok', title: 'Zebra ZD220', price: 15900, description: 'Настольный термопринтер' },
  { id: 'pe-2', categoryId: 'printery-etiketok', title: 'Godex G500', price: 12500, description: 'Термотрансферный принтер' },
  { id: 'pe-3', categoryId: 'printery-etiketok', title: 'TSC TE244', price: 18900, description: 'Промышленный принтер' },

  // ТСД
  { id: 'tsd-1', categoryId: 'tsd', title: 'Honeywell CK65', price: 89000, description: 'Промышленный терминал сбора данных' },
  { id: 'tsd-2', categoryId: 'tsd', title: 'Zebra MC3300', price: 75000, description: 'ТСД с Android' },
  { id: 'tsd-3', categoryId: 'tsd', title: 'Urovo DT40', price: 42000, description: 'Бюджетный ТСД' },

  // Интеграция 1С с маркетплейсами
  { id: 'int-1', categoryId: 'integratsiya-1s', title: 'МойСклад + WB', price: 5900, description: 'Интеграция с Wildberries (месяц)' },
  { id: 'int-2', categoryId: 'integratsiya-1s', title: '1С + Ozon', price: 4900, description: 'Синхронизация с Ozon (месяц)' },

  // Автоматизация
  { id: 'avt-1', categoryId: 'avtomatizatsiya', title: 'Автоматизация магазина "под ключ"', price: 120000, description: 'Полный комплект оборудования и ПО' },
  { id: 'avt-2', categoryId: 'avtomatizatsiya', title: 'Автоматизация склада', price: 180000, description: 'Комплексное решение для склада' },

  // Сканеры штрих-кода
  { id: 'sc-1', categoryId: 'skanery', title: 'Zebra DS2208', price: 8900, description: '2D сканер штрих-кодов' },
  { id: 'sc-2', categoryId: 'skanery', title: 'Honeywell 1900', price: 12500, description: 'Промышленный 2D сканер' },
  { id: 'sc-3', categoryId: 'skanery', title: 'Mercury 230', price: 3500, description: 'Бюджетный 1D сканер' },

  // 1С
  { id: '1c-1', categoryId: '1s', title: '1С:Розница 8', price: 13900, description: 'Лицензия на 1 ПК' },
  { id: '1c-2', categoryId: '1s', title: '1С:Управление торговлей 8', price: 22600, description: 'Лицензия ПРОФ' },
  { id: '1c-3', categoryId: '1s', title: '1С:Бухгалтерия 8', price: 14400, description: 'ПРОФ редакция' },

  // POS-оборудование
  { id: 'pos-1', categoryId: 'pos-oborudovanie', title: 'POS-терминал Атол RT', price: 54000, description: 'Моноблок с сенсорным экраном' },
  { id: 'pos-2', categoryId: 'pos-oborudovanie', title: 'POS-монитор 15"', price: 18900, description: 'Сенсорный монитор для кассы' },

  // Весы
  { id: 'vs-1', categoryId: 'vesy', title: 'Весы CAS ER-Plus', price: 15900, description: 'Торговые весы с печатью этикеток' },
  { id: 'vs-2', categoryId: 'vesy', title: 'Весы Штрих М5', price: 8900, description: 'Фасовочные весы' },

  // ПО
  { id: 'po-1', categoryId: 'po', title: 'Frontol 6', price: 9900, description: 'Кассовое ПО' },
  { id: 'po-2', categoryId: 'po', title: '1С:Розница (облако)', price: 2500, description: 'Аренда в месяц' },

  // ОФД
  { id: 'ofd-1', categoryId: 'ofd', title: 'ОФД "Платформа" (15 мес)', price: 3000, description: 'Обслуживание на 15 месяцев' },
  { id: 'ofd-2', categoryId: 'ofd', title: 'Яндекс.ОФД (15 мес)', price: 3000, description: 'Обслуживание на 15 месяцев' },

  // Битрикс24
  { id: 'bx-1', categoryId: 'bitrix24', title: 'Битрикс24:Стандартный', price: 4900, description: 'Тариф на 1 год' },
  { id: 'bx-2', categoryId: 'bitrix24', title: 'Битрикс24:Профессиональный', price: 14900, description: 'Тариф на 1 год' },

  // Банковское оборудование
  { id: 'bo-1', categoryId: 'bankovskoe', title: 'PAX A920', price: 29000, description: 'Смарт-терминал для эквайринга' },
  { id: 'bo-2', categoryId: 'bankovskoe', title: 'Verifone VX520', price: 18500, description: 'Классический PIN-пад' },

  // Распродажа
  { id: 'rs-1', categoryId: 'rasprodazha', title: 'Штрих-М ФР (акция)', price: 14900, description: 'Скидка 20%! Фискальный регистратор' },
  { id: 'rs-2', categoryId: 'rasprodazha', title: 'Godex G500 (акция)', price: 9900, description: 'Скидка 21%! Принтер этикеток' },

  // Фискальный накопитель
  { id: 'fn-1', categoryId: 'fn', title: 'ФН на 15 месяцев', price: 9500, description: 'Фискальный накопитель ФН-1' },
  { id: 'fn-2', categoryId: 'fn', title: 'ФН на 36 месяцев', price: 12500, description: 'Фискальный накопитель ФН-1' },
  { id: 'fn-3', categoryId: 'fn', title: 'ФН на 60 месяцев', price: 16900, description: 'Фискальный накопитель ФН-1' }
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