const UsuarioProyectoAsignado = require('../models/UsuarioProyectoAsignado');

// Función para generar la fecha y hora actual
const obtenerFechaHoraActual = () => {
  const ahora = new Date();
  const fecha = ahora.toISOString().split('T')[0]; // Obtiene la fecha en formato 'YYYY-MM-DD'
  const hora = ahora.toTimeString().split(' ')[0]; // Obtiene la hora en formato 'HH:MM:SS'
  return { fecha, hora };
};

// Controlador para crear un nuevo registro
const crearUsuarioProyectoAsignado = async (req, res) => {
  try {
    const { id, idUsuario, urn, proyectoKey } = req.body;
    const { fecha, hora } = obtenerFechaHoraActual();
    const nuevoRegistro = new UsuarioProyectoAsignado({
      id,
      idUsuario,
      urn,
      proyectoKey,
      fecha,
      hora
    });
    const usuarioProyectoAsignadoGuardado = await nuevoRegistro.save();
    res.status(201).json(usuarioProyectoAsignadoGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// Controlador para actualizar un registro por idUsuario
const actualizarUsuarioProyectoAsignadoPorIdUsuario = async (req, res) => {
  try {
    const { idUsuario, urn, proyectoKey } = req.body;
    const { fecha, hora } = obtenerFechaHoraActual();
    const usuarioProyectoAsignadoActualizado = await UsuarioProyectoAsignado.findOneAndUpdate(
      { idUsuario },
      { urn, proyectoKey, fecha, hora },
      { new: true }
    );
    res.status(200).json(usuarioProyectoAsignadoActualizado);
  } catch (error) {
    res.status(404).json({ mensaje: error.message });
  }
};

const obtenerUsuarioProyectoAsignadoPorIdUsuario = async (req, res) => {
    try {
      const { idUsuario } = req.params;
      const usuarioProyectoAsignado = await UsuarioProyectoAsignado.findOne({ idUsuario });
      if (!usuarioProyectoAsignado) {
        return res.status(404).json({ mensaje: 'Registro no encontrado' });
      }
      res.status(200).json(usuarioProyectoAsignado);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  };

module.exports = {
  crearUsuarioProyectoAsignado,
  actualizarUsuarioProyectoAsignadoPorIdUsuario,
  obtenerUsuarioProyectoAsignadoPorIdUsuario
};
