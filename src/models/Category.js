import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String },
    code: { type: String },
    
  },
  { timestamps: true }
);
const Categorylvl1Schema = new mongoose.Schema(
  {
    name: { type: String },
    code: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }

  },
  { timestamps: true }
);
const Categorylvl2Schema = new mongoose.Schema(
  {
    name: { type: String },
    code: { type: String },
    categorylvl1: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorylvl1' }

  },
  { timestamps: true }
);
const Categorylvl3Schema = new mongoose.Schema(
  {
    name: { type: String },
    code: { type: String },
    categorylvl2: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorylvl2' }
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", CategorySchema);
export const Categorylvl1 = mongoose.model("Categorylvl1", Categorylvl1Schema);
export const Categorylvl2 = mongoose.model("Categorylvl2", Categorylvl2Schema);
export const Categorylvl3 = mongoose.model("Categorylvl3", Categorylvl3Schema);