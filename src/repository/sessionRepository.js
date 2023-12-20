import GenericRepository from "./genericRepository.js";

export default class SessionRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }
}