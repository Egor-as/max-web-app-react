import { products } from "../data/products";
import ProductCard from "./ProductCard";

const ProductList = () => {
  return (
    <div className="product-list">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};