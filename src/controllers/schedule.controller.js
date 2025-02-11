import Schedule from "../models/Schedule.js";
import Entity from "../models/Entity.js"
import User from "../models/User.js";
import puppeteer from "puppeteer";
import { DateTime } from "luxon";
import fs from "fs"

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

export const generatePDF = async (req, res) => {
  try {
    console.log("hello?")
    const data = await Schedule.find({ "entity.name": req.params.entity })

    console.log(data)
    const browser = await puppeteer.launch(); // { headless: false } for debugging
    const page = await browser.newPage();


    console.log(data[0].activityDate.toString())

    const date = DateTime.fromISO(data[0].activityDate.toISOString());

    // Format the date as desired
    const formattedDate = date.toFormat('dd-MM-yyyy');

    console.log(formattedDate); // Output: 2025-01-29 00:00:00




    let tableHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>

            <h2>Reporte Actividades Agendadas ${req.params.entity} </h2>
            <table>
              <thead>
                <tr>
                  <th>Nombre de la actividad</th>
                  <th>Fecha que se planificada</th>
                  <th>Profesores esperados</th>
                  <th>Studiantes esperados</th>
                </tr>
              </thead>
              <tbody>
        `;

    data.forEach(item => {
      tableHTML += `
                <tr>
                  <td>${item.activityName}</td>
                  <td>${DateTime.fromISO(data[0].activityDate.toISOString()).toFormat('dd-MM-yyyy')}</td>
                  <td>${item.teachersExpected}</td>
                  <td>${item.studentSpected}</td>
                </tr>
              `;
    });

    tableHTML += `
              </tbody>
            </table>
          </body>
          </html>
        `;


    const folder = `files/routes/${req.params.entity}/pdfs`
    var filename = `files/routes/${req.params.entity}/pdfs/${new Date()}-${req.params.entity}.pdf`;
    fs.mkdirSync(folder, { recursive: true })

    await page.setContent(tableHTML); // Set the HTML content of the page

    await page.pdf({ path: `files/routes/${req.params.entity}/pdfs/table.pdf`, format: 'Letter' }); // Save as table.pdf

    await browser.close();
    console.log('PDF generated successfully!');

    res.download(`files/routes/${req.params.entity}/pdfs/table.pdf`)
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



