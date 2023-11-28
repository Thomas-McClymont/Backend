export default class ProductDTO {
    static getProductInputFrom = (product) =>{
        return {
            name:product.name||'',

            image: product.image||'',

        }
    }
}