import * as Yup from 'yup';
import { parseISO, addHours, isPast } from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
      limit: 10,
      offset: (page - 1) * 10,
      attributes: [
        'id',
        'title',
        'description',
        'localization',
        'date',
        'banner_id',
        'finished',
      ],
      include: [{ model: File, as: 'banner', attributes: ['path', 'url'] }],
    });

    if (!meetups) {
      return res.status(404).json('Yours meetups not founds');
    }

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      localization: Yup.string().required(),
      date: Yup.date().required(),
      image_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { date } = req.body;
    const createDate = parseISO(date);

    const existMeetup = await Meetup.findOne({
      where: {
        user_id: req.userId,
        date: { [Op.between]: [createDate, addHours(createDate, 1)] },
      },
    });

    if (existMeetup) {
      return res
        .status(400)
        .json({ error: 'Meetup with this date already created' });
    }

    if (isPast(createDate)) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    req.body.user_id = req.userId;

    const meetup = await Meetup.create(req.body);

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      meetup_id: Yup.number().required(),
      title: Yup.string(),
      description: Yup.string(),
      localization: Yup.string(),
      date: Yup.date(),
      image_id: Yup.number(),
      user_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { date, meetup_id } = req.body;

    if (date && isPast(parseISO(date))) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    let meetup = await Meetup.findByPk(meetup_id);

    if (!meetup) {
      return res.status(404).json({ error: "Meetup does't found" });
    }

    if (isPast(meetup.date)) {
      return res.status(400).json({ error: 'Meetup is already over' });
    }

    meetup = await meetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const { id: meetup_id } = req.params;

    if (!meetup_id) {
      return res.status(400).json('Param ID not found');
    }

    const meetup = await Meetup.findByPk(meetup_id);

    if (!meetup) {
      return res.status(404).json('Meetup not found');
    }

    await meetup.destroy();

    return res.json({ success: `Meetup ${meetup_id} has been deleted` });
  }
}

export default new MeetupController();
