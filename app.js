const express = require('express');
const { engine } = require('express-handlebars'); // the syntax is already changed by newest version
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(routes);

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`);
});

// note 導入自動化測試後會用到，所以要寫這段
module.exports = app;
