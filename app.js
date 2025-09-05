const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/submit-form', (req, res) => {
    res.send('Form submitted');
});

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});