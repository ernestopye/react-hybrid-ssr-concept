import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import { Button, Form, Loader } from "semantic-ui-react";
import { fetchChildProductData } from "./util";

const __initial_state__ = window.__initial_state__ || null;
const ProductContext = React.createContext(null);

function App() {
    const [product, setProduct] = useState(__initial_state__);
    const [loading, setLoading] = useState(false);

    if (!__initial_state__) {
        // would only happen if something went wrong with server rendering
        return "Unable to load product details.";
    }

    return (
        <ProductContext.Provider value={{ product, setProduct, loading, setLoading }}>
            {/* order doesn't matter here as they all render to portals */}
            <Images />
            <AddToCart />
            <Selections />
            <Price />
            <Availability />
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
    const { product, loading } = useProductContext();

    if (!addToCartElement) {
        return null;
    }

    return ReactDOM.createPortal(
        <Button primary disabled={!product.selected || loading || !product.inStock}>
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
const descriptionElement = document.getElementById("product-description");

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
    const { product, setProduct, setLoading, loading } = useProductContext();
    const [size, setSize] = useState(null);
    const [color, setColor] = useState(null);

    useEffect(() => {
        const titleElement = document.getElementById("product-title");

        let title = product.name;

        if (!color || !size) {
            return;
        }

        (async () => {
            setLoading(true);

            // load additional data that wasn't rendered by the server. this is something we
            // do frequently to avoid rendering out ALL product data from the server for
            // many different reasons.
            const { description, inStock } = await fetchChildProductData({
                id: product.id,
                size,
                color
            });

            if (titleElement) {
                title += ` (${size}, ${color})`;
                titleElement.innerText = title;

                // we can serve the child content in separate url's too.
                // this way we can simulate what those pages will look like.
                window.history.replaceState("", title, `/${color}-${size}-shirt`);
                document.title = title;
            }

            setLoading(false);

            setProduct({
                ...product,
                selected: color && size ? color + "-" + size : null,
                color,
                description,
                inStock
            });

            // update ssr'd description tag
            descriptionElement.innerText = description;
        })();

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

            {loading ? <br /> : null}
            <Loader active={loading} inline />
        </>,
        selectionsElement
    );
}

const availabilityElement = document.getElementById("product-availability");

function Availability() {
    const {
        product: { selected, inStock }
    } = useProductContext();

    return ReactDOM.createPortal(
        selected ? inStock ? <p>In Stock</p> : <p>Out of Stock</p> : <em>Make a selection to see availability.</em>,
        availabilityElement
    );
}

export default App;
