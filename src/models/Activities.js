import mongoose from 'mongoose'

const ActivitySchema = new mongoose.Schema(
    {
        name: { type: String },
        desc: { type: String },
        subcategories: { type: Array, default: [] },
        asigned: { type: Array, default: [] },
    },
    { timestamps: true }
);

export default mongoose.model("Activity", ActivitySchema);