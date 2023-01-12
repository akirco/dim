const { getDesktopPath } = require("./pathFixes");
const execPrompt = [
  {
    type: "list",
    name: "exec",
    message: "请选择处理程序:",
    choices: ["realesrgan-ncnn-vulkan", "realsr-ncnn-vulkan"],
  },
];

const basePrompt = [
  {
    type: "list",
    name: "model",
    message: "请选择处理模式:",
    choices: [],
  },
  {
    type: "input",
    name: "input",
    message: "请输入图片地址(可直接拖入):",
  },
  {
    type: "list",
    name: "format",
    message: "请选择图片输出格式:",
    choices: ["png", "jpg"],
  },
  {
    type: "confirm",
    name: "isChangeOutpath",
    message: "是否更改文件输出路径:",
    list: ["yes", "no"],
    default: false,
  },
];
const pathPrompt = {
  type: "fuzzypath",
  name: "path",
  excludePath: (nodePath) => nodePath.startsWith("node_modules"),
  excludeFilter: (nodePath) => nodePath == ".",
  itemType: "directory",
  rootPath: getDesktopPath(),
  message: "请选择文件输出路径:",
  default: getDesktopPath(),
  suggestOnly: true,
  depthLimit: 3,
};

module.exports = { execPrompt, basePrompt, pathPrompt };
