import Student from "../models/Student.js";
import Activity from "../models/Activities.js";
import Visits from "../models/Visits.js";
import * as XLSX from 'xlsx'

export const getGeneralReport = async (req, res) => {
  try {
    const categories = await Activity.find();
    var subcategories = [];

    for (let i = 0; i < categories.length; i++) {
      for (let j = 0; j < categories[i].subcategories.length; j++) {
        subcategories.push(categories[i].subcategories[j].name);
      }
    }

    var report = [];

    for (let i = 0; i < subcategories.length; i++) {
      var accumulated = { name: subcategories[i], f: 0, m: 0, t: 0 };
      const visits = await Visits.find({ subActivity: subcategories[i] })

      for (let j = 0; j < visits.length; j++) {

        const femenino = await Student.countDocuments({ activityLink: visits[j].id, gender: "Femenino" });
        const masculino = await Student.countDocuments({ activityLink: visits[j].id, gender: "Masculino" });
        const total = await Student.countDocuments({ activityLink: visits[j].id });

        accumulated.f += femenino;
        accumulated.m += masculino;
        accumulated.t += total;

      }

      report.push(accumulated)


    }

    const femenino = await Student.countDocuments({ gender: "Femenino" });
    const masculino = await Student.countDocuments({ gender: "Masculino" });
    const total = await Student.countDocuments({});



    return res.status(200).json({ report, general: { name: total, f: femenino, m: masculino, t: total } });
  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
}
export const getDatabase = async (req, res) => {
  try {

    const documents = await Student.find().populate('activityLink');


    const worksheetData = [
      // Header row (optional)
      Object.keys(documents[0] || {})
    ];

    console.log(documents)

    // Add data rows
    worksheetData.push(...documents.map(doc => {
      return {
        ...doc._doc
      }
    }));

    const newdocs = documents.map(doc => {
      return {
        id: doc.id,
        ...doc._doc,
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
    XLSX.writeFile(workbook,`files/dbs/`+ filename, { compression: true });

    res.download(`./files/dbs/${filename}`)
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
