
// 'journal'  ->  'Actualité'
// 'lux paper' -> 'Papier LUX'
// 'notebook'  -> 'Carnet de texte'
// 'planner'  -> 'Agenda'
// 'postcard'  ->  'Carte postale'

db.inventory.updateMany(
    { type: { $exists: true } },
    
    [ // Tableau -> Pipeline d'aggregation
        {

        // Opérateurs d'aggregation
        $set: {

            // Le champs que l'on va modifier est le champs 'type'
            type: {

                $switch: {
                    branches: [
                        // En fonction de la valeur du champs '$type', on génère une nouvelle valeur
                        { case: { $eq: ['$type', 'journal'] }, then: 'Actualité' },
                        { case: { $eq: ['$type', 'lux paper'] }, then: 'Papier LUX' },
                        { case: { $eq: ['$type', 'notebook'] }, then: 'Carnet de texte' },
                        { case: { $eq: ['$type', 'planner'] }, then: 'Agenda' },
                        { case: { $eq: ['$type', 'postcard'] }, then: 'Carte postale' },
                    ],
                    default: 'Pas de type'
                }
                
            }
        }
    }
]
);

// ==========================
// Décomposition d'un $switch (aggregation)
// ==========================
/*

    $switch: {
        branches: [
            { case: <expression>, then: 'Actualité' },
            { case: <expression>, then: 'Papier LUX' },
            { case: <expression>, then: 'Carnet de texte' },
            { case: <expression>, then: 'Agenda' },
            { case: <expression>, then: 'Carte postale' },
        ],
        default: ''
    }
*/