// Simple authentication middleware (no actual authentication)
export const verifyToken = (req, res, next) => {
  // You can add user info to the request if needed
  req.user = {
    _id: '64fb7a7b3d2a9c9f09b33f11', // Dummy user ID
    id: '64fb7a7b3d2a9c9f09b33f11', // Dummy user ID
    name: 'Admin User',
    email: 'admin@parkside.com',
    role: 'admin',
  };

  next();
};

// Optional authentication middleware - adds user info if token is present
export const optionalAuth = (req, res, next) => {
  // Check if authorization header exists
  const token = req.headers.authorization;

  if (token) {
    // If token exists, add user info (you can implement actual token verification here)
    req.user = {
      _id: '64fb7a7b3d2a9c9f09b33f11',
      id: '64fb7a7b3d2a9c9f09b33f11',
      name: 'Admin User',
      email: 'admin@parkside.com',
      role: 'admin',
    };
  }

  // Continue regardless of whether user is authenticated
  next();
};
