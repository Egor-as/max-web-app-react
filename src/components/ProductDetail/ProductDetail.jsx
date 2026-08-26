import React, { useState } from 'react';
import './ProductDetail.css';
import { useMax } from '../../hooks/useMax';

const ProductDetail = ({ product, quantity, onUpdateQuantity, onBack }) => {
    const { mx } = useMax();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    if (!product) {
        return (
            <div className="product-detail-container">
                <p style={{ textAlign: 'center', padding: '40px 20px', color: '#636366' }}>
                    Товар не найден
                </p>
                {onBack && (
                    <button className="back-button" onClick={onBack}>← Назад</button>
                )}
            </div>
        );
    }

    const handleAddToCart = () => {
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
        onUpdateQuantity(product, 1);
    };

    return (
        <div className="product-detail-container">
            {onBack && (
                <button className="back-button" onClick={onBack}>
                    ← Назад к товарам
                </button>
            )}

            {/* 🔥 Большая картинка сверху */}
            <div className="detail-image-container">
                {product.image && !imageError ? (
                    <>
                        <img
                            src={product.image}
                            alt={product.title}
                            className={`detail-image ${imageLoaded ? 'loaded' : ''}`}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                        />
                        {!imageLoaded && (
                            <div className="detail-image-placeholder">
                                <span className="detail-icon">{product.icon || '📦'}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="detail-image-placeholder">
                        <span className="detail-icon">{product.icon || '📦'}</span>
                    </div>
                )}
            </div>

            {/* 🔥 Информация о товаре */}
            <div className="detail-content">
                <h1 className="detail-title">{product.title}</h1>
                
                <div className="detail-price">
                    {product.price.toLocaleString('ru-RU')} ₽
                </div>

                {/* Описание */}
                <div className="detail-section">
                    <h3 className="detail-section-title">Описание</h3>
                    <p className="detail-description">
                        {product.fullDescription || product.description}
                    </p>
                </div>

                {/* Характеристики (если есть) */}
                {product.specs && (
                    <div className="detail-section">
                        <h3 className="detail-section-title">Характеристики</h3>
                        <div className="detail-specs">
                            {product.specs.map((spec, index) => (
                                <div key={index} className="spec-row">
                                    <span className="spec-label">{spec.label}</span>
                                    <span className="spec-value">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Преимущества */}
                <div className="detail-section">
                    <h3 className="detail-section-title">Преимущества</h3>
                    <ul className="detail-benefits">
                        <li>✅ Гарантия 12 месяцев</li>
                        <li>✅ Бесплатная доставка от 10 000 ₽</li>
                        <li>✅ Техническая поддержка 24/7</li>
                        <li>✅ Возврат в течение 14 дней</li>
                    </ul>
                </div>
            </div>

            {/* 🔥 Плавающая кнопка внизу */}
            <div className="detail-footer">
                {quantity > 0 ? (
                    <div className="detail-quantity-control">
                        <button 
                            className="detail-qty-btn" 
                            onClick={() => onUpdateQuantity(product, -1)}
                        >
                            −
                        </button>
                        <span className="detail-qty-value">
                            {quantity} шт.
                        </span>
                        <button 
                            className="detail-qty-btn" 
                            onClick={() => onUpdateQuantity(product, 1)}
                        >
                            +
                        </button>
                    </div>
                ) : (
                    <button 
                        className="detail-add-btn" 
                        onClick={handleAddToCart}
                    >
                        Добавить в корзину за {product.price.toLocaleString('ru-RU')} ₽
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;