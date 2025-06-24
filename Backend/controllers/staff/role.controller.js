import Role from '../../models/staff/role.model.js';

// Get all roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find()
      .populate('department', 'name')
      .sort({ name: 1 });

    res.status(200).json({
      status: 'success',
      results: roles.length,
      data: {
        roles: roles,
      },
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to fetch roles',
      error: error.message,
    });
  }
};

// Get a single role by ID
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).populate(
      'department',
      'name'
    );

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role',
      error: error.message,
    });
  }
};

// Create a new role
export const createRole = async (req, res) => {
  try {
    const { name, description, department, permissions } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Role name is required',
      });
    }

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'A role with this name already exists',
      });
    }

    const role = await Role.create({
      name,
      description,
      department,
      permissions: permissions || [],
    });

    const populatedRole = await Role.findById(role._id).populate(
      'department',
      'name'
    );

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: populatedRole,
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create role',
      error: error.message,
    });
  }
};

// Update a role
export const updateRole = async (req, res) => {
  try {
    const { name, description, department, permissions } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Role name is required',
      });
    }

    // Check if role exists
    const existingRole = await Role.findById(req.params.id);
    if (!existingRole) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    // Check if name is taken by another role
    if (name !== existingRole.name) {
      const nameExists = await Role.findOne({ name });
      if (nameExists) {
        return res.status(400).json({
          success: false,
          message: 'A role with this name already exists',
        });
      }
    }

    const updateData = {
      name,
      description,
      permissions: permissions || existingRole.permissions,
    };

    // Only update department if it's provided
    if (department !== undefined) {
      updateData.department = department || null;
    }

    const role = await Role.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('department', 'name');

    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: role,
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update role',
      error: error.message,
    });
  }
};

// Delete a role
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete role',
      error: error.message,
    });
  }
};
