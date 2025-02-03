import State from '../models/dpt/State.js'
import Municipality from '../models/dpt/Municipality.js'
import Parish from '../models/dpt/Parish.js'

export const getDpt = async (req, res) => {

  console.log(req.body)
  try {
    if (req.body.state) {
      const municipios = await Municipality.find({ "value": { "$regex": `^${req.body.state}` } })
      return res.json(municipios)

    } else if (req.body.municipality) {
      const parroquias = await Parish.find({ "value": { "$regex": `^${req.body.municipality}` } })
      return res.json(parroquias)

    } else {
      const estados = await State.find({})
      return res.json(estados)
    }




    return res.json("hello")
  } catch (err) {
    res.status(500).json(err);
  }
}


export const validateDpt = async (req, res) => {
  try {
    const estado = req.body.state
    const municipio = req.body.municipality
    const parroquia = req.body.parish

    const estados = await State.find({ label: { $regex: new RegExp(estado, 'i') } })
    const municipios = await Municipality.find({ label: { $regex: new RegExp(municipio, 'i') } })
    const parroquias = await Parish.find({ label: { $regex: new RegExp(parroquia, 'i') } })

    if ((estados.length > 0 && estados.length > 0 && estados.length > 0) && 
        (parroquias[0].value.startsWith(municipios[0].value) && municipios[0].value.startsWith(estados[0].value))){

      return res.status(200).json({estado: estados[0],municipio: municipios[0], parroquia: parroquias[0]})
    }

    return res.status(202).json(false)


  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }

}
