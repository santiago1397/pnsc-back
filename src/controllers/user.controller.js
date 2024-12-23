import User from "../models/User.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {

    if (req.user.role.role <= 3) {
      if (req.user.asigned.length === 0) {
        const users = await User.find({})
        return res.status(200).json(users)
      }

    } else {
      //mostrar usuarios menores en cargo y del mismo ente
      const users = await User.find({"role.role": { $mt: req.user.role.role-1}, "entity.name": req.user.entity.name})
      return res.status(200).json(users)

    }

    res.status(200).json("no puedes ver esta informacion")

  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
}
export const createUser = async (req, res) => {
  try {
    //si el usuario que lo esta creando es menor
    if (req.user.role.role < req.body.role.role) {

      //probablemente validar que lo este creando el mismo ente


      //valida si exite alguien con ese mail
      const uservalidation = await User.find({ email: req.body.email })
      if (uservalidation.length > 0) {
        return res.status(500).json("ya existe un usuario con ese datos");

      }

      const passwordHash = await bcrypt.hash(req.body.password, 10);

      const newuser = new User({
        email: req.body.email,
        name: req.body.name,
        lastName: req.body.lastName,
        role: req.body.role,
        phone: req.body.phone,
        asigned: req.body.asigned,
        entity: req.body.entity,
        password: passwordHash,
      })

      await newuser.save()

      return res.status(202).json("nuevo usuario creado exitosamente");

    }

    return res.status(200).json("no puedes ver este usuario")
  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
}


export const updateUser = async (req, res) => {
  try {
    const objectId = new mongoose.Types.ObjectId(req.params.id);
    const userId = new mongoose.Types.ObjectId(req.body.userId);

    // si se modifica el mismo
    if (req.user.email == req.body.email) {
      if (req.body.password) {
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        await User.findOneAndUpdate(objectId, { $set: { password: passwordHash, role: req.body.role } }, { new: true })
      } else {
        await User.findOneAndUpdate(objectId, { $set: { role: req.body.role } }, { new: true })
      }

      const user = await User.findOneAndUpdate(objectId, { ...req.body, email: req.user.email }, { new: true })
      return res.status(200).json(user)

    }


    // solo puede modificalo alguien con mayor rango 
    if (req.user.role.role < req.body.role.role) {

      //se comprueba si la payload viene con newpassword y se updetea
      if (req.body.password) {
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        await User.findOneAndUpdate(objectId, { $set: { password: passwordHash, role: req.body.role } }, { new: true })
      } else {
        await User.findOneAndUpdate(objectId, { $set: { role: req.body.role } }, { new: true })
      }

      const user = await User.findOneAndUpdate(objectId, { ...req.body }, { new: true })
      return res.status(200).json(user)
    }

    return res.status(200).json("no puedes modificar este usuario")
  } catch (err) {
    return res.status(500).json(err);
  }
}
export const deleteUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id)
    await User.findByIdAndDelete(user.id)

    return res.status(200).json("usuario eliminado")
  } catch (err) {
    return res.status(500).json(err);
  }
}