import mongoose from 'mongoose';
import validator from 'validator';

const staffSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters']
        },
        position: {
            type: String,
            required: [true, 'Position is required'],
            trim: true,
            minlength: [2, 'Position must be at least 2 characters']
        },
        department: {
            type: String,
            required: [true, 'Department is required'],
            enum: {
                values: [
                    'Management',
                    'Front Office',
                    'Housekeeping',
                    'Food & Beverage',
                    'Maintenance',
                    'Spa & Wellness',
                    'Security',
                    'IT',
                    'Human Resources',
                    'Sales & Marketing'
                ],
                message: 'Please select a valid department'
            }
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email']
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            minlength: [7, 'Phone number must be at least 7 characters']
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            enum: {
                values: ['Administrator', 'Manager', 'Supervisor', 'Staff', 'Intern', 'Contractor'],
                message: 'Please select a valid role'
            }
        },
        status: {
            type: String,
            enum: {
                values: ['Active', 'On Leave', 'Suspended', 'Terminated'],
                message: 'Please select a valid status'
            },
            default: 'Active'
        },
        accessLevel: {
            type: String,
            enum: {
                values: ['Full Access', 'Administrative', 'Standard', 'Limited', 'Read Only'],
                message: 'Please select a valid access level'
            },
            default: 'Standard'
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        emergencyContact: {
            type: String
        },
        address: {
            type: String,
            trim: true
        },
        photo: {
            type: String,
            default: 'default.jpg'
        },
        active: {
            type: Boolean,
            default: true,
            select: false
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual property for employment length
staffSchema.virtual('employmentLength').get(function () {
    const now = new Date();
    const startDate = this.startDate;
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''}${months > 0 ? `, ${months} month${months > 1 ? 's' : ''}` : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
});

// Find staff with status "Active"
staffSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

const Staff = mongoose.model('Staff', staffSchema);

export default Staff; 