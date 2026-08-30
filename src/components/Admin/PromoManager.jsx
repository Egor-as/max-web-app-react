import React, { useState, useEffect } from 'react';
import './Admin.css';
import { useApi } from '../../hooks/useApi';
import { useMax } from '../../hooks/useMax';

const PromoManager = ({ token }) => {
  const { request } = useApi();
  const { mx } = useMax();
  const [promoCodes, setPromoCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    type: 'percent',
    active: true,
    usageLimit: 100,
    minOrderAmount: 0,
    expiresAt: '2027-12-31T23:59:59.000Z',
    description: ''
  });

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    setIsLoading(true);
    try {
      const result = await request('/api/admin/promo-codes', {
        headers: { 'x-admin-token': token }
      });
      setPromoCodes(result.promoCodes || []);
    } catch (error) {
      console.error('Ошибка загрузки промокодов:', error);
      setError('Не удалось загрузить промокоды');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
    
    if (!formData.code.trim()) {
      setError('Введите код промокода');
      return;
    }
    if (!formData.discount || Number(formData.discount) <= 0) {
      setError('Введите корректную скидку');
      return;
    }

    try {
      await request('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'x-admin-token': token },
        body: JSON.stringify(formData)
      });
      setSuccess('Промокод создан!');
      setShowForm(false);
      resetForm();
      loadPromoCodes();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Ошибка создания промокода');
    }
  };

  const handleUpdate = async () => {
    if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
    
    try {
      await request(`/api/admin/promo-codes/${editingPromo.code}`, {
        method: 'PUT',
        headers: { 'x-admin-token': token },
        body: JSON.stringify(formData)
      });
      setSuccess('Промокод обновлён!');
      setEditingPromo(null);
      setShowForm(false);
      resetForm();
      loadPromoCodes();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Ошибка обновления');
    }
  };

  const handleDelete = async (code) => {
    if (!confirm(`Удалить промокод ${code}?`)) return;
    if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('warning');
    
    try {
      await request(`/api/admin/promo-codes/${code}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      setSuccess('Промокод удалён');
      loadPromoCodes();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Ошибка удаления');
    }
  };

  const handleToggleActive = async (promo) => {
    try {
      await request(`/api/admin/promo-codes/${promo.code}`, {
        method: 'PUT',
        headers: { 'x-admin-token': token },
        body: JSON.stringify({ active: !promo.active })
      });
      loadPromoCodes();
    } catch (error) {
      setError('Ошибка изменения статуса');
    }
  };

  const openEditForm = (promo) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      discount: promo.discount,
      type: promo.type,
      active: promo.active,
      usageLimit: promo.usageLimit,
      minOrderAmount: promo.minOrderAmount || 0,
      expiresAt: promo.expiresAt,
      description: promo.description || ''
    });
    setShowForm(true);
    setError('');
  };

  const openCreateForm = () => {
    setEditingPromo(null);
    resetForm();
    setShowForm(true);
    setError('');
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount: '',
      type: 'percent',
      active: true,
      usageLimit: 100,
      minOrderAmount: 0,
      expiresAt: '2027-12-31T23:59:59.000Z',
      description: ''
    });
  };

  const getTypeLabel = (type) => {
    const labels = {
      percent: '📊 Процент',
      fixed: ' Фиксированная сумма',
      loyalty: '💎 Повторный заказ'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      percent: '#007AFF',
      fixed: '#34c759',
      loyalty: '#af52de'
    };
    return colors[type] || '#666';
  };

  if (isLoading) {
    return <div className="admin-loading">Загрузка...</div>;
  }

  return (
    <div className="promo-manager">
      <div className="promo-header">
        <h2 className="admin-title">🎟️ Управление промокодами</h2>
        <button className="admin-btn-primary" onClick={openCreateForm}>
          + Создать промокод
        </button>
      </div>

      {error && <div className="admin-error">⚠️ {error}</div>}
      {success && <div className="admin-success">✅ {success}</div>}

      {/* Форма создания/редактирования */}
      {showForm && (
        <div className="promo-form-modal">
          <div className="promo-form-content">
            <h3>{editingPromo ? '✏️ Редактировать промокод' : '➕ Новый промокод'}</h3>
            
            <div className="form-row">
              <label>Код промокода *</label>
              <input
                type="text"
                className="form-input"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                disabled={!!editingPromo}
                placeholder="Например: WELCOME10"
              />
            </div>

            <div className="form-row">
              <label>Тип скидки *</label>
              <select
                className="form-input"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="percent">📊 Процентная (%)</option>
                <option value="fixed">💵 Фиксированная сумма (₽)</option>
                <option value="loyalty">💎 Скидка на повторные заказы</option>
              </select>
            </div>

            <div className="form-row">
              <label>
                {formData.type === 'fixed' ? 'Сумма скидки (₽) *' : 'Размер скидки (%) *'}
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                placeholder={formData.type === 'fixed' ? '500' : '10'}
                min="1"
              />
            </div>

            <div className="form-row">
              <label>Минимальная сумма заказа (₽)</label>
              <input
                type="number"
                className="form-input"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="form-row">
              <label>Лимит использований</label>
              <input
                type="number"
                className="form-input"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                placeholder="100"
                min="1"
              />
            </div>

            <div className="form-row">
              <label>Срок действия</label>
              <input
                type="datetime-local"
                className="form-input"
                value={formData.expiresAt ? formData.expiresAt.slice(0, 16) : ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  expiresAt: new Date(e.target.value).toISOString() 
                })}
              />
            </div>

            <div className="form-row">
              <label>Описание</label>
              <textarea
                className="form-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Краткое описание промокода"
                rows="3"
              />
            </div>

            <div className="form-row checkbox-row">
              <label>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <span>Активен</span>
              </label>
            </div>

            <div className="form-actions">
              <button className="admin-btn-secondary" onClick={() => setShowForm(false)}>
                Отмена
              </button>
              <button 
                className="admin-btn-primary" 
                onClick={editingPromo ? handleUpdate : handleCreate}
              >
                {editingPromo ? '💾 Сохранить' : ' Создать'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Список промокодов */}
      <div className="promo-list">
        {promoCodes.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎟️</span>
            <p>Промокоды не созданы</p>
          </div>
        ) : (
          promoCodes.map(promo => (
            <div key={promo.id} className={`promo-card ${!promo.active ? 'inactive' : ''}`}>
              <div className="promo-card-header">
                <div className="promo-code-info">
                  <span className="promo-code">{promo.code}</span>
                  <span 
                    className="promo-type-badge" 
                    style={{ background: getTypeColor(promo.type) }}
                  >
                    {getTypeLabel(promo.type)}
                  </span>
                </div>
                <div className="promo-actions">
                  <button 
                    className={`toggle-btn ${promo.active ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleActive(promo)}
                    title={promo.active ? 'Деактивировать' : 'Активировать'}
                  >
                    {promo.active ? '✅' : '️'}
                  </button>
                  <button className="edit-btn" onClick={() => openEditForm(promo)}>
                    ✏️
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(promo.code)}>
                    🗑️
                  </button>
                </div>
              </div>

              <div className="promo-card-body">
                <div className="promo-discount-info">
                  <span className="discount-value">
                    {promo.type === 'fixed' 
                      ? `${promo.discount} ₽` 
                      : `${promo.discount}%`}
                  </span>
                  <span className="discount-label">скидка</span>
                </div>

                <div className="promo-stats">
                  <div className="stat-item">
                    <span className="stat-label">Использовано</span>
                    <span className="stat-value">{promo.usedCount} / {promo.usageLimit}</span>
                  </div>
                  {promo.minOrderAmount > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Мин. заказ</span>
                      <span className="stat-value">{promo.minOrderAmount} ₽</span>
                    </div>
                  )}
                </div>

                {promo.description && (
                  <p className="promo-description">{promo.description}</p>
                )}

                <div className="promo-footer">
                  <span className="promo-expiry">
                    📅 До {new Date(promo.expiresAt).toLocaleDateString('ru-RU')}
                  </span>
                  <div className="usage-bar">
                    <div 
                      className="usage-fill" 
                      style={{ 
                        width: `${Math.min(100, (promo.usedCount / promo.usageLimit) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PromoManager;