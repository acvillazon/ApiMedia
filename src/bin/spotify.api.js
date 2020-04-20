const fs = require("fs");
const request = require("request");

exits = (name) => fs.existsSync(name);
getTracksJSON = (name, cb) => fs.readFile(name,(err,data)=>{cb(err,data)});

getTokenSpotify = () =>{
    let rejectOut;
    try {
        return new Promise((resolve,reject)=>{
            rejectOut=reject;
            request.post('https://accounts.spotify.com/api/token',
            { form:
                {   grant_type:'client_credentials',
                    client_id:'9372087c65ff448fbb0c9288e550cd4d',
                    client_secret:'965a5df1b77b4872951bddf3d2365165'
                }
            },(err,respo)=> {
                process.env.API_TOKEN=respo.body;
                resolve(respo.body)
            });
        });
        
    } catch (error) {
        rejectOut()
    }
}

getTokenIMG = (name,type,token) =>{
    let rejectOut;
    try {
        return new Promise((resolve,reject)=>{
            rejectOut=reject;
            request.get(`https://api.spotify.com/v1/search?q=${name}&type=${type}`,
            { headers:{'Authorization':`Bearer ${token}`}},
            (err,respo)=> {
                
                if(err){
                    getTokenSpotify();
                    resolve({error:500});
                }

                resolve(respo.body)
            });
        });
        
    } catch (error) {
        rejectOut(error)
    }
}

SearchImage = async (req)=>{

    const data = process.env.API_TOKEN || await getTokenSpotify();
    const dataJSON = JSON.parse(data);
    const token = dataJSON['access_token'];

    const dataIMG = await getTokenIMG(req.body.name, 'track',token);
    if(dataIMG.error){
        dataIMG = await getTokenIMG(req.body.name, 'track',token);
    }
    
    const dataIMGJSON = JSON.parse(dataIMG);
    let imgs=null;
    let i=0;

    while(imgs==null){
        const img = dataIMGJSON.tracks.items[i];
        const nameApi = img.album.name.toLowerCase();
        const name = req.body.name.toLowerCase();
        const artists = img.artists;
        const artist = req.body.author.toLowerCase();

        artists.map(data =>{
            const nameArtist = data.name.toLowerCase();
            if(nameArtist.includes(artist)){
                imgs=img.album.images;
            }
        })

        if(nameApi.includes(name) && imgs==null){imgs=img.album.images}
        if(dataIMGJSON.tracks.items.length<(i+2)){
            imgs=[{}];
        }
        i++;
    }

    imgs.length>1?req.file.img=imgs[1]:req.file.img=imgs[0];
}

module.exports={
    exits, getTracksJSON, getTokenIMG, SearchImage
}