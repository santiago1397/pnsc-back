import Visit from "../models/Visits.js";
import Student from "../models/Student.js";
import Schedule from "../models/Schedule.js";
import Teachers from "../models/Teachers.js";
import Entity from "../models/Entity.js"
import fs from "fs"
import * as XLSX from 'xlsx'


export const validateStudents = async (req, res) => {
  try {

    let aux = req.body.students
    var repeated = []

    aux.forEach(element => {
      element.entity = req.body.entity.name,
        element.activityDate = req.body.activityDate
    });


    for (let i = 0; i < aux.length; i++) {
      console.log(new Date(req.body.activityDate),)

      if (aux.ci != "") {
        const found = await Student.find({ activityDate: new Date(req.body.activityDate), ci: aux[i].ci })
        if (found.length > 0) {
          console.log(found[0])
          return res.status(406).json({ student: found[0] })
        }
      }


      const found = await Student.find({ activityDate: new Date(req.body.activityDate), name: aux[i].name, lastName: aux[i].name })
      if (found.length > 0) {
        console.log(found[0])
        return res.status(406).json({ student: found[0] })
      }
    }

    return res.status(200).json({ ok: "estudiantes verificados" })

  } catch (error) {
    console.log(error)
    res.status(500).json(err);
  }
}



export const createVisit = async (req, res) => {

  try {
    let visitInfo = req.body
    /* delete visitInfo.students */


    const visit = new Visit({ ...visitInfo, students: req.body.students.length, teachers: req.body.teachers.length })
    const final = await visit.save()

    let aux = req.body.students

    const result = await Schedule.updateOne(
      { _id: req.body.agendedLink },
      { $set: { visitlink: final._id } }
    );

    aux.forEach(element => {
      element.entity = req.body.entity.name,
        element.activityDate = req.body.activityDate,
        element.activityLink = final._id,
        element.category = req.body.category,
        element.subCategorylvl1 = req.body.subCategorylvl1,
        element.subCategorylvl2 = req.body.subCategorylvl2,
        element.subCategorylvl3 = req.body.subCategorylvl3

    });


    await Student.insertMany(aux)

    let aux2 = req.body.teachers

    aux2.forEach(element => {
      element.entity = req.body.entity.name,
        element.activityDate = req.body.activityDate,
        element.activityLink = final._id
    });

    await Teachers.insertMany(aux2)


    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      { lastLoaded: new Date() },
      { new: true } // Return the updated document
    );

    res.status(200).json("agenda creada exitosamente")
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}


export const getVisits = async (req, res) => {
  try {
    var entityQuery = {}
    if (req.query.entity && req.query.entity != "TODOS") {
      const entity = await Entity.find({ name: req.query.entity })
      entityQuery = { "entity._id": entity[0].id }
    }

    const skip = parseInt(req.params.skip)
    const limit = parseInt(req.params.limit)

    if (req.user.role.role <= 2) {
      const documents = await Visit.find({ ...entityQuery }).skip(skip).limit(limit).sort({ createdAt: -1 });
      const total = await Visit.countDocuments({ ...entityQuery })
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

export const deleteVisit = async (req, res) => {
  try {
    req.params.id

    const visit = await Visit.findById(req.params.id)

    if (visit) {
      const result1 = await Student.deleteMany({ activityLink: req.params.id })
      console.log(result1.deletedCount)

      const result2 = await Teachers.deleteMany({ activityLink: req.params.id })
      console.log(result2.deletedCount)

      const schedule = await Schedule.find({ visitlink: req.params.id })
      schedule[0].visitlink = ""
      await schedule[0].save()

      await Visit.findByIdAndDelete(req.params.id)
      return res.status(200).json("eliminado exitosamente");
    }
    return res.status(202).json("ok?");
  } catch (error) {
    console.log(error)
    return res.status(500).json(error);
  }

}

export const getVisitReport = async (req, res) => {
  try {

    console.log(req.params.entity)
    console.log(req.params.id)

    const folder = `files/routes/${req.params.entity}`
    var filename = `files/routes/${req.params.entity}/${req.params.id}.xlsx`;


    fs.mkdirSync(folder, { recursive: true })


    if (fs.existsSync(filename)) {
      console.log('File exists!');
      // Do something with the file
      res.download(filename)
    }

    const documents = await Student.find({ activityLink: req.params.id }).populate('activityLink');

    function formatDate(date) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }

    //creo un nuevo json para pasarlo a excel con todos los campos
    const newdocs = documents.map(doc => {
      return {
        id: doc.id,
        ...doc._doc,
        activityDate: formatDate(doc._doc.activityDate),
        visitId: doc.activityLink.id,
        activityName: doc.activityLink.activityName,
        subActivity: doc.activityLink.subActivity,
      }
    })



    const worksheet = XLSX.utils.json_to_sheet(newdocs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filename, { compression: true });

    res.download(filename)

  } catch (error) {
    console.log(error)
    res.status(500).json(error);
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



