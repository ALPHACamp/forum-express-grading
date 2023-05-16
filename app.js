const express = require("express");
const routes = require("./routes");
const handlebars = require("express-handlebars");
const app = express();
const port = process.env.PORT || 3000;

app.engine("hbs", handlebars.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`);
});

module.exports = app;
