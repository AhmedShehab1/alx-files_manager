export const tokenValidation = (req, res, next) => {
    const token = req.get('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    next();
}
