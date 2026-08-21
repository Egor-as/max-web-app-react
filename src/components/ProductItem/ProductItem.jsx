import React from 'react';
import Button from "../Button/Button";
import './ProductItem.css';

const ProductItem = ({ product, className, onAdd }) => {
    // Защита от undefined product
    if (!product) {
        return null;
    }

    const onAddHandler = () => {
        if (onAdd) {
            onAdd(product);
        } else {
            console.warn('Функция onAdd не передана в ProductItem');
        }
    };

    // Безопасное объединение классов
    const finalClassName = `product ${className || ''}`.trim();

    // Форматирование цены (пример для рублей)
    const formattedPrice = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
    }).format(product.price);

    return (
        <div className={finalClassName}>
            {/* Изображение товара */}
            {product.image ? (
                <img 
                    src={product.image} 
                    alt={product.title}
                    className="img"
                />
            ) : (
                <div className="img-placeholder">Нет изображения</div>
            )}
            
            <div className="title">{product.title}</div>
            <div className="description">{product.description}</div>
            
            <div className="price">
                <span>Стоимость: <b>{formattedPrice}</b></span>
            </div>
            
            <Button 
                className="add-btn" 
                onClick={onAddHandler}
                disabled={!onAdd}
            >
                Добавить в корзину
            </Button>
        </div>
    );
};

// Оптимизация: компонент перерисовывается только при изменении пропсов
export default React.memo(ProductItem);