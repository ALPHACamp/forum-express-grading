const path = require('path') // node.js原生語法
const express = require('express');
const { engine } = require('express-handlebars'); // the syntax is already changed by newest version
const flash = require('connect-flash');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('./config/passport');

const handlebarsHelpers = require('./helpers/handlebars-helpers'); // note 為了要執行裡面的function，所以需要引入該檔案，而非裡面的物件
const { getUser } = require('./helpers/auth-helpers');

const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;
const SESSION_SECRET = 'secret';

app.engine('hbs', engine({ extname: '.hbs', helpers: handlebarsHelpers }));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

// note 靜態檔案(如影音, 相片or 文件檔案類)會使用express.static()處理
// note path.join()為node.js語法，路徑碎片的拼接
// Thinking 當req過來後，接收到/upload的路徑字串，便由express.static處理。而收到當下檔案的絕對路徑(__dirname)，在增加upload字串，並放入裡面。
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);

app.use(passport.initialize());
app.use(passport.session()); // active session function

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  // note 這段用意請看auth-helper.js
  res.locals.user = getUser(req);
  next();
});

app.use(routes);

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`);
});

// note 導入自動化測試後會用到，所以要寫這段
module.exports = app;
