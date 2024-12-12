const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
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

let files = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  }
]

app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const cors = require('cors')

app.use(cors())

app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/api/files', (request, response) => {
  response.json(files)
})

app.post('/api/files', upload.single('file'), (request, response) => {
  
  response.json(request.file)

  fs.readdir(directory, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join('./uploads', file), (err) => {
        if (err) throw err;
      });
    }
  });

})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})