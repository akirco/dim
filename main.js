"use strict";
const { spawn } = require("node:child_process");
const gradient = require("gradient-string");
const ProgressBar = require("./progress");
const inquirer = require("inquirer");
const slog = require("single-line-log").stdout;
const path = require("path");
const {
  getFileName,
  getFullDir,
  getDesktopPath,
  isJpgPng,
  hasSpace,
} = require("./lib/utils");
inquirer.registerPrompt("fuzzypath", require("inquirer-fuzzy-path"));

const pb = new ProgressBar("处理进度", 0);

const promptList = [
  {
    type: "input",
    name: "input",
    message: "请输入图片地址(可直接拖入):",
  },
  {
    type: "list",
    name: "model",
    message: "请选择处理模式:",
    choices: ["4k-默认效果", "4k-动画效果"],
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

const fuzzypath = {
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

async function start(callback) {
  const res = await inquirer.prompt(promptList);
  if (res.isChangeOutpath) {
    const fuzzy = await inquirer.prompt(fuzzypath);
    res.output = fuzzy.path;
  }
  if (isJpgPng(res.input)) {
    if (hasSpace(res.input)) {
      res.input = res.input.substring(1, res.input.length - 1);
    }
    const data = {
      input: res.input,
      model:
        res.model === "4k-默认效果"
          ? "realesrgan-x4plus"
          : "realesrgan-x4plus-anime",
      format: res.format,
      isChangeOutpath: res.isChangeOutpath,
      output: res.isChangeOutpath ? res.output : res.input,
    };
    console.log(gradient("cyan", "pink")("🔔PS:处理速度取决于GPU!!!"));
    await callback(data);
  } else {
    process.exit();
  }
}

async function exc({ input, isChangeOutpath, output, model, format }) {
  // const rootDir = path.join(process.execPath);
  let rootDir;
  if (process.argv[3] === "dev") {
    rootDir = path.join(__filename);
  } else {
    rootDir = path.join(process.execPath);
  }
  const binPath = path.join(rootDir, "..", "resources");
  const execPath = path.join(binPath, "ncnn");
  const modelsPath = path.join(binPath, "..", "resources", "models");
  //* input 带文件的全路径
  //* output 若修改只是dir
  let outputPath;
  if (isChangeOutpath) {
    //? 修改路径：dir+filename
    outputPath = path.join(output, getFileName(input));
  } else {
    //? 不修改路径：input === output,排除文件后缀+"-clear."+"png/jpg"
    outputPath = getFullDir(output) + "-clear." + format;
  }
  const ncn = spawn(
    execPath,
    ["-i", input, "-o", outputPath, "-s", 4, "-m", modelsPath, "-n", model],
    {
      cwd: null,
      detached: false,
    }
  );
  ncn.stderr.on("data", (data) => {
    data = data.toString();
    if (data.includes("invalid gpu")) {
      slog(gradient("cyan", "pink")("gpu不支持！"));
    } else if (data.includes("failed")) {
      slog(gradient("cyan", "pink")("图像已损坏！请重试！！！"));
    } else if (data.length > 0 && data.length < 10) {
      const num = parseFloat(data.split("%")[0]);
      pb.render({ completed: num, total: 100 });
    }
  });
}

module.exports = {
  start,
  exc,
};
