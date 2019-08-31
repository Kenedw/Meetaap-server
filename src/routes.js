import { Router } from 'express';

import userController from './app/controllers/userController';
import sessionController from './app/controllers/sessionController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.post('/sessions', sessionController.store);
routes.post('/users', userController.store);

routes.use(authMiddleware);

routes.put('/users', userController.update);

export default routes;
