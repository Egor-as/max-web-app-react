import React from 'react';
import './Comparison.css';
import { useMax } from '../../hooks/useMax';
import { useComparison } from '../../hooks/useComparison';

const Comparison = ({ onBack, onAddToCart }) => {
    const { mx } = useMax();
    const { comparison, removeFromComparison, clearComparison } = useComparison();

    const specs = ['price', 'description', 'categoryId'];

    const handleRemove = (product) => {
        if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('warning');
        removeFromComparison(product.id);
    };

    const handleAddToCart = (product) => {
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
        if (onAddToCart) onAddToCart(product);
    };

    if (comparison.length === 0) {
        return (
            <div className="comparison-container">
                <button className="back-button" onClick={onBack}>← Назад</button>
                <div className="empty-state">
                    <span className="empty-icon">️</span>
                    <p>Нет товаров для сравнения</p>
                    <p className="empty-hint">Добавьте товары, нажимая на кнопку ⚖️ в каталоге</p>
                </div>
            </div>
        );
    }

    return (
        <div className="comparison-container">
            <button className="back-button" onClick={onBack}>← Назад</button>

            <div className="comparison-header">
                <h2 className="comparison-title">⚖️ Сравнение товаров</h2>
                <button className="clear-btn" onClick={clearComparison}>Очистить всё</button>
            </div>

            <div className="comparison-scroll">
                <div className="comparison-table" style={{ minWidth: `${comparison.length * 220}px` }}>
                    {/* Заголовки */}
                    <div className="comparison-row header-row">
                        <div className="comparison-cell label-cell">Товар</div>
                        {comparison.map(product => (
                            <div key={product.id} className="comparison-cell product-cell">
                                <div className="product-icon-small">{product.icon || '📦'}</div>
                                <div className="product-name">{product.title}</div>
                                <button className="remove-small" onClick={() => handleRemove(product)}></button>
                            </div>
                        ))}
                    </div>

                    {/* Цена */}
                    <div className="comparison-row">
                        <div className="comparison-cell label-cell">Цена</div>
                        {comparison.map(product => (
                            <div key={product.id} className="comparison-cell">
                                <span className="price-value">{product.price.toLocaleString('ru-RU')} ₽</span>
                                <button className="add-cart-small" onClick={() => handleAddToCart(product)}>В корзину</button>
                            </div>
                        ))}
                    </div>

                    {/* Описание */}
                    <div className="comparison-row">
                        <div className="comparison-cell label-cell">Описание</div>
                        {comparison.map(product => (
                            <div key={product.id} className="comparison-cell">
                                <span className="desc-value">{product.description}</span>
                            </div>
                        ))}
                    </div>

                    {/* Полное описание */}
                    <div className="comparison-row">
                        <div className="comparison-cell label-cell">Подробно</div>
                        {comparison.map(product => (
                            <div key={product.id} className="comparison-cell">
                                <span className="desc-value">{product.fullDescription || '—'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Comparison;