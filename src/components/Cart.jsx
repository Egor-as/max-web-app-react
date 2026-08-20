import { Button } from "@maxhub/max-ui";
import { useCart } from "./CartContext";

const Cart = ({ onCheckout }) => {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (cart.length === 0) {
    return <div>Корзина пуста</div>;
  }

  return (
    <div className="cart">
      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <span>{item.name}</span>
          <span>{item.price} ₽</span>
          <div>
            <Button onClick={() => updateQuantity(item.id, -1)}>-</Button>
            <span>{item.quantity}</span>
            <Button onClick={() => updateQuantity(item.id, 1)}>+</Button>
          </div>
          <Button onClick={() => removeFromCart(item.id)}>Удалить</Button>
        </div>
      ))}
      <div className="total">Итого: {totalPrice} ₽</div>
      <Button onClick={onCheckout}>Оформить заказ</Button>
    </div>
  );
};

export default Cart;