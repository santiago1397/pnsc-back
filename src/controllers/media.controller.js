import fs from 'fs'
import multer from 'multer'
import path from 'path'


export const downloadFile = (req, res) => {
    res.download(`./files/formato_carga_pnsc.xlsx`)
}

export const downloadImage = (req, res) => {
    res.download(`./files/routes/${req.params.entity}/${req.params.fileName}`)
}

export const uploadImage = (req, res) => {
    const { buffer, originalname } = req.file;
    const { name } = req.body;

    console.log(buffer)

    console.log(req.user.entity.name)
    const path = `./files/routes/${req.user.entity.name}`
    fs.mkdirSync(path, { recursive: true })

    const writeStream = fs.createWriteStream(`${path}/${name}`, { flags: 'a' });
    writeStream.write(buffer);
    writeStream.end();

    writeStream.on('finish', () => {
        res.status(200).send('File received successfully.');
    });

    // Event listener for any errors during the write operation
    writeStream.on('error', (err) => {
        console.error(err);
        res.status(500).send('Internal Server Error');
    });
}

