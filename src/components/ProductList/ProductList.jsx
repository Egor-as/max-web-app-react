import React, { useState } from 'react';
import './ProductList.css';
import { useMax } from '../../hooks/useMax';
import { useFeatures } from '../../hooks/useFeatures';
import { useWishlist } from '../../hooks/useWishlist';
import { useComparison } from '../../hooks/useComparison';

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
    const features = useFeatures();
    const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { comparison, addToComparison, removeFromComparison, isInComparison } = useComparison();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = products.filter(product => 
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (e) => setSearchQuery(e.target.value);
    const clearSearch = () => setSearchQuery('');

    const handleAddToCart = (product, e) => {
        if (e) e.stopPropagation();
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const handleQuantityChange = (product, delta, e) => {
        if (e) e.stopPropagation();
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (!existingItem) return prevItems;
            if (delta > 0) {
                return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            } else {
                if (existingItem.quantity > 1) {
                    return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item);
                }
                return prevItems.filter(item => item.id !== product.id);
            }
        });
    };

    const handleCardClick = (product) => {
        if (onProductClick) {
            if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');
            onProductClick(product);
        }
    };

    const toggleWishlist = (product, e) => {
        if (e) e.stopPropagation();
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const toggleComparison = (product, e) => {
        if (e) e.stopPropagation();
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');
        if (isInComparison(product.id)) {
            removeFromComparison(product.id);
        } else {
            addToComparison(product);
        }
    };

    const totalCartPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const getProductsWord = (count) => {
        const lastTwo = count % 100;
        const lastOne = count % 10;
        if (lastTwo >= 11 && lastTwo <= 19) return 'товаров';
        if (lastOne === 1) return 'товар';
        if (lastOne >= 2 && lastOne <= 4) return 'товара';
        return 'товаров';
    };

    const getCartQuantity = (productId) => {
        const item = cartItems.find(i => i.id === productId);
        return item ? item.quantity : 0;
    };

    return (
        <div className="product-list-container">
            <button className="back-button" onClick={onBackToCategories}>← Назад к категориям</button>

            <div className="products-header">
                <h2 className="products-title">{searchQuery ? `Результаты: "${searchQuery}"` : 'Товары'}</h2>
                <span className="products-count">{filteredProducts.length} {getProductsWord(filteredProducts.length)}</span>
            </div>

            {/* Кнопки быстрых действий (избранное и сравнение) */}
            {(features.wishlist || features.comparison) && (
                <div className="quick-actions">
                    {features.wishlist && (
                        <button 
                            className="quick-action-btn"
                            onClick={() => onProductClick && onProductClick({ type: 'wishlist' })}
                        >
                            <span className="quick-action-icon">❤️</span>
                            <span className="quick-action-text">Избранное</span>
                            {wishlist.length > 0 && <span className="quick-action-badge">{wishlist.length}</span>}
                        </button>
                    )}
                    {features.comparison && (
                        <button 
                            className="quick-action-btn"
                            onClick={() => onProductClick && onProductClick({ type: 'comparison' })}
                        >
                            <span className="quick-action-icon">️</span>
                            <span className="quick-action-text">Сравнение</span>
                            {comparison.length > 0 && <span className="quick-action-badge">{comparison.length}</span>}
                        </button>
                    )}
                </div>
            )}

            <div className="search-container">
                <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <input type="text" className="search-input" placeholder="Поиск товаров..." value={searchQuery} onChange={handleSearch} />
                    {searchQuery && <button className="search-clear-btn" onClick={clearSearch}>✕</button>}
                </div>
            </div>

            <div className="products-list">
                {filteredProducts.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📦</span>
                        <p>Товары не найдены</p>
                        {searchQuery && <button className="reset-search-btn" onClick={clearSearch}>Сбросить поиск</button>}
                    </div>
                ) : (
                    filteredProducts.map(product => {
                        const cartQuantity = getCartQuantity(product.id);
                        const isInCart = cartQuantity > 0;
                        const inWishlist = isInWishlist(product.id);
                        const inComparison = isInComparison(product.id);

                        return (
                            <div key={product.id} className="product-card" onClick={() => handleCardClick(product)}>
                                {/* Кнопки действий поверх карточки */}
                                <div className="product-actions">
                                    {features.wishlist && (
                                        <button 
                                            className={`action-btn wishlist ${inWishlist ? 'active' : ''}`}
                                            onClick={(e) => toggleWishlist(product, e)}
                                           // title={inWishlist ? 'Убрать из избранного' : 'В избранное'}
                                        >
                                            {inWishlist ? '❤️' : '🤍'}
                                        </button>
                                    )}
                                    {features.comparison && (
                                        <button 
                                            className={`action-btn comparison ${inComparison ? 'active' : ''}`}
                                            onClick={(e) => toggleComparison(product, e)}
                                           // title={inComparison ? 'Убрать из сравнения' : 'Сравнить'}
                                        >
                                            ⚖️
                                        </button>
                                    )}
                                    {features.reviews && product.rating && (
                                        <div className="rating-badge">
                                            ⭐ {product.rating.toFixed(1)}
                                        </div>
                                    )}
                                </div>

                                <div className="product-icon">{product.icon || '📦'}</div>
                                <div className="product-info">
                                    <h3 className="product-title">{product.title}</h3>
                                    <p className="product-description">{product.description}</p>
                                </div>
                                <div className="product-footer">
                                    <span className="product-price">{product.price.toLocaleString('ru-RU')} ₽</span>
                                    {isInCart ? (
                                        <div className="quantity-controls">
                                            <button className="quantity-btn decrease" onClick={(e) => handleQuantityChange(product, -1, e)}>−</button>
                                            <span className="quantity-value">{cartQuantity}</span>
                                            <button className="quantity-btn increase" onClick={(e) => handleQuantityChange(product, 1, e)}>+</button>
                                        </div>
                                    ) : (
                                        <button className="add-to-cart-btn" onClick={(e) => handleAddToCart(product, e)}>В корзину</button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {totalCartItems > 0 && (
                <button className="checkout-btn" onClick={onNavigateToForm}>
                    <span className="checkout-icon">🛒</span>
                    <span className="checkout-text">Оформить заказ</span>
                    <span className="checkout-price">{totalCartPrice.toLocaleString('ru-RU')} ₽</span>
                </button>
            )}
        </div>
    );
};

export default ProductList;