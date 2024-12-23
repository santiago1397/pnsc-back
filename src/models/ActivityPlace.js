import mongoose from 'mongoose'

const ActivityPlaceSchema = new mongoose.Schema(
    {
        name: {type: String},
        coordenates: {type: String, default: ""},
        state: {type: Object},
        municipality: {type: Object},
        parish: {type: Object},
        address: {type: Object}
    },

    { timestamps: true }
);

export default mongoose.model("ActivityPlace", ActivityPlaceSchema);