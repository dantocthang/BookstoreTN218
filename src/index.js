import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url';
import cors from 'cors'
import morgan from 'morgan'
import methodOverride from 'method-override'
import cookieParser from 'cookie-parser'
import path from 'path'
import flash from 'connect-flash'
import { dirname } from 'path';
import ejs from 'ejs'
import expressLayouts from 'express-ejs-layouts'
import passport from 'passport'
import dotenv from 'dotenv'



import route from './routes/index.js'
import db from './config/db/index.js'
import initializePassport from './config/passport.js'

const app = express()
const port = 3003

// Load env config
dotenv.config()

// View engines
app.use(expressLayouts)
app.set('layout', '../../resourses/views/layouts/main.ejs')
app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: false }))



// Load config passport user validation
initializePassport(passport)


// Use Cors for API call from other project
app.use(cors())

// Use session
app.use(cookieParser('keyboard cat'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 60000 }
}));
// Flash message
app.use(flash());



// Passport validate data
app.use(passport.initialize())
app.use(passport.session());

// Connect DB
db()

app.use(morgan('combined'))
app.use(methodOverride('_method'))

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.set('views', path.join(__dirname, 'resourses/views'));


app.use(express.static(path.join(__dirname, 'public')))


app.get('/set_session', (req, res) => {
  //set a object to session
  req.session.User = {
    website: 'anonystick.com',
    type: 'blog javascript',
    like: '4550'
  }

  return res.status(200).json({ status: 'success' })
})

// Custom helpers
app.locals.sortable = (field, sort) => {
  const sortType = field === sort.column ? sort.type : 'default'
  const icons = {
    default: 'oi oi-elevator',
    asc: 'oi oi-sort-ascending',
    desc: 'oi oi-sort-descending'
  }
  const types = {
    default: 'desc',
    asc: 'desc',
    desc: 'asc'
  }

  const icon = icons[sortType]
  const type = types[sortType]

  return (
    `<a href="?_sort&type=${type}&column=${field}"><span class="${icon}"></span></a>`
  )
}



app.get('/get_session', (req, res) => {
  //check session
  if (req.session.User) {
    return res.status(200).json({ status: 'success', session: req.session.User })
  }
  return res.status(200).json({ status: 'error', session: 'No session' })
})


route(app)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})