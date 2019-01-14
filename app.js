const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const app = express();

//EJS
app.use(expressLayouts);
app.set('views', [
    path.join(__dirname, 'views'), 
    path.join(__dirname, 'views/auth'), 
    path.join(__dirname, 'views/layouts')
]);
app.use(express.static(path.resolve('./public')));
app.set('view engine', 'ejs');

//Routes
app.use('/', require('./routes/index'));

app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3333;

app.listen(PORT, console.log(`Server started on port ${PORT}`))