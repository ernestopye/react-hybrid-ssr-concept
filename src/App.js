import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import { Button, Form, Rating } from "semantic-ui-react";

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
    <Button primary disabled={!product.selected}>
      Add to Cart
    </Button>,
    addToCartElement
  );
}

const imagesElement = document.getElementById("product-images");

function Images() {
  const {
    product: { color }
  } = useProductContext();

  if (!imagesElement) {
    return null;
  }

  return ReactDOM.createPortal(
    <img src={color ? `${color}.png` : "red.png"} alt="shirt" width={200} />,
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
    <p style={{ fontSize: "2rem" }}>${product.selected.length.toFixed(2)}</p>,
    priceElement
  );
}

const selectionsElement = document.getElementById("product-selections");
const COLORS = [
  { key: "r", text: "Red", value: "red" },
  { key: "g", text: "Green", value: "green" },
  { key: "b", text: "Blue", value: "blue" }
];

const SIZES = [
  { key: "s", text: "Small", value: "small" },
  { key: "m", text: "Medium", value: "medium" },
  { key: "l", text: "Large", value: "large" }
];

function Selections() {
  const { product, setProduct } = useProductContext();
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);

  useEffect(() => {
    const titleElement = document.getElementById("product-title");

    let title = product.name;

    setProduct({
      ...product,
      selected: color && size ? color + "-" + size : null,
      color
    });

    if (titleElement && color && size) {
      title += ` (${size}, ${color})`;
      titleElement.innerText = title;

      window.history.replaceState("", title, `/${color}-${size}-shirt`);
      document.title = title;

      // TODO: fake fetch, load description, update dom
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, size]);

  if (!selectionsElement) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      <Form.Select
        fluid
        value={color}
        onChange={(_, { value }) => setColor(value)}
        options={COLORS}
        label="Color:"
        placeholder="-- select --"
      />
      <br />
      <Form.Select
        fluid
        value={size}
        onChange={(_, { value }) => {
          setSize(value);
        }}
        options={SIZES}
        label="Size:"
        placeholder="-- select --"
      />
    </>,
    selectionsElement
  );
}

export default App;
