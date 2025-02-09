import Schedule from "../models/Schedule.js";
import Role from "../models/Role.js";

export const createSchedule = async (req, res) => {

  try {
    const schedule = new Schedule({ ...req.body })
    await schedule.save()


    res.status(200).json("agenda creada exitosamente")
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}


export const getRoles = async (req, res) => {
  try {


    if (req.user.role.role <= 2) {
      const documents = await Role.find().sort({ createdAt: -1 });
      return res.status(200).json(documents)
    }

    const documents = await Role.find({ role: { $gte: 5 } }).sort({ createdAt: -1 });

    return res.status(200).json(documents)

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




