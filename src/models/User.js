import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, trim: true },
        name: { type: String, required: true },
        lastName: { type: String, required: true },
        password: { type: String, required: true, trim: true },
        role: { type: Object, default: { role: 4, name: "user" } },
        phone: { type: String, default: "" },
        asigned: { type: Array, default: [] },
        entity: { type: Object }
    },

    { timestamps: true }
);

export default mongoose.model("User", UserSchema);