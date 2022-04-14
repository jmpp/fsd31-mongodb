// 01. Calculez le nombre d'hommes et de femmes dans la collection sportif
// 01. Calculer le nombre d'hommes d'un côté et le nombre de femmes.

db.sportif.aggregate([

    // Pour corriger les erreurs 'm' et 'M'
    { $project: {
        Sexe: { $toUpper: '$Sexe' }
    } },

    { $group: {
        _id: '$Sexe',
        nbSportifs: { $sum: 1 }
    } }

]);

// 02. Nom des sportifs qui ne pratiquent pas de sport
db.sportif.aggregate([

    { $match: {
        Sports: { $exists: false }
    } },

    { $project: {
        _id: 0,
        fullname: { $concat: ['$Prenom', ' ', '$Nom' ] }
    } }

]);

// 03. Calculez le nombre de sportifs jouant pour chaque sport.

db.sportif.aggregate([
    { $unwind: '$Sports.Jouer' },

    { $group: {
        _id: '$Sports.Jouer',
        nbSportifs: { $sum: 1 }
    } },

    { $sort: { _id: 1 } }
]);

// 04. Calculez le nombre de gymnases pour chaque ville.

db.gymnase.aggregate([
    { $group: {
        _id: '$Ville',
        nbGymnases: { $sum: 1 }
    } }
]);