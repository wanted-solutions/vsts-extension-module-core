export default abstract class BaseModel {
    protected _services(): any[] {
        return [];
    };

    private __SERVICES__: any = {};

    constructor() {
        this._services().forEach(
            service => this.__SERVICES__[service.constructor.name] = service
        );      
    }
}