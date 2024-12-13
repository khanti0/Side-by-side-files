const express = require('express')
const multer = require('multer')
const path = require('path')
const fs1 = require('fs')
const fs = require('fs').promises
const app = express()
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: fileStorageEngine })
app.use(express.static('dist'))
const cors = require('cors')
app.use(cors())
app.use(express.json())

const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);

app.post('/api/files', upload.single('file'), (request, response) => {
  console.log('noob')
  fs1.readdir('./uploads', (err, files) => {
    if (err) throw err;
    console.log('noob')
    for (const file of files) {
      fs1.unlink(path.join('./uploads', file), (err) => {
        if (err) throw err;
      })
    }
  })

  if(request.file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'){
    
    async function main() {
      const ext = '.pdf'
      const fileNameLength = request.file.originalname.length - 5
      const newFileName = request.file.originalname.substring(0, fileNameLength)
      const inputPath = path.join('./uploads', request.file.originalname);
      const outputPath = path.join('./uploads', `${newFileName}.pdf`);
      // Read file
      const docxBuf = await fs.readFile(inputPath);
      // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
      let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
      // Here in done you have pdf file which you can save or transfer in another stream
      await fs.writeFile(outputPath, pdfBuf);
      await response.sendFile(`${newFileName}.pdf`, { root: 'uploads' });
    }
    
    main().catch(function (err) {
      console.log(`Error converting file: ${err}`);
    });

  } else {
     
  }

})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})