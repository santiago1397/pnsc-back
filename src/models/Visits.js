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

        category: { type: String },
        subCategorylvl1: { type: String },
        subCategorylvl2: { type: String },
        subCategorylvl3: { type: String },

        medialink: { type: String, default: '' },
        images: { type: Array, default: [] },
        checked: { type: Boolean },
        activityDate: { type: Date },
        agendedLink: { type: String },
        teachersExpected: { type: Number },
        teachers: { type: Number },
        studentsExpected: { type: Number },
        students: { type: Number },
        description: { type: String },
        observation: { type: String },
        createdBy: { type: Object }
    },

    { timestamps: true }
);

export default mongoose.model("Visits", VisitSchema);