export default class ProductDTO {
    static getProductInputFrom = (product) =>{
        return {
            product_name:product.product_name||'',
            price:product.price||'',
            category:product.category||'',
            subcategory:product.subcategory||'',
            added:product.added||'',
            color:product.color||'',
            size:product.size||''
        }
    }
}