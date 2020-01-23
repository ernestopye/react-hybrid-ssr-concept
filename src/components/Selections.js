import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useProductContext, fetchChildProductData, COLORS, SIZES } from "../util";
import { Form, Loader } from "semantic-ui-react";

const selectionsElement = document.getElementById("product-selections");
const descriptionElement = document.getElementById("product-description");

export function Selections() {
    const { product, setProduct, setLoading, loading } = useProductContext();
    const [size, setSize] = useState(null);
    const [color, setColor] = useState(null);

    useEffect(() => {
        const titleElement = document.getElementById("product-title");

        let title = product.name;

        // update the product image even if the size hasn't been selected
        if (color) {
            setProduct({
                ...product,
                color
            });
        }

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
