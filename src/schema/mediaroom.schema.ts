import { model, Schema } from 'mongoose'
import { IStoredMediaroom } from '../models/mediaroom/defs'

const ModelSchema = new Schema({
    info: {
        id: Number,
        roomId: String,
        portalId: Number,

        createdAt: Number
    },
    streamInfo: {
        nodeName: String,
        mediaHost: String,

        rtpIp: String,
        rtpPort: Number
    }
})

const StoredMediaroom = model<IStoredMediaroom>('Mediaroom', ModelSchema)
export default StoredMediaroom