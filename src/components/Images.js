import React from "react";
import ReactDOM from "react-dom";
import { useProductContext } from "../util";

const imagesElement = document.getElementById("product-images");

export function Images() {
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
