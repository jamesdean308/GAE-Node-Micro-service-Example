const express = require('express');

const app = express();

app.use('/', (req, res) => {
    res.json({ 'message': 'Hello from Node microservice1!' });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Node server listening on port ${port}`);
});
