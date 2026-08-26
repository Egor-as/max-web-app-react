import React, { useState } from 'react';
import './ProductItem.css';

const ProductItem = ({ product, quantity, onUpdateQuantity, onProductClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleOpenDetail = () => {
        if (onProductClick) {
            onProductClick(product);
        }
    };

    return (
        <div className="product-item">
            <div className="product-top">
                {/* 🔥 Картинка кликабельная */}
                <div 
                    className="product-image-container clickable" 
                    onClick={handleOpenDetail}
                >
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
                    {/* 🔥 Название кликабельное */}
                    <h3 
                        className="product-title clickable" 
                        onClick={handleOpenDetail}
                    >
                        {product.title}
                    </h3>
                    
                    <div className="product-price">
                        {product.price.toLocaleString('ru-RU')} ₽
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
                                В корзину
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 🔥 Описание тоже кликабельное */}
            <p 
                className="product-description clickable" 
                onClick={handleOpenDetail}
            >
                {product.description}
            </p>
        </div>
    );
};

export default React.memo(ProductItem);