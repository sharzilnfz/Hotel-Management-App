import express from 'express';
import {
  createRole,
  deleteRole,
  getAllRoles,
  getRoleById,
  updateRole,
} from '../../controllers/staff/role.controller.js';

const router = express.Router();

// Route for all roles
router.route('/').get(getAllRoles).post(createRole);

// Routes for specific role by ID
router.route('/:id').get(getRoleById).put(updateRole).delete(deleteRole);

export default router;
