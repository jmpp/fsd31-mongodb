// Collection orders

// 01. Appliquez une augmenation de 10% pour chaque somme de groupe agrégé en fonction du cust_id, sur les ranges dont le status est A

db.orders.aggregate([
    { $match: {
        status: 'A'
    } },

    { $group: {
        _id: '$cust_id',
        totalAmount: { $sum: '$amount' }
    } },

    { $project: {
        _id: 1,
        totalAmount: 1,
        totalAmountAugmented: {
            $round: [ 
                { $multiply: ['$totalAmount', 1.1] },
                1
            ]
        }
    } }
]);