"use strict";
const { spawn } = require("node:child_process");
const gradient = require("gradient-string");

const ProgressBar = require("./lib/progress");
const inquirer = require("inquirer");
const slog = require("single-line-log").stdout;
const { execPath, modelsPath } = require("./lib/binPath");
const { basePrompt, pathPrompt } = require("./lib/prompts");
const { getFileName, getFullDir, removeQuote } = require("./lib/pathFixes");
const { isJpgPng, switchModels } = require("./lib/fileUtils");
inquirer.registerPrompt("fuzzypath", require("inquirer-fuzzy-path"));

const pb = new ProgressBar("处理进度", 0);

async function start(callback) {
  const res = await inquirer.prompt(basePrompt);
  if (res.isChangeOutpath) {
    const fuzzy = await inquirer.prompt(pathPrompt);
    res.output = fuzzy.path;
  }
  const inputPath = removeQuote(res.input);
  if (isJpgPng(inputPath)) {
    const data = {
      input: inputPath,
      model: switchModels(res.model),
      format: res.format,
      isChangeOutpath: res.isChangeOutpath,
      output: res.isChangeOutpath ? res.output : inputPath,
    };
    console.log(
      gradient("cyan", "pink")("🔔PS:处理速度取决于GPU以及图片大小!!!")
    );
    await callback(data);
  } else {
    process.exit();
  }
}

async function exec({ input, isChangeOutpath, output, model, format }) {
  let outputPath;
  if (isChangeOutpath) {
    //? 修改路径：dir+filename
    outputPath = output + getFileName(input);
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
      slog(
        gradient(
          "cyan",
          "pink",
          "red"
        )("图片已损坏！请重试！或「去除文件名中的特殊符号」后重试！")
      );
    } else if (data.length > 0 && data.length < 10) {
      const num = parseFloat(data.split("%")[0]);
      pb.render({ completed: num, total: 100 });
    }
  });
}

module.exports = {
  start,
  exec,
};
