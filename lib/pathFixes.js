const os = require("os");
const path = require("path");
const { getPlatform } = require("./getPlatform");

//获取文件名
function getFileName(fullPath) {
  const flag = getPlatform() === "win" ? "\\" : "/";
  return fullPath.substring(fullPath.lastIndexOf(flag), fullPath.length);
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

function trim(str) {
  return str.replace(/^\s+|\s+$/g, "");
}

// remove path quote

function removeQuote(fullPath) {
  fullPath = trim(fullPath);
  const len = fullPath.length;
  if (
    (fullPath[0] === "'" && fullPath[len - 1] === "'") ||
    (fullPath[0] === '"' && fullPath[len - 1] === '"')
  ) {
    return fullPath.substring(1, len - 1);
  } else {
    return fullPath;
  }
}

module.exports = {
  getExt,
  getFileName,
  getFullDir,
  getDesktopPath,
  removeQuote,
};
