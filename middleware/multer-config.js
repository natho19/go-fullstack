const multer = require('multer');

// Multer ne permet d'accéder aux extensions des fichiers mais au MIME_TYPE. Dictionnaire de mime_types
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // 'images' correspond au nom du dossier qu'on a crée dans le back-end pour recevoir les images
        callback(null, 'images')
    },
    // Générer automatiquement un nouveau nom de fichier pour éviter que 2 fichiers aient le même nom
    filename: (req, file, callback) => {
        // Remplacer les espaces par les underscores pour éviter des problèmes au niveau du serveur
        // split = tableau composé des noms décomposés par les espaces
        // join = fusionner les noms décomposés par des underscores
        const name = file.originalname.split(' ').join('_');
        // Grâce à MIME_TYPES, on peut associer une extension au myme_type du fichier envoyé
        const extension = MIME_TYPES[file.mimetype];
        // On ajoute un timestamp (Date.now()) au nom pour le rendre unique
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');