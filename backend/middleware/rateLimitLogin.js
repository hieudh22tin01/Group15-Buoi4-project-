// middlewares/rateLimitLogin.js
const rateLimit = {};
const WINDOW_MS = 60 * 1000; // 1 phút
const MAX_ATTEMPTS = 5;

const rateLimitLogin = (req, res, next) => {
  const ip = req.ip;

  if (!rateLimit[ip]) {
    rateLimit[ip] = { count: 1, firstAttempt: Date.now() };
  } else {
    const currentTime = Date.now();
    const diff = currentTime - rateLimit[ip].firstAttempt;

    if (diff < WINDOW_MS) {
      rateLimit[ip].count++;
      if (rateLimit[ip].count > MAX_ATTEMPTS) {
        return res.status(429).json({
          message: 'Too many login attempts. Please try again later.',
        });
      }
    } else {
      rateLimit[ip] = { count: 1, firstAttempt: Date.now() }; // reset window
    }
  }

  next();
};

module.exports = rateLimitLogin;
