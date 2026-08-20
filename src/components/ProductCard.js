import { Button, Card } from "@maxhub/max-ui";
import { useCart } from "./CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Card className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price} ₽</p>
      <Button onClick={() => addToCart(product)}>В корзину</Button>
    </Card>
  );
};

export default ProductCard;