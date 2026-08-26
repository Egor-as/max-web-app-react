import React, { useState, useMemo, useCallback } from 'react';
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import { useMax } from '../../hooks/useMax';

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

const ProductList = ({ 
    category,
    products,
    cartItems, 
    setCartItems, 
    onNavigateToForm, 
    onBackToCategories,
    onProductClick
}) => {
    const { mx } = useMax();
    
    // 🔥 Состояния поиска и фильтров
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [onlySale, setOnlySale] = useState(false);

    // 🔥 Фильтрация и сортировка
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Поиск по названию и описанию
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(p => 
                p.title.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query)
            );
        }

        // Фильтр по цене
        if (priceRange.min) {
            result = result.filter(p => p.price >= Number(priceRange.min));
        }
        if (priceRange.max) {
            result = result.filter(p => p.price <= Number(priceRange.max));
        }

        // Фильтр "Только со скидкой"
        if (onlySale) {
            result = result.filter(p => p.isSale || p.categoryId === 'rasprodazha');
        }

        // Сортировка
        switch (sortBy) {
            case 'price_asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
            default:
                break;
        }

        return result;
    }, [products, searchQuery, priceRange, onlySale, sortBy]);

    const updateQuantity = useCallback((product, delta) => {
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');

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
    }, [mx, setCartItems]);

    const total = getTotalPrice(cartItems);
    const isCartEmpty = cartItems.length === 0;

    const clearFilters = () => {
        setSearchQuery('');
        setPriceRange({ min: '', max: '' });
        setOnlySale(false);
        setSortBy('default');
    };

    const hasActiveFilters = searchQuery || priceRange.min || priceRange.max || onlySale || sortBy !== 'default';

    return (
        <div className="list">
            <button className="back-button" onClick={onBackToCategories}>
                ← К категориям
            </button>

            <div className="list-header">
                <h2 className="list-title">
                    {category?.icon} {category?.title}
                </h2>
                <p className="list-subtitle">
                    {category?.description} • {products.length} товаров
                </p>
            </div>

            {/* 🔥 БЛОК ПОИСКА И ФИЛЬТРОВ */}
            <div className="search-filters-block">
                <div className="search-row">
                    <div className="search-input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Поиск товаров..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button 
                                className="search-clear"
                                onClick={() => setSearchQuery('')}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <button 
                        className={`filters-toggle ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        ⚙️
                    </button>
                </div>

                {/* Раскрывающаяся панель фильтров */}
                {showFilters && (
                    <div className="filters-panel">
                        <div className="filter-group">
                            <label className="filter-label">Сортировка</label>
                            <select 
                                className="filter-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="default">По умолчанию</option>
                                <option value="price_asc">Сначала дешёвые</option>
                                <option value="price_desc">Сначала дорогие</option>
                                <option value="name">По названию (А-Я)</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Цена, ₽</label>
                            <div className="price-range">
                                <input
                                    className="price-input"
                                    type="number"
                                    placeholder="от"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                                />
                                <span className="price-separator">—</span>
                                <input
                                    className="price-input"
                                    type="number"
                                    placeholder="до"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                                />
                            </div>
                        </div>

                        <label className="checkbox-filter">
                            <input
                                type="checkbox"
                                checked={onlySale}
                                onChange={(e) => setOnlySale(e.target.checked)}
                            />
                            <span>Только со скидкой 🔥</span>
                        </label>

                        {hasActiveFilters && (
                            <button className="clear-filters-btn" onClick={clearFilters}>
                                Сбросить фильтры
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Счётчик найденных товаров */}
            {(searchQuery || hasActiveFilters) && (
                <div className="results-count">
                    Найдено: {filteredProducts.length} из {products.length}
                </div>
            )}
            
            {filteredProducts.length === 0 ? (
                <div className="empty-results">
                    <div className="empty-icon">🔍</div>
                    <h3>Ничего не найдено</h3>
                    <p>Попробуйте изменить параметры поиска</p>
                    {hasActiveFilters && (
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            Сбросить фильтры
                        </button>
                    )}
                </div>
            ) : (
                filteredProducts.map(item => {
                    const cartItem = cartItems.find(ci => ci.id === item.id);
                    const quantity = cartItem ? cartItem.quantity : 0;

                    return (
                        <ProductItem
                            key={item.id}
                            product={item}
                            quantity={quantity}
                            onUpdateQuantity={updateQuantity}
                            onProductClick={onProductClick}
                        />
                    );
                })
            )}

            {!isCartEmpty && (
                <div className="bottom-action-bar">
                    <button 
                        className="custom-main-button"
                        onClick={() => {
                            if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
                            onNavigateToForm();
                        }}
                    >
                        Оформить заказ на {total.toLocaleString('ru-RU')} ₽ →
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductList;