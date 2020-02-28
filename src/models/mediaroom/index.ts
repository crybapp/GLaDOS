import StoredMediaroom from '../../schema/mediaroom.schema'
import IMediaroom from './defs';

export enum LoadBy {
    id = 'info.id',
    roomId = 'info.roomId',
    portalId = 'info.portalId'
}

export default class Mediaroom {
    public id: number;
    public roomId: string;
    public portalId: number;
    public createdAt: number;
    public nodeName: string;
    public mediaHost: string;
    public rtpIp: string;
    public rtpPort: Number;
    
    public load = (loadBy: LoadBy, loadArg: string | number) => new Promise<Mediaroom>(async (resolve, reject) => {
        let searchObj = `${loadBy}: ${loadArg}`

        this.tryLoad(JSON.parse(searchObj))
            .then((result) => resolve(result))
            .catch((error) => reject(error));
    });

    private tryLoad = (searchObj: any) => new Promise<Mediaroom>(async (resolve, reject) => {
        try {
            const doc = await StoredMediaroom.findOne(searchObj);
            if(!doc) throw new Error('Mediaroom not found');

            this.setup(doc);

            resolve(this);
        } catch(error) {
            reject(error)
        }
    });

    private setup = (json: IMediaroom) => {
        this.id = json.info.id;
        this.roomId = json.info.roomId;
        this.portalId = json.info.portalId;
        this.createdAt = json.info.createdAt;

        this.nodeName = json.streamInfo.nodeName;
        this.mediaHost = json.streamInfo.mediaHost;
        this.rtpIp = json.streamInfo.rtpIp;
        this.rtpPort = json.streamInfo.rtpPort;
    }
}