import path from 'path'
import fs from 'fs'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import csv from 'csvtojson'

import UploadFile from '../app/models/UploadFile.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


function addDataFromCsv(model) {
  return async (req, res, next) => {
    const fileName = res.locals.fileName
    const uploadFolder = path.join(__dirname, "..", "public", "files", req.user.username, fileName);
    const jsonArray = await csv().fromFile(uploadFolder);

    try {
      console.log(jsonArray)
      jsonArray.forEach(item => {
        item.image = `https://img.youtube.com/vi/${item.videoId}/sddefault.jpg`
        const course = new model(item)
        course.save()
          .then(() => res.redirect('/me/stored/courses'))
          .catch(next)
      })
    }
    catch (err) {
      res.json({ err: 'Khong dung dinh dang' })
    }
    try {
      fs.unlinkSync(uploadFolder);
      await UploadFile.deleteOne({ name: `files/${req.user.username}/${fileName}` })
      console.log('file deleted')
    } catch (err) {
      console.error(err)
    }
  }
}

export default addDataFromCsv