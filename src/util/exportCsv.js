import path from 'path'
import fs from 'fs'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Parser } from 'json2csv'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


function exportCsv(model) {
    return async (req, res, next)=>{
        const uploadFolder = path.join(__dirname, "..", "public", "files", req.user.username);
        console.log(uploadFolder)
        const jsonArray = await model.find()

        const fields = Object.keys(model.schema.paths);
        const opts = { fields };

        const name = model.collection.collectionName

        try {
            const parser = new Parser(opts);
            const csv = parser.parse(jsonArray);
            fs.writeFile(`${uploadFolder}/${name}.csv`, csv, (err) => {
                if (err)
                    console.log(err);
                else {
                    console.log("File written successfully\n");
                    console.log("The written has the following contents:");
                    console.log(fs.readFileSync(`${uploadFolder}/${name}.csv`, "utf8"));

                    // Download
                    res.redirect(`/files/${req.user.username}/${name}.csv`)
                }
            });
        } catch (err) {
            console.error(err);
        }
    }
}

export default exportCsv