import State from '../models/dpt/State.js'
import Municipality from '../models/dpt/Municipality.js'
import Parish from '../models/dpt/Parish.js'

export const getDpt = async (req, res) => {

    console.log(req.body)
    try {
        if (req.body.state) {
            const municipios = await Municipality.find({"value": {"$regex": `^${req.body.state}`} })
            return res.json(municipios)

        } else if(req.body.municipality) {
            const parroquias = await Parish.find({"value": {"$regex": `^${req.body.municipality}`} })
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
