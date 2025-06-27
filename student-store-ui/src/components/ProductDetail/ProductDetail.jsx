import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NotFound from "../NotFound/NotFound";
import { formatPrice } from "../../utils/format";
import "./ProductDetail.css";

function ProductDetail({ addToCart, removeFromCart, getQuantityOfItemInCart }) {
  
  const { productId } = useParams(); //changed because i called it something different
  const [product, setProduct] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  // step 3 -> fetch specfic product
  useEffect (() => {
    setIsFetching(true);
    setError(null);
    axios.get(`http://localhost:3000/products/${productId}`)
  .then(response => {
    const prod = response.data;
    prod.id = prod.product_id;
    setProduct(prod);
  })
  .catch(error => {
    console.error("error fetching product", error);
    setError(error);
  })
  setIsFetching(false);
  }, [productId]); 

  if (error) {
    return <NotFound />;
  }

  if (isFetching || !product) {
    return <h1>Loading...</h1>;
  }

  const quantity = getQuantityOfItemInCart(product);

  const handleAddToCart = () => {
    if (product.id) {
      addToCart(product)
    }
  };

  const handleRemoveFromCart = () => {
    if (product.id) {
      removeFromCart(product);
    }
  };

  return (
    <div className="ProductDetail">
      <div className="product-card">
        <div className="media">
          <img src={product.image_url || "/placeholder.png"} alt={product.name} />
        </div>
        <div className="product-info">
          <p className="product-name">{product.name}</p>
          <p className="product-price">{formatPrice(product.price)}</p>
          <p className="description">{product.description}</p>
          <div className="actions">
            <button onClick={handleAddToCart}>Add to Cart</button>
            {quantity > 0 && <button onClick={handleRemoveFromCart}>Remove from Cart</button>}
            {quantity > 0 && <span className="quantity">Quantity: {quantity}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}


export default ProductDetail;