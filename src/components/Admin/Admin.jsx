import React, { useState } from 'react';
import './Admin.css';
import { useMax } from '../../hooks/useMax';
import { useApi } from '../../hooks/useApi';

const Admin = ({ products, categories, onAddProduct, onDeleteProduct, onBack }) => {
    const { mx, user } = useMax();
    const { request } = useApi();
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [adminToken, setAdminToken] = useState('');
    const [activeTab, setActiveTab] = useState('list');
    const [isLoading, setIsLoading] = useState(false);
    
    const [newProduct, setNewProduct] = useState({
        title: '',
        price: '',
        description: '',
        fullDescription: '',
        categoryId: categories[0]?.id || '',
        icon: '',
        image: ''
    });

    const handleLogin = async () => {
        if (!password.trim()) {
            alert('Введите пароль');
            return;
        }

        if (!user || !user.id) {
            const msg = 'Не удалось определить ваш ID. Пожалуйста, откройте приложение через Max.';
            if (mx?.showAlert) mx.showAlert({ message: msg });
            else alert(msg);
            return;
        }

        const userIdStr = String(user.id).trim();
        if (userIdStr === '' || userIdStr === 'undefined' || userIdStr === 'null') {
            alert('Ваш ID не определён корректно. Перезапустите приложение.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await request('/api/admin/login', {
                method: 'POST',
                body: JSON.stringify({ 
                    password, 
                    userId: userIdStr 
                })
            });
            
            if (result.success && result.token) {
                setIsAuthenticated(true);
                setAdminToken(result.token);
                if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('success');
            }
        } catch (error) {
            let errorMsg = 'Неверный пароль или доступ запрещён';
            if (error.message.includes('ID') || error.message.includes('403')) {
                errorMsg = 'Доступ запрещён. Только администратор может войти.';
            }
            
            if (mx?.showAlert) mx.showAlert({ message: errorMsg });
            else alert(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await request('/api/admin/logout', {
                method: 'POST',
                headers: { 'x-admin-token': adminToken }
            });
        } catch (error) {
            console.error('Ошибка выхода:', error);
        }
        setIsAuthenticated(false);
        setAdminToken('');
        setPassword('');
    };

    const handleAddProduct = async () => {
        if (!newProduct.title.trim() || !newProduct.price || !newProduct.categoryId) {
            if (mx?.showAlert) {
                mx.showAlert({ message: 'Заполните обязательные поля' });
            } else {
                alert('Заполните обязательные поля');
            }
            return;
        }

        setIsLoading(true);
        try {
            const product = {
                id: 'custom-' + Date.now(),
                title: newProduct.title.trim(),
                price: Number(newProduct.price),
                description: newProduct.description.trim(),
                fullDescription: newProduct.fullDescription.trim() || newProduct.description.trim(),
                categoryId: newProduct.categoryId,
                icon: newProduct.icon || '📦',
                image: newProduct.image.trim()
            };

            const result = await request('/api/products', {
                method: 'POST',
                headers: { 'x-admin-token': adminToken },
                body: JSON.stringify(product)
            });
            
            onAddProduct(result.product);
            
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
        } catch (error) {
            alert(`Ошибка: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Удалить этот товар?')) return;
        
        setIsLoading(true);
        try {
            await request(`/api/products/${productId}`, { 
                method: 'DELETE',
                headers: { 'x-admin-token': adminToken }
            });
            onDeleteProduct(productId);
            if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
        } catch (error) {
            alert(`Ошибка: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // ============================================
    // ЭКРАН ВХОДА
    // ============================================
    if (!isAuthenticated) {
        return (
            <div className="admin-container">
                {onBack && <button className="back-button" onClick={onBack}>← Назад</button>}
                
                <div className="admin-login">
                    <div className="login-icon">🔐</div>
                    <h2 className="login-title">Админ-панель</h2>
                    <p className="login-subtitle">
                        {user?.id ? `Вход для пользователя ID: ${user.id}` : 'Откройте приложение через Max для входа'}
                    </p>
                    
                    {user?.id ? (
                        <>
                            <div className="form-group">
                                <label className="form-label">Пароль</label>
                                <input 
                                    className="form-input" 
                                    type="password" 
                                    placeholder="Введите пароль" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()} 
                                    disabled={isLoading} 
                                />
                            </div>
                            <button 
                                className="submit-button" 
                                onClick={handleLogin} 
                                disabled={isLoading}
                            >
                                {isLoading ? 'Проверка...' : 'Войти'}
                            </button>
                        </>
                    ) : (
                        <p style={{ color: '#ff3b30', textAlign: 'center' }}>
                            ⚠️ Не удалось определить ваш ID.<br/>
                            Откройте приложение через Max.
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // ============================================
    // АДМИН-ПАНЕЛЬ (после успешного входа)
    // ============================================
    return (
        <div className="admin-container">
            {onBack && <button className="back-button" onClick={onBack}>← Назад</button>}
            <div className="admin-header">
                <h2 className="admin-title">🛠️ Управление товарами</h2>
                <p className="admin-subtitle">Всего товаров: {products.length}</p>
                <button className="logout-btn" onClick={handleLogout}>Выйти</button>
            </div>
            <div className="admin-tabs">
                <button 
                    className={`admin-tab ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                     Список
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'add' ? 'active' : ''}`}
                    onClick={() => setActiveTab('add')}
                >
                    ➕ Добавить
                </button>
            </div>
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
                                    disabled={isLoading}
                                >
                                    ️
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
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

                    <button 
                        className="submit-button" 
                        onClick={handleAddProduct}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Добавление...' : '✅ Добавить товар'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Admin;