const { getExt } = require("./pathFixes");

function isJpgPng(fullPath) {
  const ext = getExt(fullPath);
  if (ext === ".jpg" || ext === ".png") {
    return true;
  }
  return false;
}
// 这个判断方法移除
function hasSpace(fullPath) {
  if (fullPath.indexOf(" ") === -1) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  isJpgPng,
  hasSpace,
};
