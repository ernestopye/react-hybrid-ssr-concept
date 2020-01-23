import React from "react";
import ReactDOM from "react-dom";
import { useProductContext } from "../util";
import { Button } from "semantic-ui-react";

const addToCartElement = document.getElementById("product-add-to-cart");

export function AddToCart() {
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
