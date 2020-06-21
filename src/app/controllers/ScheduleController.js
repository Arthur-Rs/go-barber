import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import AppointmentsModel from '../models/AppointmentsModel';
import UserModel from '../models/UserModel';
import FileModel from '../models/FileModel';

class ScheduleController {
  async index(req, res) {
    const { date } = req.query;
    const { userId } = req;
    const parsedDate = parseISO(date);

    const filter = {
      where: {
        provider_id: userId,
        canceled_at: null,
        date: { [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)] },
      },
      order: ['date'],
      attributes: ['id', 'date'],
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: FileModel,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    };

    const data = await AppointmentsModel.findAll(filter);

    return res.json(data);
  }
}
export default new ScheduleController();
