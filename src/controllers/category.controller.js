import Category from "../models/Category.js";

export const createCategory = async (req, res) => {

  try {
    /* checks if there is a institution already named the same way*/
    const val = await Category.find({ name: req.body.name })

    if (val.length == 0) {
      const newCategory = new Category({
        name: req.body.name
      })
      await newCategory.save()
    }


    res.status(200).json("creada exitosamente")
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}

export const getCategories = async (req, res) => {
  try {

    const categories = await Category.find({}).sort({ createdAt: -1 })
    return res.status(200).json(categories)

  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}

// check later if its working
export const deleteCategory = async (req, res) => {
  try {

    let category = await Category.find({ id: req.params.id })
    await Category.findByIdAndDelete(req.params.id)

    res.status(200).json("category deleted successfully")
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

export const updateObservation = async (req, res) => {
  const { observation } = req.body

  try {
    var note = await Notes.findById(req.params.id)
    note.tutorObservations = observation
    note.save()

    res.status(200).json("note checked field changed")
  } catch (error) {
    res.status(500).json(error)
  }
}


