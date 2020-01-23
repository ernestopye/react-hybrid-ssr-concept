import React from "react";
import ReactDOM from "react-dom";
import { useProductContext } from "../util";

const priceElement = document.getElementById("product-price");

export function Price() {
    const { product } = useProductContext();

    if (!priceElement || !product.selected) {
        return null;
    }

    return ReactDOM.createPortal(
        <p style={{ fontSize: "2rem" }}>${product.selected.length.toFixed(2)}</p>,
        priceElement
    );
}
