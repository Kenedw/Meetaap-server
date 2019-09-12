import Meetup from '../models/Meetup';
import File from '../models/File';

class OrganizationController {
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
      order: [['date', 'ASC']],
    });

    if (!meetups) {
      return res.status(404).json('Yours meetups not founds');
    }

    return res.json(meetups);
  }
}

export default new OrganizationController();
