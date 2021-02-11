const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {
    validationResult
} = require('express-validator')

// Crea una nueva tarea

exports.crearTarea = async (req, res) => {

    // Reviar si hay errores

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        })
    }

    // Extraer el proyecto y comprobar que existe

    try {
        const {
            proyecto
        } = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }

        // Revisar si el proyecto actual pertence al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No Autorizado'
            });
        }
        // Creamos la tarea

        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({
            tarea
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }

}

// Obtienes las tareas por proyecto
exports.obtenerTareas = async (req, res) => {

    try {
        // Extraer el proyecto y comprobar que existe
        const {
            proyecto
        } = req.query;

        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }

        // Revisar si el proyecto actual pertence al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No Autorizado'
            });
        }

        // Obtener las tareas por proyectos

        const tareas = await Tarea.find({
            proyecto
        }).sort({
            creado: -1
        });
        res.json({
            tareas
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');

    }
}

// Actualizar un tarea

exports.actualizarTarea = async (req, res) => {
    try {

        // Extraer el proyecto y comprobar que existe
        const {
            proyecto,
            nombre,
            estado,
        } = req.body;

        console.log(req.params.id);

        // Si la tarea existe o no

        let tareaExiste = await Tarea.findById(req.params.id);

        if (!tareaExiste) {
            return res.status(404).json({
                msg: 'No existe esa tarea'
            });
        }

        // extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertence al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No Autorizado'
            });
        }

        // Crear un nuevo objeto con la nueva informacion
        const nuevaTarea = {}

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        // Guardar la tarea

        tareaExiste = await Tarea.findByIdAndUpdate({
            _id: req.params.id
        }, nuevaTarea, {
            new: true
        });

        res.json({
            tareaExiste
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Elimina una tarea

exports.eliminarTarea = async (req, res) => {
    try {

        // Extraer el proyecto y comprobar que existe
        const {
            proyecto
        } = req.query;

        // Si la tarea existe o no

        let tareaExiste = await Tarea.findById(req.params.id);

        if (!tareaExiste) {
            return res.status(404).json({
                msg: 'No existe esa tarea'
            });
        }

        // extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertence al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No Autorizado'
            });
        }

        // Eliminar tarea

        await Tarea.findOneAndRemove({
            _id: req.params.id
        });
        res.json({
            msg: 'Tarea Eliminada'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}