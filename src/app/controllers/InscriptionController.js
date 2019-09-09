import * as Yup from 'yup';
import { isPast } from 'date-fns';
import Meetup from '../models/Meetup';
import Inscription from '../models/Inscription';

class InscriptionController {
  async index(req, res) {
    return res.json({ kronus: 'ok' });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      meetup_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /**
     * check if meetup exist
     */
    const { meetup_id } = req.body;

    const meetup = await Meetup.findByPk(meetup_id);

    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found' });
    }

    /**
     * check if meetup ended
     */
    if (isPast(meetup.date)) {
      return res.status(400).json({ error: 'Meetup already over' });
    }

    /**
     * check if already subscribed
     */
    const isIscription = await Inscription.findOne({
      where: { user_id: req.userId, meetup_id },
    });
    if (isIscription) {
      return res.status(401).json({ error: 'Meetup already subscribed' });
    }

    const isOcuped = await Inscription.findOne({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          attributes: ['id', 'date'],
          where: { date: meetup.date },
        },
      ],
    });
    if (isOcuped) {
      return res
        .status(401)
        .json({ error: 'your has other meetup in same date' });
    }

    const inscription = await Inscription.create({
      meetup_id,
      user_id: req.userId,
    });

    return res.json(inscription);
  }

  async update(req, res) {
    return res.json({ kronus: 'ok' });
  }

  async delete(req, res) {
    return res.json({ kronus: 'ok' });
  }
}

export default new InscriptionController();
