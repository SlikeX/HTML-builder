const fs = require('fs/promises');
const path = require('path');

const src = path.join(__dirname, './files');
const dest = path.join(__dirname, './files-copy');

async function copyFolder(){
    await fs.mkdir(dest, {
        recursive:true
    });
    let files = await fs.readdir(src, {
        withFileTypes:true
    });
    for (let file of files){
        let srcPath = path.join(src, file.name);
        let destPath = path.join(dest, file.name);
        if(file.isDirectory()){
            await copyFolder(srcPath, destPath);
        }
        await fs.copyFile(srcPath, destPath);
    }
}
copyFolder();
