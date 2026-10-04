const mongoose = require('mongoose');

// Um documento por livro, com a lista de avaliacoes dentro dele
const avaliacao = mongoose.Schema({
    livroId: { type: Number, required: true },
    avaliacoes: [{
        usuario: { type: String, required: true },
        nota: { type: Number, required: true, min: 1, max: 5 },
        comentario: { type: String },
        data: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Avaliacao', avaliacao);