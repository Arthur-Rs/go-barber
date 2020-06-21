import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import AppointmentsModel from '../models/AppointmentsModel';
import UserModel from '../models/UserModel';
import FileModel from '../models/FileModel';

class AppointmentsController {
  async index(req, res) {
    const { page = 1, limit = 15 } = req.query;

    const filter = {
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      limit,
      offset: (page - 1) * limit,
      attributes: ['id', 'date'],
      order: ['date'],
      include: [
        {
          model: UserModel,
          as: 'provider',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: FileModel,
              as: 'avatar',
              attributes: ['id', 'url', 'path'],
            },
          ],
        },
      ],
    };
    const data = await AppointmentsModel.findAll(filter).catch(() => {
      return res.status(500).json({ status: 'Error in database!' });
    });

    return res.json(data);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().positive().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ status: 'Icomplete body!' });
    }

    const { provider_id, date } = req.body;

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ status: 'Ivalid Date!' });
    }

    const filter = {
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    };

    const checkDates = await AppointmentsModel.findOne(filter).catch(() => {
      return res.status(500).json({ status: 'Error in database!' });
    });

    if (checkDates) {
      return res.status(400).json({ status: 'Full Date' });
    }

    const data = {
      date: hourStart,
      provider_id,
      user_id: req.userId,
    };

    await AppointmentsModel.create(data).catch(() => {
      return res.status(500).json({ status: 'Error in database!' });
    });

    return res.json({ status: 'Success!' });
  }
}

export default new AppointmentsController();
