import mongoose from 'mongoose'

const ScheduleSchema = new mongoose.Schema(
  {
    activityName: { type: String },
    activityPlace: { type: Object },
    activityDate: { type: Date },
    schools: { type: Array, default: [] },
    activity: { type: Object },
    subActivity: {type: String},
    entity: { type: Object },
    studentSpected: { type: Number },
    visitlink: { type: String, default: '' }
  },

  { timestamps: true }
);

export default mongoose.model("Schedule", ScheduleSchema);