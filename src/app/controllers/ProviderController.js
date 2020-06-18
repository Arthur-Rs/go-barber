import UserModel from '../models/UserModel';
import FileModel from '../models/FileModel';

class ProviderController {
  async index(req, res) {
    const filter = {
      where: {
        provider: true,
      },
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: FileModel,
          as: 'avatar',
          attributes: ['id', 'url', 'name', 'path'],
        },
      ],
    };

    const data = await UserModel.findAll(filter).catch(() => {
      return res.status(500).json({ status: 'Error in database!' });
    });

    return res.json(data);
  }
}

export default new ProviderController();
