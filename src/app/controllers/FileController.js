import FileModel from '../models/FileModel';

class FileController {
  async store(req, res) {
    const { filename, originalname } = req.file;

    const data = { name: originalname, path: filename };

    FileModel.create(data).catch(() => {
      return res.status(500).json({ status: 'Error in database!' });
    });

    return res.json({ status: 'Successful Upload!' });
  }
}

export default new FileController();
