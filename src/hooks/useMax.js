import { useState, useEffect } from 'react';

export function useMax() {
  const [maxData, setMaxData] = useState({
    mx: null,
    user: null,
    queryId: null,
  });

  useEffect(() => {
    const maxApp = window.MaxWebApp || window.TelegramWebApp || window.WebApp;

    if (maxApp) {
      maxApp.ready();
      if (maxApp.expand) maxApp.expand();

      const user = maxApp.initDataUnsafe?.user;
      const queryId = maxApp.initDataUnsafe?.query_id;

      // Если есть реальные данные от Max — используем их
      if (user) {
        console.log('✅ [useMax] Получены реальные данные от Max:', user);
        setMaxData({
          mx: maxApp,
          user: user,
          queryId: queryId || null,
        });
        return;
      }
    }

    // 🔧 РЕЖИМ РАЗРАБОТЧИКА — включается только через переменную окружения
    const isDevMode = process.env.REACT_APP_DEV_MODE === 'true';
    
    if (isDevMode) {
      console.warn('⚠️ [useMax] MaxWebApp не найден. Активирован РЕЖИМ РАЗРАБОТЧИКА.');
      setMaxData({
        mx: maxApp || null,
        user: {
          id: Number(process.env.REACT_APP_DEV_USER_ID) || 12254301,
          first_name: process.env.REACT_APP_DEV_USER_NAME || 'Админ',
          username: 'dev_user',
        },
        queryId: null,
      });
    } else {
      console.warn('⚠️ [useMax] MaxWebApp не найден. Откройте приложение через Max.');
      setMaxData({
        mx: null,
        user: null,
        queryId: null,
      });
    }
  }, []);

  return maxData;
}