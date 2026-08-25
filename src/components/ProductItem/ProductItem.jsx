import React, { useState } from 'react';
import './ProductItem.css';

const ProductItem = ({ product, quantity, onUpdateQuantity }) => {
    // 🔥 Состояние: загрузилась ли картинка
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
        <div className="product-item">
            {/* 🔥 УМНАЯ КАРТИНКА: показывает <img> или fallback на emoji */}
            <div className="product-image-container">
                {product.image && !imageError ? (
                    <>
                        <img
                            src={product.image}
                            alt={product.title}
                            className={`product-image ${imageLoaded ? 'loaded' : ''}`}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                            loading="lazy"
                        />
                        {/* Показываем emoji, пока картинка грузится */}
                        {!imageLoaded && (
                            <div className="product-image-placeholder">
                                <span className="product-icon">{product.icon || '📦'}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="product-image-placeholder">
                        <span className="product-icon">{product.icon || '📦'}</span>
                    </div>
                )}
            </div>

            <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">
                    {product.price.toLocaleString('ru-RU')} ₽
                </div>
            </div>

            <div className="product-controls">
                {quantity > 0 ? (
                    <div className="quantity-control">
                        <button 
                            className="qty-btn" 
                            onClick={() => onUpdateQuantity(product, -1)}
                        >
                            −
                        </button>
                        <span className="qty-value">{quantity}</span>
                        <button 
                            className="qty-btn" 
                            onClick={() => onUpdateQuantity(product, 1)}
                        >
                            +
                        </button>
                    </div>
                ) : (
                    <button 
                        className="add-btn" 
                        onClick={() => onUpdateQuantity(product, 1)}
                    >
                        + В корзину
                    </button>
                )}
            </div>
        </div>
    );
};

export default React.memo(ProductItem);