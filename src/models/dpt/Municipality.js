import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        label: { type: String, required: true },
        value: { type: String, required: true },

    },
    { timestamps: true }
);

export default mongoose.model("Municipality", UserSchema);