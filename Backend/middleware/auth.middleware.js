// Simple authentication middleware (no actual authentication)
export const verifyToken = (req, res, next) => {
    // You can add user info to the request if needed
    req.user = {
        _id: '64fb7a7b3d2a9c9f09b33f11', // Dummy user ID
        name: 'Admin User',
        email: 'admin@parkside.com',
        role: 'admin'
    };

    next();
}; 