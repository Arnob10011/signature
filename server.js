const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const path =require('path')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// * will be changed with the client root url
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})


const storageEngine = multer.diskStorage({
  destination: "./signatureImage",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});


const checkFileType = function (file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|svg/;

  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Only Upload Images!!");
  }
};


const upload = multer({
  storage: storageEngine,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});


// post the signature in signatueImage
app.post('/save-customer-signature', upload.single('signature'), async (req,res) => {
  console.log(req.file)
  // In here , necessary step can be taken to save image in the database 
  // we can auth it.
  res.send({ signature: "signature saved" });
})
