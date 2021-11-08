const {promises: fs} = require('fs');
const path = require('path');


async function copyFolder(src, dest){
    await fs.mkdir(dest, {recursive:true});
    let inner = await fs.readdir(src, {withFileTypes:true});
    for (let entry of inner){
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);
        if(entry.isDirectory()){
            await copyFolder(srcPath, destPath);
        }
        await fs.copyFile(srcPath, destPath);
    }
}
copyFolder(path.join(__dirname, './files'), path.join(__dirname, './files-copy'));
