module.exports = (req, res, next) => {
    const auth = { login: 'admin', password: 'skillcircleadmin' }; // Change this to a secure method

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login && password && login === auth.login && password === auth.password) {
        return next();
    }
    res.set('Cache-Control', 'no-store');
    res.set('WWW-Authenticate', 'Basic realm="Admin area"');
    res.status(401).send('Authentication required.');
};