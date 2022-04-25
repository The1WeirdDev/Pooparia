class Mesh {
  constructor() {}

  createMesh(
    vertexData,
    indexData,
    textureData,
    textureLocation,
    shouldLoad = true
  ) {
    this.vao_id = gl.createVertexArray();
    gl.bindVertexArray(this.vao_id);

    //Buffering Vertex Data
    this.vbo_id = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_id);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertexData),
      gl.STATIC_DRAW
    );

    //Binding vertexData
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disableVertexAttribArray(0);

    //Buffering Index Data
    this.ebo_id = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo_id);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indexData),
      gl.STATIC_DRAW
    );

    //Texture Data
    this.tbo_id = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tbo_id);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(textureData),
      gl.STATIC_DRAW
    );

    //Binding vertexData
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
    gl.disableVertexAttribArray(1);

    //Loading Texture
    this.texture_id = null;
    if (shouldLoad) this.texture_id = loadTexture(gl, textureLocation);

    //Unbinding Buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    this.vertex_count = indexData.length;
  }

  draw() {
    //Binding Vaos and Vbos
    gl.bindVertexArray(this.vao_id);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_id);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo_id);

    //Drawingh
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture_id);

    gl.drawElements(gl.TRIANGLES, this.vertex_count, gl.UNSIGNED_SHORT, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.disableVertexAttribArray(1);
    gl.disableVertexAttribArray(0);

    //Uninding Vbos
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
  }

  cleanUp() {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    gl.deleteBuffer(this.vbo_id);
    gl.deleteBuffer(this.ebo_id);
    gl.deleteVertexArray(this.vao_id);
  }
}
