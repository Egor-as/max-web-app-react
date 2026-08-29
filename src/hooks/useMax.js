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

      if (user) {
        setMaxData({
          mx: maxApp,
          user: user,
          queryId: queryId || null,
        });
        return;
      }
    }

    // 🔧 Режим разработчика — только для локального тестирования в браузере
    console.log('⚠️ [useMax] MaxWebApp не найден или user пустой. Используем режим разработчика.');
    setMaxData({
      mx: maxApp || null,
      user: { id: 12254301, first_name: 'Админ', username: 'admin' },
      queryId: null,
    });
  }, []);

  return maxData;
}