import path from 'path'
import fs from 'fs'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import formidable from 'formidable';

import {isCsvFile} from './checkValidFile.js'
import UploadFile from '../app/models/UploadFile.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


async function uploadFile(req, res, next) {

    const uploadFolder = path.join(__dirname, "..", "public", "files", "books");
    if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
    }
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
            const isValid = isCsvFile(file);
            // creates a valid name by removing spaces
            const fileName = file.originalFilename;
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
                    name: `files/${req.user.username}/${fileName}`,
                    userId: req.user._id
                });
                newFile.save()
                res.locals.fileName = fileName
                console.log(res.locals.fileName)
                // res.status(200).json({
                //     status: "success",
                //     message: "File created successfully!!",
                // });
                next()
            } catch (error) {next()}
        } else {
            // Multiple files
        }
    });
}

export default uploadFile