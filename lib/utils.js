const os = require("os");
const path = require("path");

//获取文件名
function getFileName(fullPath) {
  return fullPath.substring(fullPath.lastIndexOf("\\"), fullPath.length);
}

//获取后缀
function getExt(input) {
  let ext;
  const start = input.lastIndexOf(".");
  const end = input.length;
  if (start >= 1) {
    ext = input.substring(start, end);
  }
  return ext;
}

//获取文件全路径
function getFullDir(fullPath) {
  return fullPath.substring(0, fullPath.lastIndexOf("."));
}

function getDesktopPath() {
  return path.join(os.homedir(), "Desktop");
}

function isJpgPng(fullPath) {
  const ext = getExt(fullPath);
  if (
    ext === ".jpg" ||
    ext === ".png" ||
    ext === ".jpg'" ||
    ext === ".png'" ||
    ext === '.jpg"' ||
    ext === '.png"'
  ) {
    return true;
  }
  return false;
}

function hasSpace(fullPath) {
  if (fullPath.indexOf(" ") === -1) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  getExt,
  getFileName,
  getFullDir,
  getDesktopPath,
  isJpgPng,
  hasSpace,
};
