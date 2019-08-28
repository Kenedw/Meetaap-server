import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => {
  res.json({ ok: 'Aplication simple' });
});

export default routes;
