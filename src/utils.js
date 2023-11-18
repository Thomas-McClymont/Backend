import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { faker } from '@faker-js/faker';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Idioma de los datos
//faker.locale = 'es';

export const generateUser = () => {
    let products = [];
    for (let i = 0; i < 100; i++) {
        products.push(generateProduct());
    }
    return products;
};

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        id: faker.database.mongodbObjectId()
        /*price: faker.commerce.price(),
        stock: faker.random.numeric(1),
        id: faker.database.mongodbObjectId(),
        image: faker.image.image()*/
    }
};

export default __dirname;