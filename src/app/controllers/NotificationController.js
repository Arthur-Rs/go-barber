import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    const { limit = 15 } = req.query;
    const data = await Notification.find({ user: req.userId })
      .sort('createdAt')
      .limit(limit);

    return res.json(data);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
