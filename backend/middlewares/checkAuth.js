const { getUser } = require('../services/auth');

// Authentication middleware
const checkAuth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const userData = getUser(token);
        
        if (!userData.success) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized access' 
            });
        }

        req.user = userData.user;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authentication failed' 
        });
    }
};

// Role-based authorization middleware
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({
                success: false,
                message: 'Access forbidden'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};

module.exports = {
    checkAuth,
    authorize
};