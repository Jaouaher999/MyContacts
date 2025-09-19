const cors = require('cors');

const corsOptions = {
  origin: [process.env.FRONTEND],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

module.exports = cors(corsOptions);