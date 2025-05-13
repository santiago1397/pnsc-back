import { Category, Categorylvl1, Categorylvl2, Categorylvl3 } from "../models/Category.js";

export const createCategory = async (req, res) => {

  const categories = [Category, Categorylvl1, Categorylvl2, Categorylvl3]
  const categoriesnames = ["category", "categorylvl1", "categorylvl2", "categorylvl3"]

  const addRecursive = async (previousid, element, step) => {

    if (step > categories.length - 1) {
      return
    }

    var obj = {}
    obj[categoriesnames[step - 1]] = previousid
    obj.name = element.name
    const newstuff = new categories[step](obj);
    await newstuff.save();


    if (element.subs.length == 0) {
      return
    }

    for (let i = 0; i < element.subs.length; i++) {
      await addRecursive(newstuff._id, element.subs[i], step + 1)
    }
  }

  try {
    const newCategory = req.body

    const document = new Category({ name: req.body.name })
    await document.save()

    for (let i = 0; i < req.body.subs.length; i++) {
      await addRecursive(document._id, req.body.subs[i], 1)
    }


    res.status(200).json("creada exitosamente")
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}

export const getCategories = async (req, res) => {
  const categories = [Category, Categorylvl1, Categorylvl2, Categorylvl3];
  const categoriesnames = ["category", "categorylvl1", "categorylvl2", "categorylvl3"];

  const findSubs = async (id, step) => {
    if (step > categories.length - 1) return [];

    const query = {};
    query[categoriesnames[step - 1]] = id;

    var documents = await categories[step].find(query);

    if (documents.length <= 0) return [];

    // Key change: Use map to process all documents and recursively call findSubs
    return Promise.all(documents.map(async (doc) => {
      const subcategories = await findSubs(doc._id, step + 1);
      return { ...doc.toObject(), subs: subcategories }; // Important: Convert to plain object
    }));
  };

  try {

    const activities = await Category.find().skip(req.params.skip).limit(req.params.limit);
    const total = await Category.countDocuments().skip(req.params.skip).limit(req.params.limit);

    const newActivities = await Promise.all(activities.map(async (activity) => {
      const subs = await findSubs(activity._id, 1);
      return { ...activity.toObject(), subs }; // Important: Convert to plain object
    }));

    res.status(200).json({ total, documents: newActivities });
  } catch (err) {
    console.error(err); // Use console.error for errors
    res.status(500).json(err);
  }
};

/* for (const key in updateData) {
  if (updateData.hasOwnProperty(key)) {
      subcategory[key] = updateData[key];
  }
} */


export const deleteCategory = async (req, res) => {
  const categories = [Category, Categorylvl1, Categorylvl2, Categorylvl3]
  const categoriesnames = ["category", "categorylvl1", "categorylvl2", "categorylvl3"]

  const deleteRecursive = async (previousid,  step) => {

    // si estamos buscando fuera del ultimo nivel
    if (step > categories.length - 1) {
      return
    }

    // comprobar si tiene subcategorias
    var obj = {}
    obj[categoriesnames[step - 1]] = previousid
    console.log(obj)
    var subs = await categories[step].find(obj);
    console.log(subs)
    

    // si no tiene subcategorias borrarlo
    if (subs.length == 0) {
      await categories[step-1].findByIdAndDelete(previousid);
      return
    }


    // si tiene subcategorias borrarlas y luego borrar el padre
    for (let i = 0; i < subs.length; i++) {
      await deleteRecursive(subs[i]._id,  step + 1)
    }
    await categories[step-1].findByIdAndDelete(previousid);
  }

  try {
    const newCategory = req.body.id

    const document = await Category.findById(req.params.id)
    await deleteRecursive(document, 1)



    res.status(200).json("creada exitosamente")
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}