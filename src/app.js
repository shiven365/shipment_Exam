const express = require('express');

const app = express();
app.use(express.json());

const vesselRoutes = require('./routes/vesselRoutes');
const voyageRoutes = require('./routes/voyageRoutes');
const containerRoutes = require('./routes/containerRoutes');

app.use('/vessels', vesselRoutes);
app.use('/voyages', voyageRoutes);
app.use('/containers', containerRoutes);

module.exports = app;
