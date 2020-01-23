import React, { useState } from "react";
import { ProductContext } from "./util";
import { AddToCart } from "./components/AddToCart";
import { Images } from "./components/Images";
import { Price } from "./components/Price";
import { Selections } from "./components/Selections";
import { Availability } from "./components/Availability";

const __initial_state__ = window.__initial_state__ || null;

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

export default App;
