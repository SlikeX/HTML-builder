const fs = require('fs');
const path = require('path');
const readline = require('readline');

let writeStream = fs.createWriteStream(path.join(__dirname, 'test.txt'))
let rl = readline.createInterface(process.stdin,process.stdout);
rl.question("Write smth and I'll save it in test.txt: ", answer =>{
    if(answer.toLowerCase().trim() === 'exit'){
        process.stdout.write('Now you can check file');
        process.exit();
    }
    process.stdout.write("Write smth and I'll save it in test.txt: ")
    writeStream.write(answer+'\n');
})
rl.on('line',line=>{
    if(line.toLowerCase().trim() === 'exit'){
        process.stdout.write('Now you can check file');
        process.exit();
    }
    process.stdout.write("Write smth and I'll save it in test.txt: ")
    writeStream.write(line+'\n');
})