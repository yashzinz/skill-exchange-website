// function to make sure that user is signed up before proceeding

function ensureSignedUp(req, res, next) {
    if (req.session && req.session.userId) {
      return next();
    }
    return res.status(401).json({ message: 'Please sign up to continue' });
  }

module.exports = {ensureSignedUp};