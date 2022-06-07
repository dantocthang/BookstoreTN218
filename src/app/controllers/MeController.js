import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import formidable from 'formidable';
import fs from 'fs'

import Course from '../models/Course.js'
import { multipleMongooseToObject, mongooseToObject } from '../../util/mongoose.js'
import isFileValid from '../../util/checkValidFile.js'
import UploadFile from '../models/UploadFile.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// [GET] /me/stored/courses 
class MeController {
    async storedCourses(req, res, next) {

        try {

            const deletedCount = await Course.countDocumentsDeleted()
            const courses = res.paginatedResult
            // res.json(courses)
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
        console.log('>>>' + req.user)
        return res.render('me/upload')
    }


    // [POST] /me/upload
    async upload(req, res, next) {
        const uploadFolder = path.join(__dirname, "..","..", "public", "files");
        const form = new formidable.IncomingForm({
            multiplesL: true,
            maxFileSize: 50 * 1024 * 1024,
            uploadDir: uploadFolder,
        }); 

        form.parse(req, async (err, fields, files) => {
            // console.log(fields);
            console.log(files);
            if (err) {
                console.log("Error parsing the files");
                return res.status(400).json({
                    status: "Fail",
                    message: "There was an error parsing the files",
                    error: err,
                });
            }

            if (!files.myFile.length) {
                //Single file
              
                const file = files.myFile;
              
                // checks if the file is valid
                const isValid = isFileValid(file);
              
                // creates a valid name by removing spaces
                const fileName = encodeURIComponent(file.originalFilename);
              
                if (!isValid) {
                  // throes error if file isn't valid
                  return res.status(400).json({
                    status: "Fail",
                    message: "The file type is not a valid type",
                  });
                }
                try {
                  // renames the file in the directory
                  fs.renameSync(file.filepath, path.join(uploadFolder, fileName));
                } catch (error) {
                  console.log(error);
                }
              
                try {
                  // stores the fileName in the database
                  const newFile = await UploadFile.create({
                    name: `files/${fileName}`,
                    userId: req.user._id
                  });
                  newFile.save()
                  return res.status(200).json({
                    status: "success",
                    message: "File created successfully!!",
                  });
                } catch (error) {
                  res.json({
                    error,
                  });
                }
              } else {
                // Multiple files
              }
        });   
    }


    // [GET] /me/images
    async showImages(req, res, next){
      const images = await UploadFile.find({userId: req.user._id})
      return res.render('me/uploaded-images', {images: images})
    }
}
const a = new MeController()

export default a