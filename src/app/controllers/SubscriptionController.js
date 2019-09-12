import { isPast } from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import User from '../models/User';

import Queue from '../../lib/Queue';

import InscriptionMail from '../jobs/InscriptionMail';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
  async index(req, res) {
    const meetups = await Subscription.findAll({
      attributes: ['id'],
      include: [
        {
          model: Meetup,
          as: 'meetup',
          attributes: { exclude: ['finished'] },
          where: { date: { [Op.gt]: new Date() } },
        },
        {
          model: User,
          as: 'user',
          attributes: [],
          where: { id: req.userId },
        },
      ],
      order: [['meetup', 'date', 'ASC']],
    });

    if (!meetups) {
      return res.status(404).json('Meetup not found');
    }

    return res.json(meetups);
  }

  async store(req, res) {
    /**
     * check if meetup exist
     */
    const { id: meetupId } = req.params;

    const meetup = await Meetup.findByPk(meetupId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

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
    const isIscription = await Subscription.findOne({
      where: { user_id: req.userId, meetupId },
    });
    if (isIscription) {
      return res.status(401).json({ error: 'Meetup already subscribed' });
    }

    const isOcuped = await Subscription.findOne({
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

    const subscription = await Subscription.create({
      meetupId,
      user_id: req.userId,
    });

    const user = await User.findByPk(req.userId);

    // Envio de email para o inscrito
    Queue.add(SubscriptionMail.key, {
      meetup,
      user,
    });

    // envio de email para o criador do meeetup
    Queue.add(InscriptionMail.key, {
      meetup,
      user,
    });

    return res.json(subscription);
  }

  async delete(req, res) {
    return res.json({ kronus: 'ok' });
  }
}

export default new SubscriptionController();
