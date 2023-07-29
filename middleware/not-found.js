module.exports = (req, res, next) => {
    res.status(404).send('🔍 - Not Found');
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
}