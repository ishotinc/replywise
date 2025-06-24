const supabase = require('../config/supabase');

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.redirect('/login');
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.clearCookie('access_token');
      return res.redirect('/login');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.redirect('/login');
  }
}

module.exports = { requireAuth };