export const downloadFile = (req, res) => {

    res.download(`./files/formato_carga_pnsc.xlsx`)
}