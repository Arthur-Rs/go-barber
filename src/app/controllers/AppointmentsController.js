import * as Yup from 'yup';

import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import locale from 'date-fns/locale/pt-BR';

import AppointmentsModel from '../models/AppointmentsModel';
import UserModel from '../models/UserModel';
import FileModel from '../models/FileModel';

import Notification from '../schemas/Notification';

import CancellationEmail from '../jobs/CancellationEmail';
import Queue from '../../lib/queue';

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
    // ==== Validation ==== \\
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

    if (provider_id === req.userId) {
      return res.status(400).json({ status: 'Invalid Provider' });
    }

    // ==== Send Notification for Provider ==== \\

    const { userId } = req;

    const UserData = await UserModel.findByPk(userId).catch(() => {
      return res.status(500).json({ status: 'Error in database!' });
    });

    const { name } = UserData;

    const formattedDate = format(hourStart, "dd 'de' MMMM', ás' H:mm'h.'", {
      locale,
    });

    await Notification.create({
      content: `${name}, fez um agendamento para o dia ${formattedDate}`,
      user: provider_id,
    });

    // ==== Add in Database ==== \\
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

  async delete(req, res) {
    const appoint = await AppointmentsModel.findByPk(req.params.id, {
      include: [
        {
          model: UserModel,
          as: 'provider',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: UserModel,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    }).catch(() => {
      return res.status(500).json({ status: 'Error in database!' });
    });

    if (req.userId !== appoint.user_id) {
      return res.status(400).json({ status: "You Don't Have Permission!" });
    }

    const dateLimit = subHours(appoint.date, 2);

    if (isBefore(dateLimit, new Date())) {
      return res.status(400).json({ status: 'You can only cancel' });
    }

    if (appoint.canceled_at !== null) {
      return res.status(400).json({ status: 'You can only cancel' });
    }

    appoint.canceled_at = new Date();

    await Queue.Add(CancellationEmail.key, { appoint });

    await appoint.save();

    return res.json({ status: 'Appointment canceled with success!' });
  }
}

export default new AppointmentsController();
