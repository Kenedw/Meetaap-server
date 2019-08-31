import { Router } from 'express';

import userController from './app/controllers/userController';

const routes = new Router();

routes.get('/', (req, res) => {
  res.json({ ok: 'Aplication simple' });
});

routes.post('/users', userController.store);
routes.put('/users', userController.update);

export default routes;
