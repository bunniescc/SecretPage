const core = require('@actions/core');

let fs = require('fs');
const src = core.getInput('src');
const dist = core.getInput('dist');
const password = core.getInput('password');
const root = core.getInput('root');

const SRC = src.endsWith('/') ? src : (src + '/');
const DIST = (dist.endsWith('/') ? dist : (dist + '/')) + 'site_asset/';
const ROOT = root ? root : '/secret/';

console.log('Secret Page Generator');
console.log('src', src, 'dist', dist);
console.log('SRC', SRC, 'DIST', DIST);
console.log('password', password);

function base64_encode(file) {
    let f = fs.readFileSync(file);
    return f.toString('base64');
}

function loadServiceWorker() {
    if (password) {
        let f = fs.readFileSync(__dirname + "/swp.js");
        return `const BASE_DIR = '${ROOT}';` + f.toString();
    } else {
        let f = fs.readFileSync(__dirname + "/sw.js");
        return `const BASE_DIR = '${ROOT}';` + f.toString();
    }
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
        if (f.startsWith('.')) return;
        let info = fs.statSync(SRC + curDir + f);
        if (info.isDirectory()) {
            processDir(f, curDir)
        } else {
            checkDirExist(DIST + curDir);
            fs.writeFileSync(DIST + curDir + f + ".spf", base64_encode(SRC + curDir + f));
            console.log(curDir + f);
        }
    });
}

processDir('', '');
fs.writeFileSync(DIST + '/sw.js', loadServiceWorker());
