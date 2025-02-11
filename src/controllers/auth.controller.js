import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createAccessToken } from "../libs/jwt.js";
import { sendMail } from "../utils/mailer.js"

export const register = async (req, res) => {
  try {
    const { email,
      name,
      lastName,
      password,
      role,
      phone,
      asigned,
      entity,
    } = req.body;

    const userFound = await User.findOne({ email });

    if (userFound)
      return res.status(400).json({
        message: ["El email ya esta en uso"],
      });

    // hashing the password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating the user
    const newUser = new User({
      email,
      name,
      lastName,
      role,
      phone,
      asigned,
      entity,
      password: passwordHash,
    });

    // saving the user in the database
    const userSaved = await newUser.save();


    res.json({
      email,
      name,
      lastName,
      role,
      phone,
      asigned,
      entity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    var userFound = await User.findOne({ email }).populate('entity').populate('role');

    if (!userFound)
      return res.status(400).json({
        message: ["El email no esta registrado"],
      });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      return res.status(400).json({
        message: ["Contraseña incorrecta"],
      });
    }

    console.log(userFound.entity)

    const updatedUser = await User.findOneAndUpdate(
      { email: userFound.email },
      { lastConnexion: new Date() },
      { new: true } // Return the updated document
    );

    const token = await createAccessToken({
      email: userFound.email,
      name: userFound.name,
      lastName: userFound.lastName,
      role: userFound.role,
      phone: userFound.phone,
      asigned: userFound.asigned,
      entity: userFound.entity,
    });

    res.cookie("token", token, {
      /* httpOnly: process.env.NODE_ENV !== "development", */
      secure: true,
      sameSite: "none",
    });

    res.json({
      email: userFound.email,
      name: userFound.name,
      lastName: userFound.lastName,
      role: userFound.role,
      phone: userFound.phone,
      asigned: userFound.asigned,
      entity: userFound.entity,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }

}


export const verify = async (req, res) => {

  try {

    console.log("what?")
    const { token } = req.cookies;
    if (!token) return res.send(false);

    jwt.verify(token, process.env.TOKEN_SECRET || "secret", async (error, user) => {
      if (error) return res.sendStatus(401);

      const userFound = await User.find({ email: user.email }).populate('entity').populate('role');
      if (userFound.length == 0) return res.sendStatus(401);

      const updatedUser = await User.findOneAndUpdate(
        { email: userFound[0].email },
        { lastConnexion: new Date() },
        { new: true } // Return the updated document
      );

      return res.json({
        email: userFound[0].email,
        name: userFound[0].name,
        lastName: userFound[0].lastName,
        role: userFound[0].role,
        phone: userFound[0].phone,
        asigned: userFound[0].asigned,
        entity: userFound[0].entity,
      });
    });
  } catch (error) {
    console.log(error)
  }


};


export const logout = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);

}


// need to check later from here on
export const forgotPassword = async (req, res) => {
  const { email } = req.body

  try {
    const userFound = await User.find({ email: email })

    const token = await createAccessToken({
      id: userFound[0]._id,
      email: userFound[0].email,
    });

    await sendMail(userFound[0].email,
      `${process.env.FRONT_URL}/${userFound[0]._id}/reset-password/${token}`,
      "Para finalizar el proceso de recuperación de contraseña, haz click en el siguiente boton:",
      "Recuperar")
    return res.status(200).json("correo enviado exitosamente")

  } catch (error) {
    return res.status(500).json(error)
  }
}

export const resetPassword = async (req, res) => {
  const { id, token, password } = req.body

  try {
    console.log(id)
    const userFound = await User.findById(id)

    if(userFound){
      const payload = jwt.verify(token, process.env.TOKEN_SECRET || "secret")
  
      userFound.password = await bcrypt.hash(password, 10);
  
      userFound.save()
  
      return res.status(200).json("contraseña cambiada exitosamente")


    }

    return res.status(202).json("no existe usuario")
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}
