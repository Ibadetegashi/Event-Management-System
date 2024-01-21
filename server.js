const express = require('express');

const app = express();
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const eventRouter = require('./routers/event');
const participantRouter = require('./routers/participant');

const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.use(express.json());
app.use('/event', eventRouter);
app.use('/participant', participantRouter);

const readmePath = path.join(__dirname, 'README.html');
app.use('/', (req, res) => {
  res.sendFile(readmePath);
});

console.log(__dirname);
const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
