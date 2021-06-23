const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                // Crypte le mot de passe
                password: hash
            });
            // Créer un nouvel utilisateur avec le hash du mot de passe
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    // Rechercher l'utilisateur dont l'adresse email correspond à l'email envoyé dans la requête
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si on ne trouve aucun utilisateur
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Si on arrive ici c'est qu'on a bien trouvé un utilisateur
            // On compare le hash du mot de passe de l'utilisateur trouvé avec le mot de passe envoyé dans la requête
            bcrypt.compare(req.body.password, user.password)
                // Bcrypt envoie un boolean après la comparaison
                .then(valid => {
                    // Si valid = false (après la comparaison de bcrypt, les résultats sont différents)
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // Si on arrive ici c'est que valid = true (les résultats sont les mêmes)
                    res.status(200).json({
                        userId: user._id,
                        token: 'TOKEN'
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};