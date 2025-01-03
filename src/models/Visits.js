import mongoose from 'mongoose'

const VisitSchema = new mongoose.Schema(
    {
        activityName: { type: String },
        activityDesc: { type: String },
        activityPlace: { type: Object },
        schools: { type: Array },
        entity: { type: Object },
        activity: { type: Object },
        subActivity: { type: String },
        checked: { type: Boolean },
        activityDate: { type: Date },
        agendedLink: { type: String },
        students: { type: Array },
        observation: { type: String },
        createdBy: { type: Object }
    },

    { timestamps: true }
);

export default mongoose.model("Visits", VisitSchema);