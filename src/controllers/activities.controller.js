import Activities from "../models/Activities.js";

export const createActivity = async (req, res) => {

  try {
    const activty = new Activities({ ...req.body })
    await activty.save()


    res.status(200).json("actividad creada exitosamente")
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}

export const getActivities = async (req, res) => {
  try {

    const skip = parseInt(req.params.skip)
    const limit = parseInt(req.params.limit)
    const documents = await Activities.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });

    const total = await Activities.countDocuments()

    return res.status(200).json({documents, total})
    

  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}

export const deleteActivity = async (req, res) => {
  try {
    await Activities.findByIdAndDelete(req.params.id)

    return res.status(200).json("actividad eliminada")
  } catch (err) {
    return res.status(500).json(err);
  }
}

export const editActivity = async (req, res) => {
  try {

    

    const result = await Activities.updateOne(
      { _id: req.params.id },
      { $set: { ...req.body } }
    );


    return res.status(200).json("actividad editada")

  } catch (error) {
    console.log(error)
  }
}

// crear o cambiar get activities para las actividades visibles para ciertos entes
/* export const deleteSchool = async (req, res) => {
  try {

    let category = await Category.find({ id: req.params.id })
    await Category.findByIdAndDelete(req.params.id)

    res.status(200).json("category deleted successfully")
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
} */



