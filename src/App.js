import { useEffect } from 'react';
import './App.css';

const mx=window.WebApp;
if (initData && initData.user) {
    console.log('ID пользователя:', mx.initDataUnsafe.initData.user.id);
    console.log('Имя:', mx.initDataUnsafe.initData.user.first_name);
    console.log('Язык:', mx.initDataUnsafe.initData.user.language_code);
    console.log('Тип чата:', mx.initDataUnsafe.initData.chat?.type);
    
    // Параметр, переданный через диплинк (например, ?startapp=someData)
    console.log('Параметр запуска:', mx.initDataUnsafe.initData.start_param);
}

function App() {
  useEffect(()=>{
    mx.ready();
  }, [])
  const onClose = () =>{
    mx.close();
  }
  return (
    <div className="App">
      work
      <button onClick={onClose}>Закрыть</button>
    </div>
  );
}

export default App;
