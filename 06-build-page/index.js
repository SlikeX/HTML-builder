const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

const projectPath = path.join(__dirname,'project-dist');
const outputStyle = fs.createWriteStream(path.join(__dirname,'project-dist','style.css'));
const stylePath = path.join(__dirname,'styles');
const assetsPath = path.join(__dirname,'assets');

async function createDir(){
    await fs.promises.mkdir(projectPath,{
        recursive:true
    })
}

async function mergeStyles(){
    const files = await fs.promises.readdir(stylePath,{
        withFileTypes:true
    });
    for(const file of files){
        let fileExt = path.extname(path.join(stylePath,file.name));
        if(fileExt === '.css'){
            const input = fs.createReadStream(path.join(stylePath,file.name));
            input.pipe(outputStyle);
        }
    }
}

async function getFileData(file) {
    let stream = fs.createReadStream(file);
    stream.setEncoding('utf8');
    let data = '';
    for await (const chunk of stream) {
      data += chunk;
    }
    return data;
  }
  
  async function generateHtml() {
    let outputStream = fs.createWriteStream(
      path.resolve(projectPath, 'index.html')
    );
    let stream = fs.createReadStream(path.resolve(__dirname, 'template.html'));
    const TransformTemplate = new Transform({
      async transform(chunk) {
        const regexp = /{{(.*)}}/g;
        const replacement = [...chunk.toString().matchAll(regexp)];
  
        const results = await Promise.all(
          replacement.reduce((acc, elem) => {
            acc.push(
              (async (elem) => {
                let html = await getFileData(
                  path.resolve(__dirname,'components', elem[1] + '.html')
                );
                return { placeholder: elem[0], html: html };
              })(elem)
            );
            return acc;
          }, [])
        );
        let html = chunk.toString();
        results.forEach((result) => {
          html = html.replace(result.placeholder, result.html);
        });
        this.push(html);
      },
    });
  
    stream.pipe(TransformTemplate).pipe(outputStream);
}
  
async function copyDir(input, output) {
await fs.promises.rm(output, { 
    recursive: true,
    force: true });
await fs.promises.mkdir(output, {
    recursive: true
});
  const files = await fs.promises.readdir(input);
  for (const file of files) {
    fs.stat(path.resolve(input, file), (err,stats) => {
    if (!stats.isDirectory()) {
        fs.promises.copyFile(
        path.join(input, file),
        path.join(output, file)
        );
        } else {
          copyDir(
          path.resolve(input, file),
          path.resolve(output, file)
        );
        }
    });
  }
}
  
async function copyAssets() {
await copyDir(
    assetsPath,
    path.resolve(projectPath,'assets')
);
}
 



(async () => {
await createDir();
mergeStyles();
generateHtml();
copyAssets();
  })();