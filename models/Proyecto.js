const mongoose = require('mongoose');

const ProyectoSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario' // Esta es la referencia de la tabla de usuario alli podra comprar el id
    },
    creado: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Proyecto', ProyectoSchema)