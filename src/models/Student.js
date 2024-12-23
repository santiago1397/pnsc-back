import mongoose from 'mongoose'

const StudentsSchema = new mongoose.Schema(
    {
        school: {type: String},
        name: {type: String},
        lastName: {type: String},
        ci: {type: String},
        ciType: {type: String},
        age: {type: Number},
        gender: {type: String},
        grade: {type: String},
        disability: {type: String},
        homeLocation: {type: Object},
        representativeName: {type: String},
        representativeLastName: {type: String},
        representativeCI: {type: String},
        representativeAge: {type: Number},
        representativeKindred: {type: String},
        representativePhone: {type: String},
        entity: {type: String},
        activityDate: {type: Date},

    },

    { timestamps: true }
);

export default mongoose.model("Students", StudentsSchema);