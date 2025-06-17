import express from 'express';
import {
    checkUser,
    getAllUsers,
    getAllGuests,
    getAllStaffUsers,
    getSingleUser,
    loginUser,
    signupUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    updateLoyaltyPoints
} from '../../controllers/users/user.controller.js';

const router = express.Router();

// Authentication routes
router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/check', checkUser);

// User management routes
router.get('/guests', getAllGuests);
router.get('/staff', getAllStaffUsers);
router.get('/', getAllUsers);
router.get('/:id', getSingleUser);
router.put('/:id', updateUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

// Specific update routes
router.patch('/:id/status', updateUserStatus);
router.patch('/:id/loyalty', updateLoyaltyPoints);

export default router;