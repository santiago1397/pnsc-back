import mongoose from 'mongoose'

const EntitySchema = new mongoose.Schema(
    {
        name: { type: String },
        acronim: { type: String },
        asigned: { type: Array },
    },
    { timestamps: true }
);

export default mongoose.model("Entity", EntitySchema);