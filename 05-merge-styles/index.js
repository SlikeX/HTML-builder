const fsProm = require('fs/promises');
const fs = require('fs')
const path = require('path');

const outputPath = path.join(__dirname,'project-dist','bundle.css')
const output = fs.createWriteStream(outputPath);
const dirPath = path.join(__dirname,'styles');


async function readDir(){
    const files = await fsProm.readdir(dirPath,{
        withFileTypes:true
    });
    for(const file of files){
        let fileExt = path.extname(path.join(dirPath,file.name));
        if(fileExt === '.css'){
            const input = fs.createReadStream(path.join(dirPath,file.name));
            input.pipe(output);
        }
    }
}

readDir();