import React from 'react';
import './ProductDetail.css';
import { useMax } from '../../hooks/useMax';
import { useFeatures } from '../../hooks/useFeatures';

const ProductDetail = ({
  product,
  quantity,
  onUpdateQuantity,
  onBack,
  onAddToCart,
  onAddToWishlist,
  isInWishlist,
  onAddToComparison,
  isInComparison
}) => {
  const { mx } = useMax();
  const features = useFeatures();

  const handleAddToCart = () => {
    if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
    onAddToCart(product);
  };

  const handleQuantityChange = (delta) => {
    if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');
    onUpdateQuantity(product, delta);
  };

  const handleWishlist = () => {
    if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');
    onAddToWishlist();
  };

  const handleComparison = () => {
    if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');
    onAddToComparison();
  };

  return (
    <div className="product-detail-container">
      {/* Кнопка назад */}
      <button className="back-button" onClick={onBack}>
        ← Назад к товарам
      </button>

      {/* Изображение / иконка товара */}
      <div className="product-hero">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="product-icon-large" style={{ display: product.image ? 'none' : 'flex' }}>
          {product.icon || '📦'}
        </div>

        {/* Кнопки действий поверх изображения */}
        <div className="product-actions-overlay">
          {features.wishlist && (
            <button
              className={`action-overlay-btn ${isInWishlist ? 'active' : ''}`}
              onClick={handleWishlist}
              title={isInWishlist ? 'Убрать из избранного' : 'В избранное'}
            >
              {isInWishlist ? '❤️' : '🤍'}
            </button>
          )}
          {features.comparison && (
            <button
              className={`action-overlay-btn ${isInComparison ? 'active' : ''}`}
              onClick={handleComparison}
              title={isInComparison ? 'Убрать из сравнения' : 'Сравнить'}
            >
              ⚖️
            </button>
          )}
        </div>
      </div>

      {/* Информация о товаре */}
      <div className="product-info-section">
        <div className="product-category-badge">
          {product.categoryId || 'Товар'}
        </div>

        <h1 className="product-detail-title">{product.title}</h1>

        <p className="product-detail-description">
          {product.fullDescription || product.description}
        </p>

        {/* Рейтинг (если включены отзывы) */}
        {features.reviews && product.rating && (
          <div className="product-rating">
            <span className="rating-stars">
              {'⭐'.repeat(Math.round(product.rating))}
            </span>
            <span className="rating-value">{product.rating.toFixed(1)}</span>
            {product.reviewCount && (
              <span className="review-count">({product.reviewCount} отзывов)</span>
            )}
          </div>
        )}

        {/* Цена */}
        <div className="product-price-section">
          {product.isSale && product.oldPrice && (
            <span className="old-price">{product.oldPrice.toLocaleString('ru-RU')} ₽</span>
          )}
          <span className="current-price">
            {product.price.toLocaleString('ru-RU')} ₽
          </span>
          {product.isSale && (
            <span className="sale-badge">🔥 Акция</span>
          )}
        </div>
      </div>

      {/* Характеристики */}
      {product.specs && product.specs.length > 0 && (
        <div className="specs-section">
          <h2 className="specs-title">📋 Характеристики</h2>
          <div className="specs-list">
            {product.specs.map((spec, index) => (
              <div key={index} className="spec-row">
                <span className="spec-label">{spec.label}</span>
                <span className="spec-value">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Управление количеством и кнопка "В корзину" */}
      <div className="purchase-section">
        {quantity > 0 ? (
          <div className="quantity-control-large">
            <button
              className="qty-btn-large decrease"
              onClick={() => handleQuantityChange(-1)}
            >
              −
            </button>
            <span className="qty-value-large">{quantity}</span>
            <button
              className="qty-btn-large increase"
              onClick={() => handleQuantityChange(1)}
            >
              +
            </button>
          </div>
        ) : null}

        <button
          className="add-to-cart-large-btn"
          onClick={handleAddToCart}
        >
          {quantity > 0 ? '🛒 Добавить ещё' : ' В корзину'}
        </button>

        {quantity > 0 && (
          <div className="cart-summary-small">
            В корзине: <strong>{quantity} шт.</strong> × {product.price.toLocaleString('ru-RU')} ₽ ={' '}
            <strong>{(quantity * product.price).toLocaleString('ru-RU')} ₽</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;