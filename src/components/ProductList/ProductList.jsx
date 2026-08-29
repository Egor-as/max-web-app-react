import React, { useState } from 'react';
import './ProductList.css';
import { useMax } from '../../hooks/useMax';

const ProductList = ({ products, categories, onAddToCart, onBack }) => {
    const { mx } = useMax();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [imageErrors, setImageErrors] = useState({});

    // 🔍 Фильтрация товаров по поиску и категории
    const filteredProducts = React.useMemo(() => {
        let filtered = products || [];

        if (selectedCategory) {
            filtered = filtered.filter(p => p.categoryId === selectedCategory);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(product => 
                product.title?.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query) ||
                product.fullDescription?.toLowerCase().includes(query)
            );
        }

        return filtered.sort((a, b) => a.title.localeCompare(b.title));
    }, [products, selectedCategory, searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');
    };

    const clearSearch = () => {
        setSearchQuery('');
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');
    };

    const handleAddToCart = (product) => {
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
        if (onAddToCart) onAddToCart(product);
    };

    const handleImageError = (productId) => {
        setImageErrors(prev => ({ ...prev, [productId]: true }));
    };

    return (
        <div className="product-list-container">
            {onBack && (
                <button className="back-button" onClick={onBack}>
                    ← Назад к категориям
                </button>
            )}

            {/*  СТРОКА ПОИСКА */}
            <div className="search-container">
                <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Поиск товаров..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    {searchQuery && (
                        <button className="search-clear-btn" onClick={clearSearch} title="Очистить поиск">
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Фильтр по категориям */}
            {categories && categories.length > 0 && (
                <div className="category-filter">
                    <button
                        className={`category-filter-btn ${selectedCategory === null ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(null)}
                    >
                        Все
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`category-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            {cat.icon} {cat.title}
                        </button>
                    ))}
                </div>
            )}

            {/* Заголовок и счётчик */}
            <div className="products-header">
                <h2 className="products-title">
                    {searchQuery ? `Результаты: "${searchQuery}"` : 'Товары'}
                </h2>
                <span className="products-count">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'товар' : 
                       (filteredProducts.length >= 2 && filteredProducts.length <= 4) ? 'товара' : 'товаров'}
                </span>
            </div>

            {/* Список товаров */}
            {filteredProducts.length === 0 ? (
                <div className="empty-search-state">
                    <span className="empty-icon">📦</span>
                    <p>{searchQuery ? 'Товары не найдены' : 'В этой категории пока нет товаров'}</p>
                    {searchQuery && (
                        <button className="reset-search-btn" onClick={clearSearch}>
                            Сбросить поиск
                        </button>
                    )}
                </div>
            ) : (
                <div className="products-list">
                    {filteredProducts.map(product => {
                        const hasImageError = imageErrors[product.id];
                        const showImage = product.image && !hasImageError;

                        return (
                            <div key={product.id} className="product-card">
                                {/* Картинка или иконка */}
                                {showImage ? (
                                    <img 
                                        src={product.image} 
                                        alt={product.title}
                                        className="product-image"
                                        loading="lazy"
                                        onError={() => handleImageError(product.id)}
                                    />
                                ) : (
                                    <div className="product-icon">
                                        {product.icon || ''}
                                    </div>
                                )}

                                {/* Информация */}
                                <div className="product-info">
                                    <h3 className="product-title">{product.title}</h3>
                                    <p className="product-description">{product.description}</p>
                                </div>

                                {/* Цена и кнопка */}
                                <div className="product-footer">
                                    <span className="product-price">
                                        {product.price.toLocaleString('ru-RU')} ₽
                                    </span>
                                    <button 
                                        className="add-to-cart-btn"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        В корзину
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProductList;