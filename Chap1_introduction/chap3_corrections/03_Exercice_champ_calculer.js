// 03 Exercice ajouter un champ et calculer
// 1

db.inventory.updateMany(
  {
    qty: { $gte: 75 },
  },
  {
    $set: { scores: [19] },
  },
  { upsert: false }
);

// 2

// si on veut avoir une duplicité de la donnée
db.inventory.updateMany(
  { society: /[aA]/ },
  {
    $push: {
      scores: 11,
    },
  }
);

// si on veut des données uniques

db.inventory.updateMany(
  { society: /[aA]/ },
  {
    $addToSet: {
      scores: 11,
    },
  }
);

//3

db.inventory.find({ scores: { $in: [11] } }, { _id: 0, scores: 1, society: 1 });

// ou

db.inventory.find(
  {
    scores: 11,
  },
  { _id: 0, society: 1, scores: 1, qty: 1 }
);

// 4

db.inventory.updateMany(
  {
    society: "Alex",
  },
  {
    $set: { comment: ["Hello Alex"] },
  }
);

// ou

db.inventory.updateMany(
  {
    society: "Alex",
  },
  {
    $set: { comment: "Hello Alex" },
  }
);

// ou

db.inventory.updateMany(
  { society: "Alex" },
  { $set: { comment: "Hello Alex" } },
  { upsert: false }
);

// 5

db.inventory.find(
  { comment: { $exists: false } },
  { _id: 0, comment: 1, society: 1 }
);

// on peut vérifier que l'on affiche bien les documents avec le champ comment
db.inventory.find(
  { comment: { $exists: true } },
  { _id: 0, comment: 1, society: 1 }
);
