class Time {
  static date;
  static lastTime;
  static deltaTime;
  static startTime;

  static lastTimeMessage = 0;

  static init() {
    let d = new Date();
    Time.date = d;
    Time.deltaTime = d.getTime() / 1000 - Time.lastTime;
    Time.lastTime = Time.startTime;

    Time.startTime = d.getTime() / 1000.0;
  }
  static updateTime() {
    Time.date = new Date();

    var time = Time.date.getTime() / 1000.0;
    Time.deltaTime = time - Time.lastTime;
    Time.lastTime = time;

    Time.elapsedTime += Time.deltaTime;
  }

  static getElapsedTime() {
    let _date = new Date();
    let t = _date.getTime() / 1000.0;
    return t - Time.startTime;
  }
  static getFps() {
    return 1.0 / Time.deltaTime;
  }
}
