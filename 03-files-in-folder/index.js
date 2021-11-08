const path = require('path');
const fs = require('fs/promises');


let dirPath = path.join(__dirname,'secret-folder');
async function readDir(){
const files = await fs.readdir(dirPath,{
    withFileTypes:true
});
for(const file of files){
    if(file.isFile()){
        const thisFile = await fs.stat(path.join(dirPath,file.name));
        const fileExtension = path.extname(path.join(dirPath,file.name));
        const fileName = path.basename(path.join(dirPath,file.name),fileExtension);
        process.stdout.write(`${fileName} - ${fileExtension} - ${
            thisFile.size/1000
        }kb\n`)
    }
}
}

readDir();