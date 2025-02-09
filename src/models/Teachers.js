import mongoose from 'mongoose'

const StudentsSchema = new mongoose.Schema(
  {
    school: { type: String },
    name: { type: String },
    lastName: { type: String },
    ci: { type: String },
    age: { type: Number },
    gender: { type: String },
    disability: { type: String },
    homeLocation: { type: Object },
    entity: { type: String },

    category: {type: String},
    subCategorylvl1: {type: String},
    subCategorylvl2: {type: String},
    subCategorylvl3: {type: String},
    
    activityDate: { type: Date },
    activityLink: { type: mongoose.Schema.Types.ObjectId, ref: 'Visits' },
    shirtSize: { type: String },

  },

  { timestamps: true }
);

export default mongoose.model("Teachers", StudentsSchema);