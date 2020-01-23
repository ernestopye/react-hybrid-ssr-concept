import React from "react";
import ReactDOM from "react-dom";
import { useProductContext } from "../util";

const availabilityElement = document.getElementById("product-availability");

export function Availability() {
    const {
        product: { selected, inStock }
    } = useProductContext();

    return ReactDOM.createPortal(
        selected ? inStock ? <p>In Stock</p> : <p>Out of Stock</p> : <em>Make a selection to see availability.</em>,
        availabilityElement
    );
}
