class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Utils {
  static clamp(val, min, max) {
    if (val < min) return min;
    else if (val > max) return max;
    else return val;
  }
}
