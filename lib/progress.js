const slog = require("single-line-log").stdout;
const gradient = require("gradient-string");

class ProgressBar {
  constructor(description, bar_length) {
    this.description = description || "Progress"; // 命令行开头的文字信息

    this.length = bar_length || 25; // 进度条的长度(单位：字符)，默认设为 25
  }
  // 刷新进度条图案、文字的方法
  render(opts) {
    const percent = (opts.completed / opts.total).toFixed(4); // 计算进度(子任务的 完成数 除以 总数)
    const cell_num = Math.floor(percent * this.length); // 计算需要多少个 █ 符号来拼凑图案

    // 拼接黑色条

    let cell = "";

    for (let i = 0; i < cell_num; i++) {
      cell += "█";
    }

    // 拼接灰色条

    let empty = "";

    for (let i = 0; i < this.length - cell_num; i++) {
      empty += "░";
    }

    // 拼接最终文本

    const cmdText =
      this.description +
      ": " +
      (100 * percent).toFixed(2) +
      "% " +
      cell +
      empty +
      " " +
      opts.completed +
      "/" +
      opts.total;

    slog(gradient("yellow", "cyan", "pink", "purple")(cmdText));
  }
}

module.exports = ProgressBar;
