import mongoose from 'mongoose'

const ScheduleSchema = new mongoose.Schema(
  {
    activityName: { type: String },
    activityPlace: { type: Object },
    activityDate: { type: Date },
    schools: { type: Array, default: [] },
    activity: { type: Object },
    subActivity: {type: String},


    category: {type: String},
    subCategorylvl1: {type: String},
    subCategorylvl2: {type: String},
    subCategorylvl3: {type: String},

    
    entity: { type: Object },
    teachersExpected: { type: Number },
    studentSpected: { type: Number },
    visitlink: { type: String, default: '' }
  },

  { timestamps: true }
);

export default mongoose.model("Schedule", ScheduleSchema);