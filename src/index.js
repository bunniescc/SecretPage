const core = require('@actions/core');
const github = require('@actions/github');

let fs = require('fs');
const src = core.getInput('src');
const dist = core.getInput('dist');

console.log(src);
console.log(dist);

function base64_encode(file) {
    let f = fs.readFileSync(file);
    return f.toString('base64');
}

const checkDirExist = (folderpath) => {
    const pathArr = folderpath.split('/');
    let _path = '';
    for (let i = 0; i < pathArr.length; i++) {
        if (pathArr[i]) {
            _path += `${pathArr[i]}/`;
            if (!fs.existsSync(_path)) {
                fs.mkdirSync(_path);
            }
        }
    }
};

function processDir(dir, parent) {
    fs.readdirSync(parent + dir + '/').forEach(f => {
        if (f.startsWith(".")) return;
        let info = fs.statSync(parent + dir + '/' + f);
        if (info.isDirectory()) {
            processDir(f, parent + dir + '/')
        } else {
            checkDirExist('./' + dist + '/asset/' + parent + dir + '/');
            fs.writeFileSync('./' + dist + '/asset/' + parent + dir + '/' + f + ".spf", base64_encode(parent + dir + '/' + f))
            console.log(parent + dir + '/' + f);
        }
    });
}

processDir('./' + src, '');
