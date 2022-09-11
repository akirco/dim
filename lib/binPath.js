const path = require("path");
const { getPlatform } = require("./getPlatform");

const rootDir =
  process.argv[3] === "dev"
    ? path.join(__dirname)
    : path.join(process.execPath);

const resPath = path.join(rootDir, "..", "resources");
const execPath = path.join(resPath, getPlatform(), "ncnn");
const modelsPath = path.join(resPath, "models");

module.exports = { execPath, modelsPath };
