import { users } from "./data/users.js";
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import * as XLSX from 'xlsx'
dotenv.config()

try {
    mongoose.connect(process.env.MONGO_URL)
    console.log('Connected to the database')

    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `usuarios.xlsx`, { compression: true });


} catch (error) {

    console.error('Error dropping collection:', error);

} finally {
    mongoose.disconnect()
    console.log('Disconnected from database')
}