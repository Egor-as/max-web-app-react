import React, { useState } from 'react';
import './CategoryList.css';
import { useMax } from '../../hooks/useMax';

const CategoryList = ({ categories, onSelectCategory, onNavigateToMain }) => {
    const { mx } = useMax();
    const [searchQuery, setSearchQuery] = useState('');

    // 🔍 Фильтрация категорий по поисковому запросу
    const filteredCategories = categories.filter(category => 
        category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (category) => {
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');
        onSelectCategory(category);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');
    };

    const clearSearch = () => {
        setSearchQuery('');
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');
    };

    // Цветовые градиенты для категорий (циклически)
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    ];

    return (
        <div className="category-list-container">
            <button className="back-button" onClick={onNavigateToMain}>
                ← В главное меню
            </button>

            <div className="category-header">
                <h2 className="category-title">Каталог</h2>
                <p className="category-subtitle">
                    {categories.length} категорий оборудования
                </p>
            </div>

            {/* 🔍 СТРОКА ПОИСКА КАТЕГОРИЙ */}
            <div className="search-container">
                <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Поиск категории..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    {searchQuery && (
                        <button className="search-clear-btn" onClick={clearSearch} title="Очистить поиск">
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Сетка категорий или сообщение о том, что ничего не найдено */}
            {filteredCategories.length > 0 ? (
                <div className="category-grid">
                    {filteredCategories.map((category, index) => (
                        <button
                            key={category.id}
                            className="category-card"
                            onClick={() => handleSelect(category)}
                            style={{ background: gradients[index % gradients.length] }}
                        >
                            <div className="category-icon-wrapper">
                                <span className="category-icon">{category.icon}</span>
                            </div>
                            <div className="category-info">
                                <div className="category-name">{category.title}</div>
                                <div className="category-description">{category.description}</div>
                            </div>
                            <div className="category-arrow">→</div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="empty-search-state">
                    <span className="empty-icon">😕</span>
                    <p>Категории не найдены</p>
                    <button className="reset-search-btn" onClick={clearSearch}>
                        Сбросить поиск
                    </button>
                </div>
            )}
        </div>
    );
};

export default CategoryList;