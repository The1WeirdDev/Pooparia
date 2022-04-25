class Input {
  static isLeft(key) {
    return key === 65 || key === 37;
  }

  static isRight(key) {
    return key === 68 || key === 39;
  }

  static isUp(key) {
    return key === 87 || key === 38;
  }

  static isDown(key) {
    return key === 83 || key === 40;
  }

  static isJump(key) {
    return key === 32 || key === 38 || key == 87;
  }
}
