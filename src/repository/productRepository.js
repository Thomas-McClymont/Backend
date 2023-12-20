import GenericRepository from "./genericRepository.js";

export default class ProductRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }
}