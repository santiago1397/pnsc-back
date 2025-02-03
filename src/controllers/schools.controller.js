import Schools from "../models/Schools.js";

export const createSchool = async (req, res) => {

  try {
    const newSchool = new Schools({ ...req.body })
    await newSchool.save()


    res.status(200).json("escuela creada exitosamente")
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}

export const getSchools = async (req, res) => {
  try {

    const documents = await Schools.find({
      "parish.label": { $regex: new RegExp(substring, 'i') }, // 'i' flag for case-insensitivity
    });

    console.log(documents)

    return res.status(200).json(schools)

  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}

// need to create the one that fetchs all schools and one to delete them
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



