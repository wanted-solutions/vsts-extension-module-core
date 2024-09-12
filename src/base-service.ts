import * as SDK from "azure-devops-extension-sdk";

import { CommonServiceIds, getClient } from "azure-devops-extension-api";
import { RestClientFactory } from "azure-devops-extension-api/Common/Client";

export interface IExtensionService {
    _client: any;
    _repository: any;
    _service: any;
}

export interface IExtensionServiceConstructor {
    clients?: RestClientFactory<unknown>[];
    repositories?: any[];
    services?: CommonServiceIds[];
}

// TODO consider implement DI contianer to load services as singletons
export default abstract class BaseService implements IExtensionService {    
    // TODO add types
    private readonly __SDK_CLIENTS__: any = {};
    private readonly __SDK_REPOSITORIES__: any = {};
    private readonly __SDK_SERVICES__: any = {};
    private __SDK_EXTENSION_DATA_MANAGER__: any;
    
    constructor(services: IExtensionServiceConstructor) {
        // Intialize clients, repositories and services
        this.initializeClients(services.clients || []);
        this.initializeRepositories(services.repositories || []);
        this.initializeServices(services.services || []);
    }

    get _client() {
        return this.__SDK_CLIENTS__;
    }

    get _repository() {
        return this.__SDK_REPOSITORIES__;
    }

    get _service() {
        return this.__SDK_SERVICES__;
    }

    private initializeClients(clients: RestClientFactory<unknown>[]) {
        clients.forEach(this.initializeClient.bind(this));
    }

    private initializeClient(client: RestClientFactory<unknown>) {
        this.__SDK_CLIENTS__[client.name] = getClient(client);
    }

    private initializeRepositories(repositories: any[]) {
        repositories.forEach(this.initializeRepository.bind(this));
    }

    private async initializeRepository(repository: any) {
        if (!this.__SDK_SERVICES__[CommonServiceIds.ExtensionDataService]) {
            await this.initializeService(CommonServiceIds.ExtensionDataService);
        }

        if (!this.__SDK_EXTENSION_DATA_MANAGER__) {
            this.__SDK_EXTENSION_DATA_MANAGER__ = await this.__SDK_SERVICES__[
                CommonServiceIds.ExtensionDataService
            ].getExtensionDataManager(
                SDK.getExtensionContext().id, 
                await SDK.getAccessToken()
            )
        }

        console.log("Repository: ", repository)
        
        this.__SDK_REPOSITORIES__[repository.name] = new repository(
            this.__SDK_EXTENSION_DATA_MANAGER__
        );
    }

    private initializeServices(services: CommonServiceIds[]) {
        services.forEach(this.initializeService.bind(this));
    }

    private async initializeService(service: string) {
        this.__SDK_SERVICES__[service] = await SDK.getService(service);
    }
}