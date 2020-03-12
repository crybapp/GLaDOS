import RouterManager from '../mediasoup/routerManager';
import RouterInfo from '../mediasoup/routerInfo';

class MediasoupService {
    public routerManager: RouterManager;

    constructor() {
        this.routerManager = new RouterManager();
    }

    /**
     * getRouterInfo returns a struct of RouterInfo object 
     */
    public getRouterInfo(roomId: string): RouterInfo {
        const router = this.routerManager.getRouterByRoomId(roomId);
        if (!router) {
            return null
        }
    }
}

const globalService = new MediasoupService();

export default globalService;