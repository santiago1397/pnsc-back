import Visit from "../models/Visits.js";
import Student from "../models/Student.js";
import Schedule from "../models/Schedule.js";

export const createVisit = async (req, res) => {

  try {
    let visitInfo = req.body
    /* delete visitInfo.students */


    const visit = new Visit({ ...visitInfo, students: null })
    const final = await visit.save()

    let aux = req.body.students

    const result = await Schedule.updateOne(
      { _id: req.body.agendedLink },
      { $set: { visitlink: final._id } }
    );

    aux.forEach(element => {
      element.entity = req.body.entity.name,
      element.activityDate = req.body.activityDate,
      element.activityLink = final._id
    });

    await Student.insertMany(aux)


    res.status(200).json("agenda creada exitosamente")
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}


export const getVisits = async (req, res) => {
  try {
    const skip = parseInt(req.params.skip)
    const limit = parseInt(req.params.limit)

    if (req.user.role.role <= 2) {
      const documents = await Visit.find().skip(skip).limit(limit).sort({ createdAt: -1 });
      const total = await Visit.countDocuments()
      return res.status(200).json({ documents, total })
    }

    const documents = await Visit.find({ "entity.name": req.user.entity.name }).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Visit.countDocuments({ "entity.name": req.user.entity.name })

    return res.status(200).json({ documents, total })
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}

/* export const linkSchedule = async (req, res) => {
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
} */

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



