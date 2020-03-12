import { Application } from 'express'
import routerController from '../controllers/router.controller'

export default (app: Application) => {
    app.use('/router', routerController);
}