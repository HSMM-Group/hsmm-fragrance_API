
const fs = require("fs");

function uploadImage(){
    const multer = require("multer");
    const imageFilter = (req, file, cb) => {
        if(file.mimetype.startsWith("image")){
            cb(null, true);
        }else{
            cb("Please upload only image", false);
        }
    }
    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./images")
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    })
    return multer({storage:storage, fileFilter:imageFilter});
}

function deleteImg(imgName) {
  fs.unlinkSync("./images/" + imgName);
}

module.exports = {
    uploadImage
};