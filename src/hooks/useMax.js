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

      setMaxData({
        mx: maxApp,
        user: user || null,
        queryId: queryId || null,
      });
    } else {
      console.warn('⚠️ [useMax] MaxWebApp не найден. Приложение должно работать внутри Max.');
    }
  }, []);

  return maxData;
}