import mongoose from 'mongoose';
import validator from 'validator';

const staffSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Staff name is required'],
            trim: true
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
            validate: {
                validator: function (v) {
                    return /^\d{10,15}$/.test(v.replace(/\D/g, ''));
                },
                message: props => `${props.value} is not a valid phone number!`
            }
        },
        position: {
            type: String,
            required: [true, 'Staff position is required'],
            enum: {
                values: ['Manager', 'Supervisor', 'Room Attendant', 'Laundry Attendant', 'Public Area Cleaner', 'Other'],
                message: 'Position is either: Manager, Supervisor, Room Attendant, Laundry Attendant, Public Area Cleaner, or Other'
            }
        },
        joinDate: {
            type: Date,
            required: [true, 'Join date is required'],
            default: Date.now
        },
        assignedAreas: {
            type: [String],
            default: [],
            validate: {
                validator: function (v) {
                    return v.length > 0;
                },
                message: 'At least one area must be assigned'
            }
        },
        status: {
            type: String,
            enum: {
                values: ['Active', 'On Leave', 'Terminated'],
                message: 'Status is either: Active, On Leave, or Terminated'
            },
            default: 'Active'
        },
        avatar: {
            type: String,
            default: null
        },
        performance: {
            type: Number,
            min: [1, 'Performance rating must be at least 1'],
            max: [5, 'Performance rating cannot be more than 5'],
            default: 3
        },
        tasksDone: {
            type: Number,
            default: 0,
            min: 0
        },
        tasksAssigned: {
            type: Number,
            default: 0,
            min: 0
        },
        tasksInProgress: {
            type: Number,
            default: 0,
            min: 0
        },
        address: {
            type: String,
            trim: true
        },
        notes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual property for efficiency percentage
staffSchema.virtual('efficiency').get(function () {
    if (this.tasksAssigned === 0) return 0;
    return ((this.tasksDone / this.tasksAssigned) * 100).toFixed(2);
});

const HouseKeepingStaff = mongoose.model('HouseKeepingStaff', staffSchema);

export default HouseKeepingStaff; 