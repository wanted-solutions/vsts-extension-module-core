export default abstract class BaseRepository {
    private readonly manager: any;
    constructor(manager: any) {
        this.manager = manager;
    }
}