import mongoose, { Schema } from "mongoose";

const partSchema = mongoose.Schema({
    type: {
        type: String,
        enum: ['CPU', 'Monitor', 'Mouse'],
        required: true
    },
    barcode: {
        type: String,
        required: true,
        unique: true,
    },
    serialNumber: {
        type: String,
        required: true,
        unique: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    specs: {
        type: Schema.Types.Mixed,
    },
    status: {
        type: String,
        enum: ['active', 'unusable'],
        default: 'active'
    },
    unusableReason: {
        type: String,
        default: null,
    },
    assignedSystem: {
        type: Schema.Types.ObjectId,
        ref: "System",
        default: null
    }
}, { timestamps: true });

export default mongoose.model('Parts', partSchema);