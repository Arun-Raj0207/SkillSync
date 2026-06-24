require('dotenv').config();

const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health.routes');
const uploadRoutes = require('./routes/upload.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/upload-resume', uploadRoutes);

module.exports = app;
