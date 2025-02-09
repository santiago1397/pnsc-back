import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, trim: true, unique: true },
        name: { type: String, required: true },
        lastName: { type: String, required: true },
        password: { type: String, required: true, trim: true },
        role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
        phone: { type: String, default: "" },
        asigned: { type: Array, default: [] },
        lastConnexion: { type: Date, default: null },
        lastScheduled: { type: Date, default: null },
        lastLoaded: { type: Date, default: null },
        entity: { type: mongoose.Schema.Types.ObjectId, ref: 'Entity' }
    },

    { timestamps: true }
);

export default mongoose.model("User", UserSchema);