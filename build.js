const { spawnSync } = require("child_process");
const _7z = require("7zip-min");
const fs = require("fs");

function build() {
  for (const dir of ["dim-linux", "dim-macos", "dim-win"]) {
    spawnSync("mkdir", [`./dist/${dir}/resources`]);
    spawnSync("cp", ["-r", "./resources/models", `./dist/${dir}/resources`]);
    spawnSync("cp", [
      "-r",
      `./resources/${dir.split("-")[1]}`,
      `./dist/${dir}/resources`,
    ]);
    setTimeout(() => {
      if (fs.existsSync(`./dist/${dir}`)) {
        _7z.pack(`./dist/${dir}`, `${dir}.7z`, (error, res) => {
          // console.log(error, res);
        });
      } else {
        return;
      }
    }, 3000);
  }
}

build();
