import mongoose from 'mongoose'

const Schools = new mongoose.Schema(
    {
        name: { type: String },
        coordenates: { type: String },
        state: { type: Object },
        municipality: { type: Object },
        parish: { type: Object },
        type: { type: String }
    },

    { timestamps: true }
);

export default mongoose.model("Schools", Schools);