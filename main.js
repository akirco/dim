"use strict";
const { spawn } = require("node:child_process");
const gradient = require("gradient-string");
const ProgressBar = require("./lib/progress");
const inquirer = require("inquirer");
const slog = require("single-line-log").stdout;
const { execPath, modelsPath } = require("./lib/binPath");
const { execPrompt, basePrompt, pathPrompt } = require("./lib/prompts");
const { getFileName, getFullDir, removeQuote } = require("./lib/pathFixes");
const { isJpgPng } = require("./lib/fileUtils");
const { join } = require("node:path");
inquirer.registerPrompt("fuzzypath", require("inquirer-fuzzy-path"));

const pb = new ProgressBar("处理进度", 0);

async function start(callback) {
  const execRes = await inquirer.prompt(execPrompt);
  let models = [];
  if (execRes.exec === "realesrgan-ncnn-vulkan") {
    models = [
      "realesrgan-x4plus-anime",
      "realesrgan-x4plus",
      "remacri",
      "ultramix_balanced",
      "ultrasharp",
    ];
  } else {
    models = ["models-DF2K", "models-DF2K_JPEG"];
  }
  basePrompt[0].choices = models;
  const res = await inquirer.prompt(basePrompt);
  if (res.isChangeOutpath) {
    const fuzzy = await inquirer.prompt(pathPrompt);
    res.output = fuzzy.path;
  }
  const inputPath = removeQuote(res.input);
  if (isJpgPng(inputPath)) {
    const data = {
      exec: execRes.exec,
      input: inputPath,
      model: res.model,
      format: res.format,
      isChangeOutpath: res.isChangeOutpath,
      output: res.isChangeOutpath ? res.output : inputPath,
    };
    console.log(
      gradient("cyan", "pink")("PS:处理速度取决于GPU以及图片大小!!!")
    );
    await callback(data);
  } else {
    process.exit();
  }
}

async function exec({ exec, input, isChangeOutpath, output, model, format }) {
  console.log({ exec, input, isChangeOutpath, output, model, format });
  let outputPath, ncn;
  if (isChangeOutpath) {
    //? 修改路径：dir+filename
    outputPath = output + getFileName(input);
  } else {
    //? 不修改路径：input === output,排除文件后缀+"-clear."+"png/jpg"
    outputPath = getFullDir(output) + "-clear." + format;
  }
  const upscaleExec = join(execPath, exec);
  if (exec === "realesrgan-ncnn-vulkan") {
    console.log("fullDir:", outputPath);
    ncn = spawn(
      upscaleExec,
      ["-i", input, "-o", outputPath, "-s", 4, "-m", modelsPath, "-n", model],
      {
        cwd: null,
        detached: false,
      }
    );
  } else {
    console.log("fullDir:", outputPath);
    ncn = spawn(
      upscaleExec,
      [
        "-i",
        input,
        "-o",
        outputPath,
        "-s",
        4,
        "-x",
        "-m",
        modelsPath + "\\" + model,
      ],
      {
        cwd: undefined,
        detached: false,
      }
    );
  }
  console.log(ncn);

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
