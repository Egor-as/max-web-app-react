import React from 'react';
import Button from "../Button/Button";
import './ProductItem.css';

const ProductItem = ({ product, className, quantity = 0, onUpdateQuantity }) => {
    if (!product) return null;

    const formattedPrice = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
    }).format(product.price);

    return (
        <div className={`product ${className || ''}`.trim()}>
            {product.image ? (
                <img src={product.image} alt={product.title} className="img" />
            ) : (
                <div className="img-placeholder">Нет изображения</div>
            )}
            
            <div className="title">{product.title}</div>
            <div className="description">{product.description}</div>
            
            <div className="price">
                <span>Стоимость: <b>{formattedPrice}</b></span>
            </div>
            
            {/* Условный рендеринг: кнопка или счетчик */}
            {quantity === 0 ? (
                <Button className="add-btn" onClick={() => onUpdateQuantity(product, 1)}>
                    В корзину
                </Button>
            ) : (
                <div className="quantity-control">
                    <button 
                        className="qty-btn" 
                        onClick={() => onUpdateQuantity(product, -1)}
                        aria-label="Уменьшить количество"
                    >
                        −
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button 
                        className="qty-btn" 
                        onClick={() => onUpdateQuantity(product, 1)}
                        aria-label="Увеличить количество"
                    >
                        +
                    </button>
                </div>
            )}
        </div>
    );
};

export default React.memo(ProductItem);