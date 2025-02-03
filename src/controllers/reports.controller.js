import Student from "../models/Student.js";
import Activity from "../models/Activities.js";
import Visits from "../models/Visits.js";
import Teachers from "../models/Teachers.js"
import * as XLSX from 'xlsx'

export const getGeneralReport = async (req, res) => {
  try {
    const categories = await Activity.find();

    var entityQuery = {}
    if (req.params.entity != "todos") {
      entityQuery = { entity: req.params.entity }
    }


    //obtengo todas las subcategorias
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
    const total = await Student.countDocuments({ ...entityQuery, });



    return res.status(200).json({ report, general: { name: total, f: femenino, m: masculino, p: profesores, t: total } });
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
        activity: doc.activityLink.activity.name,
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
    if (req.params.entity != "todos") {
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
    if (req.params.entity != "todos") {
      entityQuery = { entity: req.params.entity }
    }

    const students = await Student.find({ ...entityQuery })

    const uniqueStudents = new Set();
    const repeated = []

    for (let i = 0; i < students.length; i++) {
      var count = 0
      const key = `${students[i].ci}-${students[i].name}`;
      
      for (let j = 0; j < students.length; j++) {
        if ((students[i].ci == students[j].ci) || (students[i].name == students[j].name )) {
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
        { name: { $regex: new RegExp(searchTerm, 'i') } },
        { lastName: { $regex: new RegExp(searchTerm, 'i') } },
        { school: { $regex: new RegExp(searchTerm, 'i') } },
      ]
    }).populate('activityLink')

    res.status(200).json(students)

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
