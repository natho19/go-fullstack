const jwt = require('jsonwebtoken');

// Vérifier l'authentification
module.exports = (req, res, next) => {
    try {
        // On récupère le token du header Authorization en séparant "Bearer" du "token" dans un tableau où le deuxième élément correspond au token
        const token = req.headers.authorization.split(' ')[1];
        // Verify permet de décoder le token. decodedToken est un objet Javascript
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        // S'il y a userId dans la requête et cet userId est différent de celui du token, renvoyer une erreur
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            // Si l'utilisateur est authentifié, on passe à l'étape suivante
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !' })
    }
};