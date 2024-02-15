const mongoose = require('mongoose');

const usuarioProyectoAsignado = new mongoose.Schema({
  id: String,
  idUsuario: String,
  urn: String,
  proyectoKey: String,
  fecha: String,
  hora: String
});

const UsuarioProyectoAsignado = mongoose.model('UsuarioProyectoAsignado', usuarioProyectoAsignado);

module.exports = UsuarioProyectoAsignado;
