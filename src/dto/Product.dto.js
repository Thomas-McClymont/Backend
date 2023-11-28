export default class ProductDTO {
    static getProductInputFrom = (product) =>{
        return {
            name:product.name||'',
            price:product.price||'',
            image: product.image||''
        }
    }
}