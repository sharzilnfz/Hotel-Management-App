import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: [true, 'Room number is required'],
            trim: true
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HouseKeepingStaff',
            required: [true, 'Task must be assigned to a staff member']
        },
        priority: {
            type: String,
            enum: {
                values: ['high', 'medium', 'low'],
                message: 'Priority is either: high, medium, or low'
            },
            default: 'medium'
        },
        status: {
            type: String,
            enum: {
                values: ['pending', 'in-progress', 'completed', 'delayed'],
                message: 'Status is either: pending, in-progress, completed, or delayed'
            },
            default: 'pending'
        },
        notes: {
            type: String,
            trim: true
        },
        dueDate: {
            type: Date,
            required: [true, 'Due date is required']
        },
        isRecurring: {
            type: Boolean,
            default: false
        },
        completedAt: {
            type: Date
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Update completedAt automatically when status changes to completed
taskSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
        this.completedAt = new Date();
    }
    next();
});

// Virtual for calculating if task is overdue
taskSchema.virtual('isOverdue').get(function () {
    if (this.status === 'completed') return false;
    return new Date() > new Date(this.dueDate);
});

const HouseKeepingTask = mongoose.model('HouseKeepingTask', taskSchema);

export default HouseKeepingTask; 