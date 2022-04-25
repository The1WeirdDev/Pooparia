let fs = require("fs");
module.exports = class Utils {
  static getDate() {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return `${month}_${day}_${year}`;
  }

  static createLogger = function (loc, loggerName, ext) {
    var location = loc + "/";

    fs.mkdir(location, (err) => {});

    let fileAddr = location + loggerName + ext;
    var stream = fs.createWriteStream(fileAddr, {
      flags: "a"
    });
    return stream;
  };

  static clamp(val, min, max) {
    if (val < min) return min;
    else if (val > max) return max;
    else return min;
  }
};
