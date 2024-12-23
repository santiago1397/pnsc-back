import Entity from "../models/Entity.js";

export const createEntity = async (req, res) => {

  try {
    const entity = new Entity({ ...req.body })
    await entity.save()


    res.status(200).json("ente creada exitosamente")
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}

export const getEntities = async (req, res) => {
  try {

    const entities = await Entity.find({})
    return res.status(200).json(entities)

  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}

// check if maybe need to create endpoint for deleting and create the update one
export const deleteSchool = async (req, res) => {
  try {

    let category = await Category.find({ id: req.params.id })
    await Category.findByIdAndDelete(req.params.id)

    res.status(200).json("category deleted successfully")
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}



