import Activities from "../models/Activities.js";
import Category from "../models/Category.js";
import Role from "../models/Role.js"
import User from "../models/User.js";
import Entity from "../models/Entity.js";
import State from "../models/dpt/State.js";
import Municipality from "../models/dpt/Municipality.js";
import Parish from "../models/dpt/Parish.js";
import Schedule from "../models/Schedule.js";
import Visits from "../models/Visits.js";
import Students from "../models/Student.js";
import Teachers from "../models/Teachers.js"
import { States } from "./data/dpt/estados.js"
import { Parishes } from "./data/dpt/parish.js"
import { Municipalities } from "./data/dpt/municipaly.js"
import { ActivitiesSeed } from "./data/activities.js";
import { Categories } from "./data/categories.js";
import { Entes } from "./data/entes.js";
import { Roles } from "./data/roles.js";
import { users } from "./data/users.js";
import { users_presidents } from "./data/users_presidents.js";
import mongoose from 'mongoose'
import bcrypt from "bcryptjs";
import dotenv from 'dotenv'

dotenv.config()

try {
  mongoose.connect(process.env.MONGO_URL)
  console.log('Connected to the database')

  //borro todas las colecciones
  await Activities.deleteMany({})
  await Category.deleteMany({})
  await Role.deleteMany({})
  await User.deleteMany({})
  await Entity.deleteMany({})
  await State.deleteMany({})
  await Municipality.deleteMany({})
  await Parish.deleteMany({})
  await Visits.deleteMany({})
  await Schedule.deleteMany({})
  await Students.deleteMany({})
  await Teachers.deleteMany()

  console.log('Collections reset successfully (all documents deleted)!')

  //inserto los datos
  await Activities.insertMany(ActivitiesSeed)
  await Category.insertMany(Categories)
  await State.insertMany(States)
  await Municipality.insertMany(Municipalities)
  await Parish.insertMany(Parishes)
  const roles = await Role.insertMany(Roles)
  const entities = await Entity.insertMany(Entes)

  //we add superusers
  for (let i = 0; i < users.length; i++) {
    const passwordHash = await bcrypt.hash(users[i].password, 10);

    const userEntity = entities.find((item) => item.name === users[i].entity)

    var userRole = ""

    if (users[i].role === "ROOT") {
      userRole = roles.find((item) => item.role === 1)
    } else if (users[i].role === "Delegado") {
      userRole = roles.find((item) => item.role === 5)
    } else if (users[i].role === "supervisor") {
      userRole = roles.find((item) => item.role === 2)
    } else if (users[i].role === "Presidente") {
      userRole = roles.find((item) => item.role === 4)
    }

    if (!userEntity) {
      console.error(`Entity not found for user ${users[i].name}: ${users[i].entity}`);
      throw new Error(`Entity not found...`); // To stop execution
    }

    if (!userRole) {
      console.error(`Role not found for user ${users[i].name}: ${users[i].role}`); // Corrected: users[i].role
      throw new Error(`Role not found...`); // To stop execution
    }

    const user = await User({
      ...users[i],
      password: passwordHash,
      entity: userEntity._id,
      role: userRole._id
    }).save()
  }

  //we add presidents of entities users
  /* for (let i = 0; i < users_presidents.length; i++) {
    const passwordHash = await bcrypt.hash(users[i].password, 10);

    const entities = await Entity.find({ name: users_presidents[i].entity.name })
    const roles = await Role.find({ role: 4 })

    const user = await User({
      ...users_presidents[i],
      password: passwordHash,
      entity: entities[0]._id,
      role: roles[0]._id
    }).save()
  } */

} catch (error) {

  console.error('Error dropping collection:', error);

} finally {
  mongoose.disconnect()
  console.log('Disconnected from database')
}