import Student from "../models/Student.js";
import Activity from "../models/Activities.js";
import { Category, Categorylvl1, Categorylvl2, Categorylvl3 } from "../models/Category.js"
import Visits from "../models/Visits.js";
import Teachers from "../models/Teachers.js"
import Entity from "../models/Entity.js"
import Schedule from "../models/Schedule.js";
import User from "../models/User.js"
import * as XLSX from 'xlsx'
import { skipMiddlewareFunction } from "mongoose";

export const getGeneralReport = async (req, res) => {
  const categories = [Category, Categorylvl1, Categorylvl2, Categorylvl3]
  const categoriesnames = ["category", "subCategorylvl1", "subCategorylvl2", "subCategorylvl3"]
  const categoriesnames1 = ["category", "categorylvl1", "categorylvl2", "categorylvl3"]


  try {

    var entityQuery = {}
    if (req.params.entity != "TODOS") {
      entityQuery = { entity: req.params.entity }
    }

    const addRecursive = async (previousid, step = 1) => {

      if (step > categories.length - 1) {
        return []
      }

      var obj = {}
      obj[categoriesnames1[step - 1]] = previousid
      const categories1 = await categories[step].find({ ...obj })

      const elements = [];
      for (let i = 0; i < categories1.length; i++) { // Use for...of loop
        const name = categories1[i].name;
        var obj1 = {}
        obj1[categoriesnames[step]] = categories1[i].name

        const male = await Student.countDocuments({ ...entityQuery, ...obj1, gender: "Masculino" })
        const female = await Student.countDocuments({ ...entityQuery, ...obj1, gender: "Femenino" })
        const teachers = await Teachers.countDocuments({ ...entityQuery, ...obj1 })
        const subs = await addRecursive(categories1[i].id, step + 1)

        elements.push({ name, male, female, total: male + female, teachers, subs });
      }

      return elements;
      /* const elements = await Promise.all(categories1.map(async (category) => {
        const name = category.name;



        const [male, female, teachers, subs] = await Promise.all([
          Student.countDocuments({ ...entityQuery, ...obj1, gender: "Masculino" }),
          Student.countDocuments({ ...entityQuery, ...obj1, gender: "Femenino" }),
          Teachers.countDocuments({ ...entityQuery, ...obj1 }),
          addRecursive(category._id, step + 1)
        ]);

        return { name, male, female, total: male + female, teachers, subs };
      }));

      return elements */

    }


    const categories1 = await Category.find();



    /* const report = await Promise.all(categories1.map(async (category) => {
      const name = category.name;
      const [male, female, teachers, subs] = await Promise.all([
        Student.countDocuments({ ...entityQuery, category: category.name, gender: "Masculino" }),
        Student.countDocuments({ ...entityQuery, category: category.name, gender: "Femenino" }),
        Teachers.countDocuments({ ...entityQuery, category: category.name }),
        addRecursive(category._id)
      ]);
      return { name, male, female, total: male + female, teachers, subs };
    })); */


    const report = [];
    for (const category of categories1) {
      const name = category.name;
      console.log(category._id)
      const male = await Student.countDocuments({ ...entityQuery, category: category.name, gender: "Masculino" })
      const female = await Student.countDocuments({ ...entityQuery, category: category.name, gender: "Femenino" })
      const teachers = await Teachers.countDocuments({ ...entityQuery, category: category.name })
      const subs = await addRecursive(category._id, 1)

      report.push({ name, male, female, total: male + female, teachers, subs });
    }



    const male = await Student.countDocuments({ ...entityQuery, gender: "Masculino" })
    const female = await Student.countDocuments({ ...entityQuery, gender: "Femenino" })
    const teachers = await Teachers.countDocuments({ ...entityQuery })

    return res.status(200).json({ report, general: { f: female, m: male, total: female + male, p: teachers } });
  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
}
export const getDatabase = async (req, res) => {
  try {

    const documents = await Student.find().populate('activityLink');

    //formateo los documentos en un array de arrays para carga mas rapida
    //esto no se esta usando
    const worksheetData = [
      // Header row (optional)
      Object.keys(documents[0] || {})
    ];

    worksheetData.push(...documents.map(doc => {
      return {
        ...doc._doc
      }
    }));

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


    let filename = `Database` + `_${new Date().toISOString().slice(0, 10)}.xlsx`;

    const worksheet = XLSX.utils.json_to_sheet(newdocs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `files/dbs/` + filename, { compression: true });

    res.download(`./files/dbs/${filename}`)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
}

export const getYearlyReport = async (req, res) => {


  try {

    console.log(req.params.entity)

    var entityQuery = {}
    if (req.params.entity != "TODOS") {
      entityQuery = { entity: req.params.entity }
    }


    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthlyData = [];

    for (const month of months) {


      const startDate = new Date();
      startDate.setMonth(months.indexOf(month));
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0); // Start of the day

      const endDate = new Date(startDate);
      endDate.setMonth(months.indexOf(month) + 1);
      endDate.setDate(-1); // Last day of the month
      endDate.setHours(23, 59, 59, 999); // End of the day





      const data = await Student.countDocuments({
        activityDate: {
          $gte: startDate,
          $lte: endDate
        },
        ...entityQuery,
      });


      const femenino = await Student.countDocuments({
        activityDate: {
          $gte: startDate,
          $lte: endDate
        },
        ...entityQuery,
        gender: "Femenino"
      });

      const masculino = await Student.countDocuments({
        activityDate: {
          $gte: startDate,
          $lte: endDate
        },
        ...entityQuery,
        gender: "Masculino"
      });

      monthlyData.push({ month, f: femenino, m: masculino, total: data });

    }

    return res.status(200).json(monthlyData);
  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
}

export const getStateReport = async (req, res) => {
  try {


    var students = await Student.find({ entity: req.params.entity }).populate('activityLink')



    //busco los elementos que no tengo homelocation y le pongo la de la escula por defecto
    for (let i = 0; i < students.length; i++) {
      if (!students[i].homeLocation) {
        /* let school = await Visits.findById(students[i].activityLink.toString()) */

        let school = students[i].activityLink.schools.find((element) => element.name == students[i].school)
        students[i].homeLocation = { state: school.state, municipality: school.municipality, parish: school.parish }
      }
    }

    //obtengo los municipios unicos que se atendieron
    const municipiosUnique = new Set();
    let municipios = []
    for (let i = 0; i < students.length; i++) {
      if (!municipiosUnique.has(students[i].homeLocation.municipality.label)) {
        municipiosUnique.add(students[i].homeLocation.municipality.label)
        municipios.push(students[i].homeLocation.municipality)
      }
    }


    var municipiosAtendidos = [];

    // por cada municipio unico cuento
    municipios.forEach((element) => {
      let count = 0
      let parish = []
      const aux = new Set();
      for (let j = 0; j < students.length; j++) {
        if (students[j].homeLocation.municipality.label == element.label) {
          count++
        }

        //busco las parroquias unicas del municipio
        if (students[j].homeLocation.parish.value.startsWith(element.value)) {
          aux.add(students[j].homeLocation.parish.label)
        }
      }

      let fuck = []

      //por cada parroquia unica cuento
      aux.forEach((item) => {
        let count2 = 0

        for (let j = 0; j < students.length; j++) {
          if (students[j].homeLocation.parish.label == item) {
            count2++
          }
        }

        fuck.push({ name: item, students: count2 })
      })

      //luego agrego el municipio con las parroquias
      municipiosAtendidos.push({ name: element, students: count, parish: fuck })
    })

    //obtengo las parroquia unicas
    /* const parroquias = new Set();
    for (let i = 0; i < students.length; i++) {
      parroquias.add(students[i].homeLocation.parish.label)
    }


    var parroquiasAtendidos = [];

    parroquias.forEach((element) => {
      let count = 0 
      for (let j = 0; j < students.length; j++) {
        if (students[j].homeLocation.parish.label == element) {
          count++
        }
      }

      parroquiasAtendidos.push({ name: element, students: count })
    }) */

    return res.status(200).json({ municipios: municipiosAtendidos, /* parroquias: parroquiasAtendidos */ });

  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
}

export const getRepeatedStudentReport = async (req, res) => {
  try {
    var entityQuery = {}
    if (req.params.entity != "TODOS") {
      entityQuery = { entity: req.params.entity }
    }

    const students = await Student.find({ ...entityQuery })

    const uniqueStudents = new Set();
    const repeated = []

    for (let i = 0; i < students.length; i++) {
      var count = 0
      const key = `${students[i].ci}`;

      for (let j = 0; j < students.length; j++) {
        if ((students[i].ci == students[j].ci)) {
          count++
        }
      }

      if (count > 1 && !uniqueStudents.has(key)) {
        uniqueStudents.add(key)
        repeated.push({ student: students[i], times: count })
      }
    }




    return res.status(200).json(repeated);
  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
}


export const searchStudent = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm

    const students = await Student.find({
      $or: [
        { ci: { $regex: new RegExp(searchTerm, 'i') } },
        { name: { $regex: new RegExp(searchTerm, 'i') } }, // First word of searchTerm in name
        { lastName: { $regex: new RegExp(searchTerm, 'i') } } // Second word or first if only one word in lastName
      ],

    }).populate('activityLink')

    res.status(200).json(students)

  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
}

export const overAllReport = async (req, res) => {
  try {


    const entities = await Entity.find({})

    var report = []
    for (let i = 0; i < entities.length; i++) {
      //agendas expiradas (ya realizadas, sin cargar datos)


      const schedules = await Schedule.countDocuments({ "entity._id": entities[i].id, activityDate: { $lt: new Date() } })

      // la ultima conexion
      const users = await User.find({ entity: entities[i]._id })
      if (users.length > 0) {
        const userlastCon = users.reduce((accumulator, currentObject) => {
          return currentObject.lastConnexion && currentObject.lastConnexion > accumulator.lastConnexion ? currentObject : accumulator;
        });

        const userlastSchedule = users.reduce((accumulator, currentObject) => {
          return currentObject.lastScheduled && currentObject.lastScheduled > accumulator.lastScheduled ? currentObject : accumulator;
        });

        const userlastVisitLoaded = users.reduce((accumulator, currentObject) => {
          return currentObject.lastLoaded && currentObject.lastLoaded > accumulator.lastLoaded ? currentObject : accumulator;
        });


        report.push({
          id: entities[i]._id,
          name: entities[i].name,
          acronim: entities[i].acronim,
          lastCon: userlastCon.lastConnexion,
          lastScheduled: userlastSchedule.lastScheduled,
          lastVisitLoaded: userlastVisitLoaded.lastLoaded,
          expired: schedules,
        })
      } else {
        report.push({
          id: entities[i]._id,
          name: entities[i].name,
          acronim: entities[i].acronim,
          lastCon: null,
          lastScheduled: null,
          lastVisitLoaded: null,
          expired: schedules
        })
      }
    }

    if (req.params.sortBy === "expired") {
      console.log("hello")
      report.sort((a, b) => a.expired - b.expired);
      report.reverse()
    } else if (req.params.sortBy === "lastCon") {
      report.sort((a, b) => a.lastCon - b.lastCon);
    }

    const skip = parseInt(req.params.skip, 10) || 0; // Parse to integer, default to 0
    const limit = parseInt(req.params.limit, 10) || report.length;

    const finalReport = report.slice(skip, skip + limit)



    return res.status(200).json({ documents: finalReport, total: report.length })
  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
}


export const getWeekReport = async (req, res) => {
  try {

  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
}



/* //obtengo todas las subcategorias
var subcategories = [];
for (let i = 0; i < categories.length; i++) {
  for (let j = 0; j < categories[i].subcategories.length; j++) {
    subcategories.push(categories[i].subcategories[j].name);
  }
}

var report = [];

for (let i = 0; i < subcategories.length; i++) {
  var accumulated = { name: subcategories[i], f: 0, m: 0, p: 0, t: 0 };

  //por cada visita con su subcategoria busco el acumulado de la misma
  const visits = await Visits.find({ subActivity: subcategories[i] })
  for (let j = 0; j < visits.length; j++) {

    const femenino = await Student.countDocuments({ ...entityQuery, activityLink: visits[j].id, gender: "Femenino" });
    const masculino = await Student.countDocuments({ ...entityQuery, activityLink: visits[j].id, gender: "Masculino" });
    const profesores = await Teachers.countDocuments({ ...entityQuery, activityLink: visits[j].id });
    const total = await Student.countDocuments({ ...entityQuery, activityLink: visits[j].id });

    accumulated.f += femenino;
    accumulated.m += masculino;
    accumulated.p += profesores;
    accumulated.t += total;

  }

  report.push(accumulated)


}

//acumulado total
const femenino = await Student.countDocuments({ ...entityQuery, gender: "Femenino" });
const masculino = await Student.countDocuments({ ...entityQuery, gender: "Masculino" });
const profesores = await Teachers.countDocuments({ ...entityQuery, });
const total = await Student.countDocuments({ ...entityQuery, }); */