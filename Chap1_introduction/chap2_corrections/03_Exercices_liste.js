//  Liste d'Exercices
/**
 * 01. Combien y a t il de restaurants qui font de la cuisine italienne et qui ont eu un score de 10 au moins ?
 */

db.restaurants.find({ cuisine: "Italian", "grades.score": 10 }).count();

/**
 * Affichez également le nom, les scores et les coordonnées GPS de ces restaurants. Ordonnez les résultats par ordre décroissant sur les noms des restaurants.
 */

db.restaurants
  .find(
    { cuisine: "Italian", "grades.score": 10 },
    { "grades.score": 1, "address.coord": 1, name: 1, _id: 0 }
  )
  .sort({ name: 1 })

// 02.03. Quels sont les restaurants qui ont eu un grade A et un score supérieur ou égal à 20 ? Affichez uniquement les noms et ordonnez les par ordre décroissant. Affichez le nombre de résultat.

db.restaurants.find(
  {
    'grades.grade': 'A',
    'grades.score': { $gte: 20 }
  },
  {
    _id: 0,
    name: 1,
    'grades.grade': 1,
    'grades.score': 1
  }
).sort({ name: -1 }).count()

      // Bonus, en utilisant $elemMatch pour être plus spécifique :
      db.restaurants.find({
        'grades.grade': 'A',
        grades: {
          $elemMatch: {
            score: { $gte: 10, $lte: 20 } // Trouve les scores dont AU MOINS un élément est compris entre 10 et 20
          }
        }
      },
      {
        _id: 0,
        name: 1,
        'grades.grade': 1,
        'grades.score': 1
      });

// 04. A l'aide de la méthode distinct trouvez tous les quartiers distincts de NY.

db.restaurants.distinct("borough");

// 05. Trouvez tous les types de restaurants dans le quartiers du Bronx. Vous pouvez là encore utiliser distinct et un deuxième paramètre pour préciser sur quel ensemble vous voulez appliquer cette close.

db.restaurants.distinct("cuisine", { borough: "Bronx" });

// 06. Trouvez tous les restaurants dans le quartier du Bronx qui ont eu 4 grades.
db.restaurants.find(
  { borough: 'Bronx', grades: { $size: 4 } },
  { _id: 0, borough: 1, grades: 1 }
);

// 07. 
  // Avec in $in
  db.restaurants.find({
    borough: 'Bronx',
    'grades.grade': { $in:['A', 'B'] }
  }, { _id: 0, borough: 1, 'grades.grade': 1}).count()

  // Avec un $or
  db.restaurants.find({
    borough: 'Bronx',
    $or: [
      {'grades.grade': 'A'},
      {'grades.grade': 'B'}
    ]
  }).count()

// 08.
db.restaurants.find({
  borough: 'Bronx',
  $or: [
    { 'grades.0.grade': 'A'},
    { 'grades.0.grade': 'B'},
  ]
}, { _id: 0, borough: 1, 'grades.grade': 1});

// 09.
db.restaurants.find({
  // name: /coffee/gi, // avec le flag 'i' pour 'ignore case'
  name: /[Cc]offee/g,
  borough: 'Bronx'
}, {_id:0, name:1, borough: 1}).count();

// 10.
db.restaurants.find({
  $and: [
    { $or : [{ name: /Coffee/gi }, { name: /Restaurant/gi }] },
    { name: { $not: /Starbucks/gi }}
  ]
}, { _id:0, name: 1}).count();

// 11.
db.restaurants.find({
  name: /Coffee/gi,
  borough: { $in: ['Bronx', 'Brooklyn'] },
  grades: { $size: 4 }
}, { _id:0, name: 1, borough: 1, grades:1}).count();

// 12.
db.restaurants.find({
  name: /Coffee/gi,
  borough: { $in: ['Bronx', 'Brooklyn'] },
  grades: { $size: 4 }
}, { _id:0, name: 1, borough: 1, grades:1 }).forEach(doc => {
  console.log(doc.name.toUpperCase());
  console.log(`Last date : ${doc.grades[0].date.toLocaleDateString()}`);
  console.log(`First date : ${doc.grades[3].date.toLocaleDateString()}`);
  console.log('--------');
});

  // Solution Romain (aggregation)
  // $project

  db.restaurants.find(
    {
      name: /Coffee/,
      $or: [{ borough: "Bronx" }, { borough: "Brooklyn" }],
      grades: { $size: 4 },
    },
    {
      _id: 0,
      name: { $toUpper: "$name" },
      firstDate: { $last: "$grades.date" },
      lastDate: { $first: "$grades.date" },
    }
  );

  // Solution Clémence (aggregation pipeline)
  db.restaurants.aggregate([
    {
      $match: {
        name: /[cC]offee/,
        $or: [{ borough: "Bronx" }, { borough: "Brooklyn"}],
        grades: { $size: 4 },
      },
    },
    {
      $project: {
        _id: 0,
        name: { $toUpper: "$name" },
        firstGrade: { $arrayElemAt: ["$grades.date", -1] },
        lastGrade: { $arrayElemAt: ["$grades.date", 0] },
      },
    },
  ]);