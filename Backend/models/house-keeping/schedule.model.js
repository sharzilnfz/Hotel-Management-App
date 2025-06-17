import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
    {
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HouseKeepingStaff',
            required: [true, 'Staff member is required']
        },
        staffName: {
            type: String,
            required: [true, 'Staff name is required']
        },
        date: {
            type: Date,
            required: [true, 'Schedule date is required']
        },
        shiftType: {
            type: String,
            enum: ['morning', 'afternoon', 'night', 'day-off'],
            required: [true, 'Shift type is required']
        },
        notes: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Create a compound index on staffId and date to ensure a staff member has only one shift per day
scheduleSchema.index({ staffId: 1, date: 1 }, { unique: true });

const HouseKeepingSchedule = mongoose.model('HouseKeepingSchedule', scheduleSchema);

export default HouseKeepingSchedule; 