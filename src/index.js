import express from 'express'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url';
import morgan from 'morgan'
import path from 'path'
import { dirname } from 'path';
import { engine } from 'express-handlebars'
import route from './routes/index.js'
import db from './config/db/index.js'
const app = express()
const port = 3000

// Connect DB
db()

app.use(morgan('combined'))

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.engine('hbs', engine({
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resourses/views'));


app.use(express.static(path.join(__dirname, 'public')))

// Sử dụng bodyParser để nhận được dữ liệu gửi lên req.body
app.use(bodyParser.urlencoded({ extended: false }))
route(app)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})