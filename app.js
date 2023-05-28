const express = require("express");
const routes = require("./routes");
const handlebars = require("express-handlebars");
const app = express();
const port = process.env.PORT || 3000;
const flash = require("connect-flash");
const session = require("express-session");
const SESSION_SECRET = "secret";
const passport = require("./config/passport");
const helpers = require("./helpers/auth-helpers");
const handlebarsHelpers = require("./helpers/handlebars-helpers");
const methodOverride = require("method-override");
const path = require("path");
app.use(methodOverride("_method"));
app.use("/upload", express.static(path.join(__dirname, "upload")));
app.engine(
  "hbs",
  handlebars.engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: handlebarsHelpers,
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  res.locals.user = helpers.getUser(req);
  next();
});
app.use(routes);

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`);
});

module.exports = app;
