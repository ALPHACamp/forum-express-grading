import express, { urlencoded } from 'express';
import flash from 'connect-flash';
import session from 'express-session';
import { initialize, session as _session } from './config/passport';
import routes from './routes';
import handlebars from 'express-handlebars';

const app = express();
const port = process.env.PORT || 3000;
app.engine('hbs', handlebars({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(urlencoded({ extended: true }));
app.use(initialize());
app.use(_session());
app.use(session({ secret: 'SESSION_SECRET', resave: false, saveUninitialized: false }));
app.use(flash()); // 掛載套件

app.use((req, res, next) => {
    res.locals.success_messages = req.flash('success_messages'); // 設定 success_msg 訊息
    res.locals.error_messages = req.flash('error_messages'); // 設定 warning_msg 訊息
    res.locals.user = req.user;
    next();
});
app.use(routes);
app.listen(port, () => {
    console.info(`Example app listening on port ${port}!`);
});
export default app;
