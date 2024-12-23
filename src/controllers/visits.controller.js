import Visit from "../models/Visits.js";
import Student from "../models/Student.js";

export const createVisit = async (req, res) => {

  try {
    const schedule = new Visit({ ...req.body.details })
    const final = await schedule.save()

    let aux = req.body.students

    aux.forEach(element => {
        element.entity = req.body.details.entity,
        element.activityDate = req.body.details.activityDate
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

    const visits = await Visit.find({ "entity.name": req.body.entityName })
    return res.status(200).json(visits)

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



