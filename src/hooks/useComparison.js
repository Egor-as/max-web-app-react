import { useState, useEffect } from 'react';

export function useComparison() {
  const [comparison, setComparison] = useState(() => {
    try {
      const saved = localStorage.getItem('comparison');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('comparison', JSON.stringify(comparison));
  }, [comparison]);

  const addToComparison = (product) => {
    setComparison(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      if (prev.length >= 4) {
        alert('Можно сравнивать не более 4 товаров');
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromComparison = (productId) => {
    setComparison(prev => prev.filter(p => p.id !== productId));
  };

  const isInComparison = (productId) => {
    return comparison.some(p => p.id === productId);
  };

  const clearComparison = () => setComparison([]);

  return { comparison, addToComparison, removeFromComparison, isInComparison, clearComparison };
}