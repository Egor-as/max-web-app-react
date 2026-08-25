import React from 'react';
import './CategoryList.css';
import { useMax } from '../../hooks/useMax';

const CategoryList = ({ categories, onSelectCategory, onNavigateToMain }) => {
    const { mx } = useMax();

    const handleSelect = (category) => {
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');
        onSelectCategory(category);
    };

    return (
        <div className="category-list-container">
            <button className="back-button" onClick={onNavigateToMain}>
                ← В главное меню
            </button>

            <h2 className="category-title">Каталог оборудования</h2>
            <p className="category-subtitle">Выберите категорию товаров</p>

            <div className="category-grid">
                {categories.map(category => (
                    <button
                        key={category.id}
                        className="category-card"
                        onClick={() => handleSelect(category)}
                    >
                        <div className="category-icon">{category.icon}</div>
                        <div className="category-info">
                            <div className="category-name">{category.title}</div>
                            <div className="category-description">{category.description}</div>
                        </div>
                        <div className="category-arrow">→</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryList;