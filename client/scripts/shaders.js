class Shaders {
  static vertexShaderData_default = `
        precision mediump float;
        attribute vec2 position;
        attribute vec2 texture_coord;
        varying vec2 _texture_coord;
        
        uniform mat4 projectionMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 transformationMatrix;

        void main() {
            _texture_coord = texture_coord;
            
            gl_Position = projectionMatrix * viewMatrix * transformationMatrix * vec4(position, 0, 1);
        }
    `;

  static fragmentShaderData_default = `
        precision mediump float;
        varying vec2 _texture_coord;
        uniform sampler2D textureID;
        void main() {
            //gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
            gl_FragColor = texture2D(textureID, _texture_coord);
        }
    `;

  static vertexShaderData_skybox = `
        precision mediump float;
        attribute vec2 position;
        attribute vec2 texture_coord;
        varying vec2 _texture_coord;

        uniform mat4 projectionMatrix;

        void main() {
            _texture_coord = texture_coord;
            gl_Position = projectionMatrix * vec4(position, -0.9, 1);
        }
    `;

  static fragmentShaderData_skybox = `
        precision mediump float;
        varying vec2 _texture_coord;
        uniform sampler2D textureID;
        void main() {
            gl_FragColor = texture2D(textureID, _texture_coord);
        }
    `;

  static vertexShaderData_ui = `
        precision mediump float;
        attribute vec2 position;
        attribute vec2 texture_coord;
        varying vec2 _texture_coord;
        
        uniform mat4 projectionMatrix;
        uniform mat4 transformationMatrix;

        void main() {
            _texture_coord = texture_coord;
            
            gl_Position = projectionMatrix * transformationMatrix * vec4(position, 0, 1);
        }
    `;

  static fragmentShaderData_ui = `
        precision mediump float;
        varying vec2 _texture_coord;
        uniform sampler2D textureID;
        void main() {
            gl_FragColor = texture2D(textureID, _texture_coord);
        }
    `;

  static default_shader = null;
  static skybox_shader = null;
  static ui_shader = null;

  static defaultShader_projectionMatrixLocation = null;
  static defaultShader_viewMatrixLocation = null;
  static defaultShader_transformationMatrixLocation = null;

  static skybox_projectionMatrixLocation = null;

  static uiShader_projectionMatrixLocation = null;

  static Init() {
    Shaders.projectionMatrix = mat4.create();

    Shaders.default_shader = new Shader(
      Shaders.vertexShaderData_default,
      Shaders.fragmentShaderData_default
    );

    Shaders.skybox_shader = new Shader(
      Shaders.vertexShaderData_skybox,
      Shaders.fragmentShaderData_skybox
    );

    Shaders.ui_shader = new Shader(
      Shaders.vertexShaderData_ui,
      Shaders.fragmentShaderData_ui
    );

    Shaders.defaultShader_projectionMatrixLocation = gl.getUniformLocation(
      Shaders.default_shader.program,
      "projectionMatrix"
    );
    Shaders.defaultShader_viewMatrixLocation = gl.getUniformLocation(
      Shaders.default_shader.program,
      "viewMatrix"
    );
    Shaders.defaultShader_transformationMatrixLocation = gl.getUniformLocation(
      Shaders.default_shader.program,
      "transformationMatrix"
    );

    Shaders.skybox_projectionMatrixLocation = gl.getUniformLocation(
      Shaders.skybox_shader.program,
      "projectionMatrix"
    );

    Shaders.uiShader_projectionMatrixLocation = gl.getUniformLocation(
      Shaders.ui_shader.program,
      "projectionMatrix"
    );
    Shaders.uiShader_transformationMatrixLocation = gl.getUniformLocation(
      Shaders.ui_shader.program,
      "transformationMatrix"
    );
  }

  static CleanUp() {
    Shaders.default_shader.cleanUp();
    Shaders.skybox_shader.cleanUp();
  }
}
