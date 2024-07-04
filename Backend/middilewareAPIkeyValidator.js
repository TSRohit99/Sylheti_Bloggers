require('dotenv').config();

const validApiKeys = [
    process.env.API_KEY_SELF
  ];

const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
  
    if (!apiKey) {
      return res.status(401).json({ message: 'API key is missing' , state: 'invalid'});
    }
  
    if (!validApiKeys.includes(apiKey)) {
      return res.status(403).json({ message: 'Invalid API key' });
    }
  
    next();
  };
  
  module.exports = validateApiKey;