import Schedule from "../models/Schedule.js";

export const createSchedule = async (req, res) => {

  try {

    console.log(req.body)
    const schedule = new Schedule({ ...req.body })
    await schedule.save()


    res.status(200).json("agenda creada exitosamente")
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}


export const getSchedules = async (req, res) => {
  try {
    const skip = parseInt(req.params.skip)
    const limit = parseInt(req.params.limit)

    if (req.user.role.role <= 2) {
      const documents = await Schedule.find({ visitlink: "" }).skip(skip).limit(limit).sort({ createdAt: -1 }).populate('entity');
      const total = await Schedule.countDocuments({ visitlink: "" })
      return res.status(200).json({documents, total})
    }

    const documents = await Schedule.find({ "entity.name": req.user.entity.name, visitlink: "" }).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Schedule.countDocuments({ "entity.name": req.user.entity.name, visitlink: "" })
    
    return res.status(200).json({documents, total})

  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}

export const linkSchedule = async (req, res) => {
  try {

    const schedules = await Schedule.find({ "entity.name": req.body.entityName })
    return res.status(200).json(schedules)

  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}


export const deleteSchedule = async (req, res) => {
  try {

    await Schedule.findByIdAndDelete(req.params.id)
    res.status(200).json("schedule deleted successfully")

  } catch (err) {
    console.log(err)
    res.status(500).json(err);
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



