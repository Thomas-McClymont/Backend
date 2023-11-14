export const generateProductErrorInfo = (product) => {
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
        Lista de propiedades requeridas:
            * product_name: type String, recibido: ${product.product_name}
    `;
};

export const getProductByIdErrorInfo = (productId) => {
    return `Una o mas propiedades fueron enviadas de manera incompleta o non validas.
            Lista de propiedades requeridas:
                * productId: type String, recibido: ${productId}
    `;
}