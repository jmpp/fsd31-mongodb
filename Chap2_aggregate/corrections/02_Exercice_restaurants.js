// 01. On aimerait maintenant avoir tous les noms et id des restaurants par type de cuisine et quartier. Limitez l'affichage à deux résultats.
// ==========================

// Affiche un tableau de restaurants pour chaque groupe
db.restaurants.aggregate([
    {
      $group: {
        _id: {
          borough: "$borough",
          cuisine: "$cuisine",
        },
        restaurants: {
          $addToSet: { name: "$name", id_restaurant: "$restaurant_id" },
        },
      },
    },
  
    { $limit: 2 },
  ]);
  
  // Romain :
  // Affiche un document distinct pour chaque restaurant
  db.restaurants.aggregate([
    {
      $project: {
        _id: "$restaurant_id",
        name: 1,
        cuisine: 1,
        borough: 1,
      },
    },
    {
      $sort: {
        cuisine: 1,
        borough: 1,
      },
    },
    { $limit: 2 },
  ]);
  
  // 02. Affichez maintenant tous les noms de restaurant Italiens par quartier.
  // ==========================
  
  db.restaurants.aggregate([
    {
      $match: {
        cuisine: "Czech",
      },
    },
  
    {
      $group: {
        _id: "$borough",
        restaurants: { $push: "$name" },
      },
    },
  ]);
  
  // 03. Affichez également, pour chaque restaurant, la moyenne de ses scores. Et ordonnez vos résultats par ordre de moyenne décroissante.
  // ==========================
  
  db.restaurants.aggregate([
    {
      $unwind: "$grades",
    },
    {
      $match: {
        cuisine: "Italian",
      },
    },
    {
      $group: {
        _id: { borough: "$borough", name: "$name" },
        average: { $avg: "$grades.score" },
      },
    },
    {
      $sort: {
        average: -1,
      },
    },
    {
      $group: {
        _id: "$_id.borough",
        restaurants: {
          $push: {
            name: "$_id.name",
            avg: { $avg: "$average" },
  
            // Ou une string concaténée :
            /* $concat: [
              "$_id.name",
              " (moy:",
              {
                $toString: {
                  $avg: "$average",
                },
              },
              ")",
            ], */
          },
        },
      },
    },
  ]);
  
  // 04. // =====
  db.restaurants.aggregate([
    {
      $project: {
        _id: 0,
        borough: 1,
        grades: 1,
        name: 1,
        avgGrade: { $avg: "$grades.score" },
      },
    },
  
    // { $sort: { avgGrade: -1 } },
  
    {
      $group: {
        _id: "$borough",
        restaurants: { $push: { name: "$name", avgGrade: "$avgGrade" } },
      },
    },
  
    { $unwind: "$restaurants" },
  
    { $sort: { "restaurants.avgGrade": -1 } },
  
    {
      $group: {
        _id: "$_id",
        restaurants: {
          $push: { name: "$restaurants.name", avgGrade: "$restaurants.avgGrade" },
        },
      },
    },
  
    {
      $project: {
        _id: 1,
        bestFiveRestaurants: {
          $slice: ["$restaurants", 5],
        },
      },
    },
  ]);
  
  // ==================
  
  db.restaurants.aggregate([
    {
      $project: {
        _id: 0,
        borough: 1,
        grades: 1,
        name: 1,
        avgGrade: { $avg: "$grades.score" },
      },
    },
  
    // { $sort: { avgGrade: -1 } },
  
    {
      $group: {
        _id: "$borough",
        restaurants: { $push: { name: "$name", avgGrade: "$avgGrade" } },
      },
    },
  
    {
      $project: {
        _id: 1,
        bestFiveRestaurants: {
          $function: {
            body: function (doc) {
              doc.sort((a, b) => b.avgGrade - a.avgGrade);
              return doc;
            },
            args: ["$restaurants"],
            lang: "js",
          },
        },
      },
    },
  
    {
      $project: {
        _id: 1,
        bestFiveRestaurants: {
          $slice: ["$bestFiveRestaurants", 5],
        },
      },
    },
  ]);
  
  // À partir de Mongo v5.2, on aurait pu utiliser l'opérateur $sortArray :
  // https://www.mongodb.com/docs/v5.3/reference/operator/aggregation/sortArray/
  
  // Autres solutions :
  
  // ===== Romain  =====
  
  db.restaurants.aggregate([
    {
      $project: {
        _id: 0,
        borough: 1,
        name: 1,
        avg: { $avg: "$grades.score" },
      },
    },
    // Permet d'éviter le $unwind en regroupant À LA FOIS par quartier ET par moyenne
    {
      $sort: {
        borough: 1,
        avg: -1,
      },
    },
    // … et du coup, on peut regrouper par quartier et $push des éléments déjà triés
    {
      $group: {
        _id: "$borough",
        restaurants: { $push: { avg: "$avg", name: "$name" } },
      },
    },
    {
      $project: {
        _id: 1,
        topFive: {
          $slice: ["$restaurants", 5],
        },
      },
    },
    // { $out : "top5" }
  ]);
  
  // ======= Guillaume ==========
  
  db.restaurants.aggregate([
    {
      $match: {
        borough: { $ne: "Missing" },
      },
    },
    {
      $project: {
        _id: 0,
        cuisine: 1,
        name: 1,
        borough: 1,
        gradeAvg: { $avg: "$grades.score" },
      },
    },
    {
      $sort: {
        borough: 1,
        gradeAvg: -1,
      },
    },
    {
      $group: {
        _id: "$borough",
        docs: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        top_five: {
          $slice: ["$docs", 5],
        },
      },
    },
    { $out: "top5" },
  ]);
  
  // ===================================
  // 05. Récupérez le nombre de restaurants par quartier ainsi que leur type de cuisine qui contiennent AU MOINS un score supérieur ou égal à 30. Ordonnez le résultat par ordre décroissant de nombre de restaurant.
  // ===================================
  
  db.restaurants.aggregate([
    {
      $match: {
        "grades.score": { $gte: 30 },
      },
    },
  
    {
      $group: {
        _id: "$borough",
        totalRestaurants: { $sum: 1 },
        cuisines: { $addToSet: "$cuisine" },
      },
    },
  
    { $sort: { totalRestaurants: -1 } },
  ]);
  
  // =======================================
  // 06. Cherchez les meilleurs restaurants en proposant une requête de votre choix, faites le par quartier. Puis donnez la moyenne des scores de ces restaurants.
  // =======================================
  
  db.restaurants.aggregate([
    {
      $project: {
        _id: 0,
        cuisine: 1,
        name: 1,
        borough: 1,
        size: { $size: "$grades" },
        gradeAvg: { $avg: "$grades.score" },
      },
    },
    {
      $match: {
        gradeAvg: { $gte: 30 },
        size: { $gte: 5 },
      },
    },
    {
      $group: {
        _id: { quartier: "$borough" },
        TopRestos: { $addToSet: { nom: "$name", moyenne: "$gradeAvg" } },
        moyenne: { $avg: "$gradeAvg" },
      },
    },
  ]);
  