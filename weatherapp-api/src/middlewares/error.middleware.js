exports.notFound = (req, res, next) => {
    res.status(404).json({ message: `Ruta no encontrada: ${req.originalUrl}` });
};

exports.errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';
    console.error(`[ERROR] ${status} — ${message}`);
    res.status(status).json({ message });
};