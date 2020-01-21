import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import "./App.css";

const __initial_state__ = window.__initial_state__ || null;
const ProductContext = React.createContext(null);

function App() {
  const [product, setProduct] = useState(__initial_state__);

  if (!__initial_state__) {
    // would only happen if something went wrong with server rendering
    return "Unable to load product details.";
  }

  return (
    <ProductContext.Provider value={{ product, setProduct }}>
      {/* order doesn't matter here as they all render to portals */}
      <Images />
      <AddToCart />
      <Selections />
      <Price />
    </ProductContext.Provider>
  );
}

function useProductContext() {
  const context = useContext(ProductContext);

  if (!context) {
    console.error(
      "Unable to find product context. This component must be nested under <ProductContext.Provider />."
    );
    return null;
  }

  return context;
}

const addToCartElement = document.getElementById("product-add-to-cart");

function AddToCart() {
  const { product } = useProductContext();

  if (!addToCartElement) {
    return null;
  }

  return ReactDOM.createPortal(
    <button type="button" disabled={!product.selected}>
      Add to Cart
    </button>,
    addToCartElement
  );
}

const imagesElement = document.getElementById("product-images");

function Images() {
  if (!imagesElement) {
    return null;
  }

  return ReactDOM.createPortal(
    <img src="shirt.png" alt="shirt" width={300} />,
    imagesElement
  );
}

const priceElement = document.getElementById("product-price");

function Price() {
  const { product } = useProductContext();

  if (!priceElement || !product.selected) {
    return null;
  }

  return ReactDOM.createPortal(
    <span>${product.selected.length.toFixed(2)}</span>,
    priceElement
  );
}

const selectionsElement = document.getElementById("product-selections");

function Selections() {
  const { product, setProduct } = useProductContext();
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);

  useEffect(() => {
    const titleElement = document.getElementById("product-title");

    let title = product.name;

    if (color && size) {
      title += ` (${size}, ${color})`;

      setProduct({ ...product, selected: size + "-" + color });
    } else {
      setProduct({ ...product, selected: null });
    }

    titleElement.innerText = title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, size]);

  if (!selectionsElement) {
    return null;
  }

  return ReactDOM.createPortal(
    <div>
      <label for="size">Size: </label>
      <select id="size" value={size} onChange={e => setSize(e.target.value)}>
        <option value="">-- select --</option>
        <option>Small</option>
        <option>Medium</option>
        <option>Large</option>
      </select>
      <br />
      <label for="color">Color: </label>
      <select id="color" value={color} onChange={e => setColor(e.target.value)}>
        <option value="">-- select --</option>
        <option>Red</option>
        <option>Green</option>
        <option>Blue</option>
      </select>
    </div>,
    selectionsElement
  );
}

export default App;
