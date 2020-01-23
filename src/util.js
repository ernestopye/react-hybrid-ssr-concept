import React, { useContext } from "react";

export const ProductContext = React.createContext(null);
export function useProductContext() {
    const context = useContext(ProductContext);

    if (!context) {
        console.error(
            "Unable to find product context. This component must be nested under <ProductContext.Provider />."
        );
        return null;
    }

    return context;
}

export const COLORS = [
    { key: "r", text: "Red", value: "red" },
    { key: "g", text: "Green", value: "green" },
    { key: "b", text: "Blue", value: "blue" }
];

export const SIZES = [
    { key: "s", text: "Small", value: "small" },
    { key: "m", text: "Medium", value: "medium" },
    { key: "l", text: "Large", value: "large" }
];

// fake fetch. pretend this is loading additional data from some backend service
export function fetchChildProductData({ color, size }) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                description: `This is the description for the ${size}, ${color} shirt. ${color
                    .substring(0, 1)
                    .toString()
                    .toUpperCase() +
                    color.substring(
                        1
                    )} is my favorite color too! Also, we guarantee that size will totally fit you. Probably. Except when it doesn't. We don't make the rules.`,
                inStock: color !== "green"
            });
        }, 1000);
    });
}
