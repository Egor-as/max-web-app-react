import { useEffect } from 'react';
import './App.css';
const initData = window.WebApp.initDataUnsafe;
const mx=window.WebApp;
if (initData && initData.user) {
    console.log('ID пользователя:', initData.user.id);
    console.log('Имя:', initData.user.first_name);
    console.log('Язык:', initData.user.language_code);
    console.log('Тип чата:', initData.chat?.type);
    
    // Параметр, переданный через диплинк (например, ?startapp=someData)
    console.log('Параметр запуска:', initData.start_param);
}

function App() {
  useEffect(()=>{
    mx.ready();
  }, [])
  
  return (
    <div className="App">
      <button onClick={onClose}>Закрыть</button>
    </div>
  );
}

export default App;
