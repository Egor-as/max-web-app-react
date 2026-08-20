import { Button } from "@maxhub/max-ui";
import { useCart } from "./CartContext";

const Header = ({ onCartClick }) => {
  const mx = window.WebApp;
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