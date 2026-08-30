import React from 'react';
import './Wishlist.css';
import { useMax } from '../../hooks/useMax';
import { useWishlist } from '../../hooks/useWishlist';

const Wishlist = ({ onBack, onAddToCart, onNavigateToProduct }) => {
    const { mx } = useMax();
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

    const handleRemove = (product) => {
        if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('warning');
        removeFromWishlist(product.id);
    };

    const handleAddToCart = (product) => {
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
        if (onAddToCart) onAddToCart(product);
    };

    return (
        <div className="wishlist-container">
            <button className="back-button" onClick={onBack}>← Назад</button>

            <div className="wishlist-header">
                <h2 className="wishlist-title">❤️ Избранное</h2>
                {wishlist.length > 0 && (
                    <button className="clear-btn" onClick={clearWishlist}>
                        Очистить всё
                    </button>
                )}
            </div>

            {wishlist.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">💔</span>
                    <p>Список избранного пуст</p>
                    <p className="empty-hint">Добавляйте товары, нажимая на сердечко</p>
                </div>
            ) : (
                <div className="wishlist-list">
                    <p className="wishlist-count">{wishlist.length} {wishlist.length === 1 ? 'товар' : 'товаров'}</p>
                    {wishlist.map(product => (
                        <div key={product.id} className="wishlist-card">
                            <div className="wishlist-icon">{product.icon || ''}</div>
                            <div className="wishlist-info" onClick={() => onNavigateToProduct && onNavigateToProduct(product)}>
                                <h3 className="wishlist-title-text">{product.title}</h3>
                                <p className="wishlist-description">{product.description}</p>
                                <span className="wishlist-price">{product.price.toLocaleString('ru-RU')} ₽</span>
                            </div>
                            <div className="wishlist-actions">
                                <button className="add-cart-btn" onClick={() => handleAddToCart(product)}>
                                    🛒 В корзину
                                </button>
                                <button className="remove-btn" onClick={() => handleRemove(product)}>
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;