import { Router, RtpCapabilities } from 'mediasoup/lib/types';
import WorkerManager from './workerManager';

export default class RouterManager {
    private workerManager: WorkerManager;
    private routerMap: Map<string, Router>;

    constructor(workerManager?: WorkerManager) {
        if(workerManager) {
            this.workerManager = workerManager;
        } else {
            this.workerManager = new WorkerManager();
        }
        
        this.routerMap = new Map<string, Router>();
    }

    public createNewRouter = (roomId: string) => new Promise<Router>(async (resolve) => {
        const recWorker = await this.workerManager.getReccomendedWorker();
        const router = await recWorker.mediasoupWorker.createRouter();
        this.routerMap.set(roomId, router);

        this.createNewRTPTransport(router);
    });

    private createNewRTPTransport = (router: Router) => new Promise(async (resolve, reject) => {
        router.createPlainRtpTransport({
            listenIp: process.env.MEDIASOUP_LISTEN_ADDR,
            comedia: true
        }); 

    });

    public getRouterByRoomId = (roomId: string): Router => {
        return this.routerMap.get(roomId);
    }
}