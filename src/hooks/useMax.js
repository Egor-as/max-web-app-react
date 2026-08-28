import { useState, useEffect } from 'react';

export function useMax() {
  const [maxData, setMaxData] = useState({
    mx: null,
    user: null,
    queryId: null,
  });

  useEffect(() => {
    // Проверяем наличие объекта MaxWebApp (или его аналогов)
    const maxApp = window.MaxWebApp || window.TelegramWebApp || window.WebApp;

    if (maxApp) {
      maxApp.ready();
      if (maxApp.expand) maxApp.expand();

      const user = maxApp.initDataUnsafe?.user;
      const queryId = maxApp.initDataUnsafe?.query_id;

      console.log('🔍 [useMax] Данные от Max:', maxApp.initDataUnsafe);
      console.log('🔍 [useMax] Извлеченный user:', user);

      setMaxData({
        mx: maxApp,
        user: user || null,
        queryId: queryId || null,
      });
    } else {
      console.warn('⚠️ [useMax] Объект MaxWebApp не найден. Запуск вне среды Max?');
      
      // 🔥 ВРЕМЕННЫЙ РЕЖИМ РАЗРАБОТЧИКА (ТОЛЬКО ДЛЯ ЛОКАЛЬНОГО ТЕСТА!)
      // Мы имитируем данные пользователя, чтобы вы могли тестировать админку на ПК.
      // ВАЖНО: Перед финальной загрузкой на Netlify этот блок нужно будет удалить!
      setMaxData({
        mx: null,
        user: { id: 12254301, first_name: 'Егор (Dev)' }, // Ваш реальный ID из логов
        queryId: 'dev-local-test',
      });
    }
  }, []);

  return maxData;
}