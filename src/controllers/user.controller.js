import User from "../models/User.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Role from "../models/Role.js";

export const getUsers = async (req, res) => {
  try {

    var entityQuery = {}
    if (req.query.entity && req.query.entity != "TODOS") {
      entityQuery = { entity: req.query.entity }
    }

    const skip = parseInt(req.params.skip)
    const limit = parseInt(req.params.limit)

    if (req.user.role.role <= 3) {
      if (req.user.asigned.length === 0) {
        const total = await User.countDocuments({...entityQuery})
        const documents = await User.find({...entityQuery})
          .populate('entity')
          .populate('role')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
        return res.status(200).json({documents, total})
      }

    } else {

      //mostrar usuarios menores en cargo y del mismo ente
      const total = await User.countDocuments({
        email: { $ne: req.user.email },
        "role.role": { $gte: 4 },
        "entity": req.user.entity._id
      }).populate('role')

      const users = await User.aggregate([
        {
          $lookup: {
            from: "roles",
            localField: "role",
            foreignField: "_id",
            as: "roleInfo"
          }
        },
        {
          $unwind: "$roleInfo"
        },
        {
          $match: {
            "roleInfo.role": { $gte: req.user.role.role },
          }
        },
        {
          $project: {
            _id: 1,
            email: 1,
            name: 1,
            lastName: 1,
            // ... other fields
            roleValue: "$roleInfo.role",  // Renamed to roleValue to avoid confusion
            entity: 1,
            createdAt: 1,
            updatedAt: 1
          }
        }
      ]);
      
      console.log(users);

      const documents = await User
        .find({
          email: { $ne: req.user.email },
          "role.role": { $gte: parseInt(req.user.role.role) - 1 },
          "entity": req.user.entity._id
        })
        .populate('entity')
        .populate('role')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })

      console.log(total)
      console.log(documents)
      return res.status(200).json({documents, total})

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
    if (req.user.role.role < req.body.role.role || req.user.role.role == 1) {

      //probablemente validar que lo este creando el mismo ente


      //valida si exite alguien con ese mail
      const uservalidation = await User.find({ email: req.body.email }).populate('entity')
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
        await User.updateOne(
          { _id: req.params.id },
          { $set: { ...req.body, password: passwordHash } }
        );
      } else {
        const { password, ...updateData } = req.body
        await User.updateOne(
          { _id: req.params.id },
          { $set: { ...updateData } }
        );
      }

      return res.status(200).json("usuario modificado")
    }


    // solo puede modificalo alguien con mayor rango 
    const role = await Role.findById(req.body.role)
    if (req.user.role.role < role.role) {


      //se comprueba si la payload viene con newpassword y se updetea
      if (req.body.password) {
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        await User.updateOne(
          { _id: req.params.id },
          { $set: { ...req.body, password: passwordHash } }
        );

      } else {
        const { password, ...updateData } = req.body
        await User.updateOne(
          { _id: req.params.id },
          { $set: { ...updateData } }
        );
      }

      return res.status(200).json("usuario modificado")
    }

    return res.status(200).json("no puedes modificar este usuario")
  } catch (err) {
    console.log(err)
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