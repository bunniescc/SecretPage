const core = require('@actions/core');
const github = require('@actions/github');

let fs = require('fs');
const src = core.getInput('src');
const dist = core.getInput('dist');

const SRC = src.endsWith('/') ? src : (src + '/');
const DIST = (dist.endsWith('/') ? dist : (dist + '/')) + '_asset/';

console.log('src', src, 'dist', dist);
console.log('SRC', SRC, 'DIST', DIST);

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
    let curDir = parent + dir + '/';
    fs.readdirSync(SRC + curDir).forEach(f => {
        let info = fs.statSync(SRC + curDir + f);
        if (info.isDirectory()) {
            processDir(f, curDir)
        } else {
            checkDirExist(DIST + curDir);
            fs.writeFileSync(DIST + curDir + f + ".txt", base64_encode(SRC + curDir + f));
            console.log(curDir + f);
        }
    });
}

processDir('', '');
