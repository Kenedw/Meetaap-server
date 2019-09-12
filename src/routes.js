import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middleware/auth';
import multerConfig from './config/multer';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';
import OrganizationController from './app/controllers/OrganizationController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/meetups/organizations', OrganizationController.index);

routes.get('/meetups', MeetupController.index);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups', MeetupController.update);
routes.delete('/meetups/:id', MeetupController.delete);

routes.get('/meetups/subscriptions', SubscriptionController.index);
routes.post('/meetups/:id/subscriptions', SubscriptionController.store);

routes.put('/users', UserController.update);

export default routes;
