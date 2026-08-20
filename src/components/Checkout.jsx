import { Button, Input } from "@maxhub/max-ui";
import { useState } from "react";
import { useCart } from "./CartContext";

const Checkout = ({ onBack }) => {
  const { cart, totalPrice } = useCart();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    const orderData = {
      items: cart,
      total: totalPrice,
      address,
      phone,
      user: window.WebApp?.initDataUnsafe?.user
    };
    // Отправка данных в бота
    if (window.WebApp) {
      window.WebApp.sendData(JSON.stringify({ action: 'order', data: orderData }));
      window.WebApp.close(); // Закрыть после отправки (опционально)
    } else {
      console.log('Order data:', orderData);
    }
  };

  return (
    <div className="checkout">
      <h2>Оформление заказа</h2>
      <Input
        placeholder="Адрес доставки"
        value={address}
        onChange={e => setAddress(e.target.value)}
      />
      <Input
        placeholder="Телефон"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />
      <div>Сумма: {totalPrice} ₽</div>
      <Button onClick={handleSubmit}>Подтвердить заказ</Button>
      <Button onClick={onBack}>Назад</Button>
    </div>
  );
};

export default Checkout;