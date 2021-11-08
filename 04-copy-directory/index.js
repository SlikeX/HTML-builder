const fs = require('fs/promises');
const path = require('path');


let src = path.join(__dirname, './files');
let dest = path.join(__dirname, './files-copy');
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
        console.log(srcPath)
        await fs.copyFile(srcPath, destPath);
    }
}
copyFolder();
