import React, { useState } from 'react';
import './Admin.css';
import { useMax } from '../../hooks/useMax';

// 🔥 Пароль администратора (в реальном проекте — на сервере!)
const ADMIN_PASSWORD = 'admin123';

const Admin = ({ products, categories, onAddProduct, onDeleteProduct, onBack }) => {
    const { mx } = useMax();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('list'); // 'list' | 'add'
    
    // Форма добавления товара
    const [newProduct, setNewProduct] = useState({
        title: '',
        price: '',
        description: '',
        fullDescription: '',
        categoryId: categories[0]?.id || '',
        icon: '📦',
        image: ''
    });

    const handleLogin = () => {
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('success');
        } else {
            if (mx?.showAlert) {
                mx.showAlert({ message: 'Неверный пароль' });
            } else {
                alert('Неверный пароль');
            }
        }
    };

    const handleAddProduct = () => {
        if (!newProduct.title.trim() || !newProduct.price || !newProduct.categoryId) {
            if (mx?.showAlert) {
                mx.showAlert({ message: 'Заполните обязательные поля' });
            } else {
                alert('Заполните обязательные поля');
            }
            return;
        }

        const product = {
            id: 'custom-' + Date.now(),
            title: newProduct.title.trim(),
            price: Number(newProduct.price),
            description: newProduct.description.trim(),
            fullDescription: newProduct.fullDescription.trim() || newProduct.description.trim(),
            categoryId: newProduct.categoryId,
            icon: newProduct.icon || '📦',
            image: newProduct.image.trim(),
            isCustom: true,
            createdAt: new Date().toISOString()
        };

        onAddProduct(product);
        
        // Сброс формы
        setNewProduct({
            title: '',
            price: '',
            description: '',
            fullDescription: '',
            categoryId: categories[0]?.id || '',
            icon: '📦',
            image: ''
        });
        
        setActiveTab('list');
        
        if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('success');
    };

    const handleDelete = (productId) => {
        if (window.confirm('Удалить этот товар?')) {
            onDeleteProduct(productId);
            if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
        }
    };

    // ============================================
    // ЭКРАН ВХОДА
    // ============================================
    if (!isAuthenticated) {
        return (
            <div className="admin-container">
                {onBack && (
                    <button className="back-button" onClick={onBack}>← Назад</button>
                )}
                
                <div className="admin-login">
                    <div className="login-icon">🔐</div>
                    <h2 className="login-title">Админ-панель</h2>
                    <p className="login-subtitle">Введите пароль для доступа</p>
                    
                    <div className="form-group">
                        <label className="form-label">Пароль</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </div>
                    
                    <button className="submit-button" onClick={handleLogin}>
                        Войти
                    </button>
                    
                    <p className="password-hint">
                        Подсказка: admin123
                    </p>
                </div>
            </div>
        );
    }

    // ============================================
    // АДМИН-ПАНЕЛЬ
    // ============================================
    return (
        <div className="admin-container">
            {onBack && (
                <button className="back-button" onClick={onBack}>← Назад</button>
            )}

            <div className="admin-header">
                <h2 className="admin-title">🛠️ Управление товарами</h2>
                <p className="admin-subtitle">Всего товаров: {products.length}</p>
            </div>

            {/* Вкладки */}
            <div className="admin-tabs">
                <button 
                    className={`admin-tab ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    📋 Список
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'add' ? 'active' : ''}`}
                    onClick={() => setActiveTab('add')}
                >
                    ➕ Добавить
                </button>
            </div>

            {/* Вкладка: Список товаров */}
            {activeTab === 'list' && (
                <div className="admin-products-list">
                    {products.map(product => {
                        const category = categories.find(c => c.id === product.categoryId);
                        return (
                            <div key={product.id} className="admin-product-card">
                                <div className="admin-product-icon">
                                    {product.icon || '📦'}
                                </div>
                                <div className="admin-product-info">
                                    <div className="admin-product-title">{product.title}</div>
                                    <div className="admin-product-meta">
                                        <span className="admin-product-price">
                                            {product.price.toLocaleString('ru-RU')} ₽
                                        </span>
                                        <span className="admin-product-category">
                                            {category?.icon} {category?.title || '—'}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    className="admin-delete-btn"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Вкладка: Добавление товара */}
            {activeTab === 'add' && (
                <div className="admin-form">
                    <div className="form-group">
                        <label className="form-label">Название *</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Например: Атол Онлайн"
                            value={newProduct.title}
                            onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Цена (₽) *</label>
                        <input
                            className="form-input"
                            type="number"
                            placeholder="Например: 24900"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Категория *</label>
                        <select 
                            className="form-select"
                            value={newProduct.categoryId}
                            onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.icon} {cat.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Иконка (emoji)</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="📦"
                            value={newProduct.icon}
                            onChange={(e) => setNewProduct({...newProduct, icon: e.target.value})}
                            maxLength={2}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Краткое описание</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Фискальный регистратор"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Полное описание</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Подробное описание товара..."
                            value={newProduct.fullDescription}
                            onChange={(e) => setNewProduct({...newProduct, fullDescription: e.target.value})}
                            rows={4}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">URL картинки (необязательно)</label>
                        <input
                            className="form-input"
                            type="url"
                            placeholder="https://..."
                            value={newProduct.image}
                            onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                        />
                    </div>

                    <button className="submit-button" onClick={handleAddProduct}>
                        ✅ Добавить товар
                    </button>
                </div>
            )}
        </div>
    );
};

export default Admin;