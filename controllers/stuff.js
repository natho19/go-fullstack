const Thing = require('../models/Thing');
// fs pour fylesystem
const fs = require('fs');

exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing);
    // Supprime le champ id envoyé par le body de req car mongoose génère automatiquement l'id
    delete thingObject._id;
    const thing = new Thing({
        ...thingObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error })); // Raccourci { error } = { error: error }
};

exports.modifyThing = (req, res, next) => {
    // Si on upload une nouvelle image, On récupère les informations de la requête qui ont été modifiées sous forme d'objet et on ajoute l'URL de la nouvelle image. Sinon on récupère seulement les informations de la requête qui ont été modifiées
    const thingObject = req.file ?
        {
            ...JSON.parse(req.body.thing),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };

    Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => {
            // Récupère le nom du fichier dans l'URL de l'image
            const filename = thing.imageUrl.split('/images/')[1];
            // Supprime l'image correspondante dans le dossier 'images'
            fs.unlink(`images/${filename}`, () => {
                Thing.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};

// :id = Chercher l'identifiant dans la route utilisée comme paramètre
exports.getOneThing = (req, res, next) => {
    // Comparer l'id dans la base de donnée avec l'identifiant récupéré dans le paramètre de l'URL
    Thing.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllThings = (req, res, next) => {
    Thing.find()
        // Renvoie un tableau contenant tous les things dans notre base de données 
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
};