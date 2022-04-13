
// Exemple de $group
// =================
// Groupe tous les restaurants par type de cuisine,
//  et affiche le nombre de restaurants, le total de notes déposées, et la moyenne

db.restaurants.aggregate([

    { $project: {
        address: 1,
        borough: 1,
        cuisine: 1,
        name: 1,
        grades: '$grades.score',
        nbGrades: { $size: '$grades' },
        gradesAvg: { $avg: '$grades.score' },
    } },

    // Obtenir la moyennes des restaurants, classés par type de cuisine

    { $group: {
        _id: '$cuisine',
        nbRestaurants: { $sum: 1 },
        nbNotes: { $sum: '$nbGrades'},
        avgNotation: { $avg: '$gradesAvg' },
    } }

]);
