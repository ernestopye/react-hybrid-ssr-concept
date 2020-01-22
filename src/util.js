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
