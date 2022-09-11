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

function switchModels(chice) {
  switch (chice) {
    case "4k-默认效果":
      return "realesrgan-x4plus";
    case "4k-动画效果":
      return "realesrgan-x4plus-anime";
    default:
      return "realesrgan-x4plus";
  }
}

module.exports = {
  isJpgPng,
  hasSpace,
  switchModels,
};
