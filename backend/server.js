const express = require('express');
const cors = require('cors');
const router = require('./routes/router');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', router);

const port = 5000;
app.listen(port, () => 
{
  console.log(`Server running on http://localhost:${port}`);
});