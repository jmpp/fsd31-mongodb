// Collection restaurants

// 01 Comptez le nombre de A par type de cuisine.

db.restaurants.aggregate([
    { $unwind: '$grades' },
    { $match: { 'grades.grade': 'A' } },
    { $group: {
        _id: '$cuisine',
        nbA: { $sum: 1 }
    } }
]);