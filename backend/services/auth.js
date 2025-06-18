const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'Luffy@56';

const setUser = (user) => {
    try {
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                role: user.role // Adding role to payload
            }
        };

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            success: true,
            token
        };
    } catch (error) {
        return {
            success: false,
            error: 'Error generating token'
        };
    }
};

const getUser = (token) => {
    try {
        if (!token) {
            return {
                success: false,
                error: 'No token provided'
            };
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        return {
            success: true,
            user: decoded.user
        };
    } catch (error) {
        return {
            success: false,
            error: 'Invalid token'
        };
    }
};

module.exports = {
    setUser,
    getUser
};