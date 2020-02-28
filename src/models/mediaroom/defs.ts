import { Document } from 'mongoose'

export default interface IMediaroom {
    info: {
        id: number,
        roomId: string,
        portalId: number,

        createdAt: number
    }
    streamInfo: {
        nodeName: string,
        mediaHost: string,

        rtpIp: string,
        rtpPort: number
    }
}

export interface IStoredMediaroom extends IMediaroom, Document {}