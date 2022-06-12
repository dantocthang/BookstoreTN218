import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import formidable from 'formidable';
import fs from 'fs'



// Chuyển đổi svc -> json và ngược lại
import csv from 'csvtojson'
import { Parser } from 'json2csv'

import Course from '../models/Course.js'
import { multipleMongooseToObject} from '../../util/mongoose.js'
import {isValidImage} from '../../util/checkValidFile.js'
import UploadFile from '../models/UploadFile.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// [GET] /me/stored/courses 
class MeController {
  async storedCourses(req, res, next) {
    try {
      const deletedCount = await Course.countDocumentsDeleted()
      const courses = res.paginatedResult
      res.render('me/stored-courses', { courses: multipleMongooseToObject(courses.data), courseSibling: courses, deletedCount })
    }
    catch (err) {
      next()
    }
  }

  // [GET] /me/trash/courses
  trashCourses(req, res, next) {
    Course.findDeleted({})
      .then(courses => {
        res.render('me/trash-courses', { courses: multipleMongooseToObject(courses) })
      })
      .catch(next)
  }

  // [GET] /me/upload
  uploadForm(req, res, next) {
    return res.render('me/upload')
  }

  // [POST] /me/upload
  // async upload(req, res, next) {
  //   const uploadFolder = path.join(__dirname, "..", "..", "public", "files", req.user.username);
  //   console.log(uploadFolder)
  //   if (!fs.existsSync(uploadFolder)) {
  //     fs.mkdirSync(uploadFolder, { recursive: true });
  //   }
  //   const form = new formidable.IncomingForm({
  //     multiplesL: true,
  //     maxFileSize: 50 * 1024 * 1024,
  //     uploadDir: uploadFolder,
  //   });

  //   form.parse(req, async (err, fields, files) => {
  //     // console.log(fields);
  //     console.log(files);
  //     if (err) {
  //       console.log("Error parsing the files");
  //       return res.status(400).json({
  //         status: "Fail",
  //         message: "There was an error parsing the files",
  //         error: err,
  //       });
  //     }

  //     if (!files.myFile.length) {
  //       //Single file
  //       const file = files.myFile;
  //       // checks if the file is valid
  //       const isValid = isValidImage(file);
  //       // creates a valid name by removing spaces
  //       const fileName = file.originalFilename;
  //       if (!isValid) {
  //         // throes error if file isn't valid
  //         return res.status(400).json({
  //           status: "Fail",
  //           message: "The file type is not a valid type",
  //         });
  //       }
  //       try {
  //         // renames the file in the directory
  //         fs.renameSync(file.filepath, path.join(uploadFolder, fileName));
  //       } catch (error) {
  //         console.log(error);
  //       }

  //       try {
  //         // stores the fileName in the database
  //         const newFile = await UploadFile.create({
  //           name: `files/${req.user.username}/${fileName}`,
  //           userId: req.user._id
  //         });
  //         newFile.save()
  //         return res.status(200).json({
  //           status: "success",
  //           message: "File created successfully!!",
  //         });
  //       } catch (error) {
  //         res.json({
  //           error,
  //         });
  //       }
  //     } else {
  //       // Multiple files
  //     }
  //   });
  // }

  // [GET] /me/images
  async showImages(req, res, next) {
    const images = await UploadFile.find({ userId: req.user._id })
    return res.render('me/uploaded-images', { images: images })
  }

  // ơET /me/:id/add-to-cart
  addToCart(req, res, next) {
    var carts = req.session.cart || []
    const id = req.params.id
    let isAdded = false

    carts.forEach(item => {
      if (item.id == id) {
        item.count++
        isAdded = true
      }
    })

    if (!isAdded) {
      carts = [...carts, { id: id, count: 1 }]
    }
    req.session.cart = carts
    res.redirect('back')
  }

  // [GET] /me/cart-minimized (for Ajax call)
  async cartMinimized(req, res, next) {
    var cart = req.session.cart || []
    var detailCart = []
    if (cart != []) {
      for (let i = 0; i < cart.length; i++) {
        const course = await Course.findById(cart[i].id)
        detailCart.push({ id: course._id, name: course.name, image: course.image, count: cart[i].count })
      }
    }
    return res.json(detailCart)
  }


  // [GET] /me/readCsv
  async readCsvFile(req, res, next) {
    const uploadFolder = path.join(__dirname, "..", "..", "public", "files", req.user.username, 'Book1.csv');
    const jsonArray = await csv().fromFile(uploadFolder);
    res.json(jsonArray)
  }

  // [GET] /me/toCsv
  // async toCsv(req, res, next) {
  //   const uploadFolder = path.join(__dirname, "..", "..", "public", "files", req.user.username);
    
  //   const jsonArray = [
  //     {
  //       id: 1,
  //       name: 'Dan'
  //     },
  //     {
  //       id: 2,
  //       name: 'Thang'
  //     }
  //   ];

  //   const fields = ['id', 'name'];
  //   const opts = { fields };

  //   try {
  //     const parser = new Parser(opts);
  //     const csv = parser.parse(jsonArray);
  //     fs.writeFile(`${uploadFolder}/demo.csv`, csv, (err) => {
  //       if (err)
  //         console.log(err);
  //       else {
  //         console.log("File written successfully\n");
  //         console.log("The written has the following contents:");
  //         console.log(fs.readFileSync(`${uploadFolder}/demo.csv`, "utf8"));

  //         // Download
  //         const currentUrl = req.path
  //         res.redirect(`/files/${req.user.username}/demo.csv`)
  //       }
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }


  // }


}
const a = new MeController()

export default a