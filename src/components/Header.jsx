import { Button } from "@maxhub/max-ui";
import { useCart } from "./CartContext";
const mx = window.WebApp;
const user = mx?.initDataUnsafe?.user;
const firstName = user?.first_name || 'Гость';
const Header = ({ onCartClick }) => {

  const { totalItems } = useCart();

  const onClose = () => {
    if (mx) mx.close();
  };

  return (
    <div className="header">
      <Button onClick={onClose}>Закрыть</Button>
      <span className="username">
        {mx?.initDataUnsafe?.user?.first_name || 'Гость'}
      </span>
      <Button onClick={onCartClick}>
        Корзина ({totalItems})
      </Button>
    </div>
  );
};

export default Header;