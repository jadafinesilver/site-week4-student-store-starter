import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import SubNavbar from "../SubNavbar/SubNavbar";
import Sidebar from "../Sidebar/Sidebar";
import Home from "../Home/Home";
import ProductDetail from "../ProductDetail/ProductDetail";
import NotFound from "../NotFound/NotFound";
import { removeFromCart, addToCart, getQuantityOfItemInCart, getTotalItemsInCart } from "../../utils/cart";
import "./App.css";
import { calculateOrderSubtotal, calculateTaxesAndFees, calculateTotal } from "../../utils/calculations";

function App() {
  // State variables
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", dorm_number: ""});
  const [products, setProducts] = useState([]); // products state
  const [cart, setCart] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

   // step 1 -> fetch products
  useEffect(() => {
    const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/products");
      const prods = data.map(p => ({ ...p, id: p.product_id })); // match products with id
      setProducts(prods);
    } catch (error) {
      console.error("error fetching products", error.message);
    }
  };
  fetchProducts(); //
}, []);


  // Toggles sidebar
  const toggleSidebar = () => setSidebarOpen((isOpen) => !isOpen);

  // Functions to change state (used for lifting state)
  const handleOnRemoveFromCart = (item) => setCart(removeFromCart(cart, item));
  const handleOnAddToCart = (item) => setCart(addToCart(cart, item));
  const handleGetItemQuantity = (item) => getQuantityOfItemInCart(cart, item);
  const handleGetTotalCartItems = () => getTotalItemsInCart(cart);

  const handleOnSearchInputChange = (event) => {
    setSearchInputValue(event.target.value);
  };

  // step 2 -> checkout 
  const handleOnCheckout = async () => {
  setIsCheckingOut(true);
  const cartItems = Object.entries(cart).map(([productId, quantity]) => {
    const product = products.find((p) => p.product_id === Number(productId));
    return {
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      quantity: quantity,
    };
  });
  if (!Object.keys(cart).length) {
    alert("empty cart");
    setIsCheckingOut(false);
    return;
  }
  if (!userInfo.name){
    alert("please enter your student id to checkout");
    setIsCheckingOut(false);
    return;
  }
  const subTotal = calculateOrderSubtotal(cartItems);
  const totalPrice = calculateTotal(subTotal); 
  try {
    const orderData = {
      customer_id : Number(userInfo.name) , 
      totalPrice : Number(totalPrice.toFixed(2)) ,
      status : "proccessing" ,
      orderItems: cartItems.map((item) => ({
  product_id: item.product_id,
  quantity: item.quantity,
  price: item.price,
})),
    };
    const res = await axios.post("http://localhost:3000/orders", orderData);
    setOrder(res.data);
  }
  catch(error) {
    console.error("error checking out", error)
  }
  alert("thank you for shopping with us");
  setIsCheckingOut(false);
  setCart({});
  setUserInfo({ name: "", dorm_number: "" }); // clear the field
};




  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar
          cart={cart}
          error={error}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          isOpen={sidebarOpen}
          products={products}
          toggleSidebar={toggleSidebar}
          isCheckingOut={isCheckingOut}
          addToCart={handleOnAddToCart}
          removeFromCart={handleOnRemoveFromCart}
          getQuantityOfItemInCart={handleGetItemQuantity}
          getTotalItemsInCart={handleGetTotalCartItems}
          handleOnCheckout={handleOnCheckout}
          order={order}
          setOrder={setOrder}
        />
        <main>
          <SubNavbar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchInputValue={searchInputValue}
            handleOnSearchInputChange={handleOnSearchInputChange}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  error={error}
                  products={products}
                  isFetching={isFetching}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  addToCart={handleOnAddToCart}
                  searchInputValue={searchInputValue}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            <Route
              path="/:productId"
              element={
                <ProductDetail
                  cart={cart}
                  error={error}
                  products={products}
                  addToCart={handleOnAddToCart}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            <Route
              path="*"
              element={
                <NotFound
                  error={error}
                  products={products}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
 