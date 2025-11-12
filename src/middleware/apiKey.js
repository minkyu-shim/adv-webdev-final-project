import config from '../config/config.js';

export const validateApiKey = (req, res, next) => {
  const headerKey = req.headers['x-api-key'];
  const bearer = req.headers['authorization']?.replace(/^Bearer\s+/i, '');
  const apiKey = headerKey || bearer;

  if (!apiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key is required in X-API-Key or Authorization: Bearer <key>'
    });
  }
  if (apiKey !== config.apiKey) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid API key'
    });
  }
  next();
};

export const validateApiKeyProduction = (req, res, next) => {
  if (config.isProduction()) return validateApiKey(req, res, next);
  next();
};

export default validateApiKey;
