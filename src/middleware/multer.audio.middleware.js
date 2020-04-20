const multer = require("multer");
const path = require("path");
const uuid = require("uuid/v4");

const storage = multer.diskStorage({
    destination: path.join(__dirname,'../public/music'),
    filename: (req,res,cb) =>{
        cb(null, uuid()+path.extname(res.originalname).toLowerCase());
    }
})

const upload = multer({
    storage:storage,
    dest: path.join(__dirname, '../public/music'),
    limits:{fields:2, files:1, part:2 ,fileSize:12000000},
    fileFilter:(req,file,cb) =>{
        const filetypes = 'mp3|mkv|mpeg';
        const mimetype = (file.mimetype).includes("audio");
        const extname = 
            filetypes.includes(path.extname(file.originalname).slice(1));
        if(mimetype  && extname){
            return cb(null, true);
        }
        cb("Error: Formato de track no soportado");
    }
}).single("track");

module.exports={
    upload
}