import { useMemo } from 'react';

export function useFeatures() {
  const features = useMemo(() => ({
    // Бизнес-функции
    loyalty: process.env.REACT_APP_FEATURE_LOYALTY === 'true',
    promoCodes: process.env.REACT_APP_FEATURE_PROMO_CODES === 'true',
    reviews: process.env.REACT_APP_FEATURE_REVIEWS === 'true',
    wishlist: process.env.REACT_APP_FEATURE_WISHLIST === 'true',
    comparison: process.env.REACT_APP_FEATURE_COMPARISON === 'true',
    clientNotifications: process.env.REACT_APP_FEATURE_CLIENT_NOTIFICATIONS === 'true',
    
    // Режим разработчика
    devMode: process.env.REACT_APP_DEV_MODE === 'true',
    
    // DaData
    dadata: process.env.REACT_APP_USE_DADATA === 'true',
  }), []);

  return features;
}