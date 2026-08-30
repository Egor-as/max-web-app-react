import { useState, useEffect } from 'react';
import { useApi } from './useApi';

export function useDadata(query, delay = 300) {
  const { request } = useApi();
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 Проверяем, включена ли DaData через переменную окружения
  const isDadataEnabled = process.env.REACT_APP_USE_DADATA === 'true';

  useEffect(() => {
    // Если DaData отключена или запрос слишком короткий — ничего не делаем
    if (!isDadataEnabled || !query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const result = await request('/api/dadata/suggest', {
          method: 'POST',
          body: JSON.stringify({ query, count: 5 })
        });
        setSuggestions(result.suggestions || []);
      } catch (error) {
        console.error('❌ Ошибка DaData:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay, isDadataEnabled]);

  return { suggestions, isLoading, isEnabled: isDadataEnabled };
}