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


    const skip = parseInt(req.params.skip)
    const limit = parseInt(req.params.limit)

    const documents = await Entity.find({}).skip(skip).limit(limit).sort({ name: 1 })
    const total = await Entity.countDocuments()

    return res.status(200).json({ documents, total })

  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}

export const editEntity = async (req, res) => {

  try {
    const result = await Entity.updateOne(
      { _id: req.params.id },
      { $set: { ...req.body } }
    );


    return res.status(200).json("Entidad editada")
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



