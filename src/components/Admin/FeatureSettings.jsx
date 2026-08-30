import React from 'react';
import './Admin.css';
import { useFeatures } from '../../hooks/useFeatures';

const FeatureSettings = () => {
  const features = useFeatures();

  const featureList = [
    {
      key: 'loyalty',
      title: 'Программа лояльности',
      description: 'Накопительные скидки для постоянных клиентов',
      icon: '💎',
      color: '#9c27b0'
    },
    {
      key: 'promoCodes',
      title: 'Промокоды',
      description: 'Скидки по промокодам и купонам',
      icon: '🎟️',
      color: '#ff9800'
    },
    {
      key: 'reviews',
      title: 'Отзывы и рейтинги',
      description: 'Клиенты могут оставлять отзывы о товарах',
      icon: '⭐',
      color: '#ffc107'
    },
    {
      key: 'wishlist',
      title: 'Избранное',
      description: 'Сохранение понравившихся товаров',
      icon: '❤️',
      color: '#e91e63'
    },
    {
      key: 'comparison',
      title: 'Сравнение товаров',
      description: 'Сравнение характеристик товаров',
      icon: '⚖️',
      color: '#2196f3'
    },
    {
      key: 'clientNotifications',
      title: 'Уведомления клиентам',
      description: 'Email/SMS о статусе заказа',
      icon: '📧',
      color: '#4caf50'
    }
  ];

  return (
    <div className="feature-settings">
      <h2 className="admin-title">⚙️ Бизнес-функции</h2>
      <p className="feature-settings-hint">
        Для изменения настроек отредактируйте файл <code>.env</code> и перезапустите сервер
      </p>

      <div className="feature-grid">
        {featureList.map(feature => (
          <div 
            key={feature.key} 
            className={`feature-card ${features[feature.key] ? 'enabled' : 'disabled'}`}
          >
            <div className="feature-header">
              <span className="feature-icon" style={{ background: feature.color }}>
                {feature.icon}
              </span>
              <div className="feature-status">
                <span className={`status-badge ${features[feature.key] ? 'active' : 'inactive'}`}>
                  {features[feature.key] ? 'Включено' : 'Отключено'}
                </span>
              </div>
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="feature-info">
        <h3>📝 Как управлять функциями:</h3>
        <ol>
          <li>Откройте файл <code>.env</code> в папке фронтенда</li>
          <li>Найдите нужную функцию (например, <code>REACT_APP_FEATURE_LOYALTY</code>)</li>
          <li>Измените значение на <code>true</code> (включить) или <code>false</code> (выключить)</li>
          <li>Сохраните файл и перезапустите <code>npm start</code></li>
        </ol>
      </div>
    </div>
  );
};

export default FeatureSettings;