const fs = require("fs");
const path = require("path");
const enigma = require('enigma-code');//llama el modulo 
const config = require("../bin/config")

const {exits,getTracksJSON,SearchImage,} = require("../bin/spotify.api");

exports.getTracks = (req,res) =>{
    try {
        if(exits('tracks.json')){
            getTracksJSON('tracks.json',(_,tracks)=>{
                if(_) return res.json({error:_})
                res.json(JSON.parse(tracks));
            });
        }else{
            return res.json({error:'file dont exist'});
        }
        
    } catch (error) {
        return res.json({error});
    }
}

exports.deleteTrack = (req,res) =>{
    try {
        const id = req.params.id;
        const pathFile = `${path.dirname(__dirname)}/public/music/${id}`;
    
        if(!exits(pathFile))return res.json({error:'file dont exist'});
    
        fs.unlink(pathFile,(err)=>{
            if(err) return console.log("Error al eliminar archivo");
            res.json({result:"Archivo fue borrado"});
        });
        
    } catch (error) {
        return res.json({error});
    }
}

exports.uploadTrack = async (req,res) =>{       
    try{
        console.log(req.body)
        req.file.nameInput = req.body.name;
        req.file.author=req.body.author;

        await SearchImage(req);
        if(exits('tracks.json')){
            getTracksJSON('tracks.json',(_,buffer)=>{
                if(_) return res.json({error:_})
                obj = JSON.parse(buffer);
                obj.tracks.push(req.file);
                json = JSON.stringify(obj);
                fs.writeFile('tracks.json', json, 'utf8', () => {});
            });
        }else{
            const object = {tracks:[req.file]};
            fs.writeFile('tracks.json', JSON.stringify(object) , 'utf8', () => {});
        }
        res.json({file:req.body.name, filename:req.file ,result:"the file was saved"})
    }catch(error){
        console.log(error)
        res.json({error})
    }
    
}

exports.getTrack = (req,res) =>{
    const id = req.params.id;
    const pathFile = `${path.dirname(__dirname)}/public/music/${id}`;

    if(!exits(pathFile)) return res.json({error:'file dont exist'}); 
    
    const stat = fs.statSync(pathFile)
	const fileSize = stat.size
    const range = req.headers.range
    console.log(range);
    if (range) {
		const parts = range.replace(/bytes=/, "").split("-")
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1
		const chunksize = (end-start)+1
		const file = fs.createReadStream(pathFile, {start, end})
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'audio/mp3',
		}
		res.writeHead(206, head)
		file.pipe(res)
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'audio/mp3',
		}
		res.writeHead(200, head)
		fs.createReadStream(pathFile).pipe(res)
	}
}