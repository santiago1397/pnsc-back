import Schedule from "../models/Schedule.js";
import Entity from "../models/Entity.js"
import User from "../models/User.js";

export const createSchedule = async (req, res) => {

  try {

    console.log(req.body)
    const schedule = new Schedule({ ...req.body })
    await schedule.save()

    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      { lastScheduled: new Date() },
      { new: true } // Return the updated document
    );


    res.status(200).json("agenda creada exitosamente")
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}


export const getSchedules = async (req, res) => {
  try {

    var entityQuery = {}
    if (req.query.entity && req.query.entity != "TODOS") {
      const entity = await Entity.find({ name: req.query.entity })
      entityQuery = { "entity._id": entity[0].id }
    }

    const skip = parseInt(req.params.skip)
    const limit = parseInt(req.params.limit)

    if (req.user.role.role <= 2) {
      const documents = await Schedule.find({ ...entityQuery, visitlink: "" }).skip(skip).limit(limit).sort({ createdAt: -1 }).populate('entity');
      const total = await Schedule.countDocuments({ ...entityQuery, visitlink: "" })


      return res.status(200).json({ documents, total })
    }

    const documents = await Schedule.find({ "entity.name": req.user.entity.name, visitlink: "" }).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Schedule.countDocuments({ "entity.name": req.user.entity.name, visitlink: "" })

    return res.status(200).json({ documents, total })

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



