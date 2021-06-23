const Thing = require('../models/Thing');

exports.createThing = (req, res, next) => {
    // Supprime le champ id envoyé par le body de req car mongoose génère automatiquement l'id
    delete req.body._id;
    const thing = new Thing({
        ...req.body
    });
    thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error })); // Raccourci { error } = { error: error }
};

exports.modifyThing = (req, res, next) => {
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
    Thing.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
        .catch(error => res.status(400).json({ error }));
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