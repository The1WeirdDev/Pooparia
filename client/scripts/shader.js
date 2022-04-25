class Shader{
  constructor(vertex_shader_data, fragment_shader_data) {
      this.createShader(vertex_shader_data, fragment_shader_data)
  }
  createShader(vertex_shader_data, fragment_shader_data){ 
      this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(this.vertexShader, vertex_shader_data);
      gl.compileShader(this.vertexShader);

      var message = gl.getShaderInfoLog(this.vertexShader);
      if (message.length > 0) {
          throw new Error(`Could not compile vertex shader ${message}`);
      }

      this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(this.fragmentShader, fragment_shader_data);
      gl.compileShader(this.fragmentShader);

      var message = gl.getShaderInfoLog(this.fragmentShader);
      if (message.length > 0) {
          throw new Error(`Could not compile fragment shader ${message}`);
      }

      this.program = gl.createProgram();
      gl.attachShader(this.program, this.vertexShader);
      gl.attachShader(this.program, this.fragmentShader);
      gl.linkProgram(this.program);
      gl.validateProgram(this.program);


      gl.detachShader(this.program, this.vertexShader);
      gl.detachShader(this.program, this.fragmentShader);
  }

  start(){
      gl.useProgram(this.program);
  }

  stop(){
      gl.useProgram(null);
  }

  cleanUp(){
      //Unbinding Program
      gl.useProgram(null);

      //Deleting Shaders And Programs
      gl.deleteShader(this.vertexShader);
      gl.deleteShader(this.fragmentShader);
      gl.deleteProgram(this.program)
  }
}