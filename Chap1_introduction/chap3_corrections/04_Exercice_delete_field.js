// 04 Exercice suppression d'un champ

db.inventory.find(
  { level: { $exists: true } },
  { _id: 0, level: 1, society: 1 }
);
db.inventory.updateMany(
  { level: { $exists: true } },
  { $unset: { level: "" } },
  { upsert: false }
);
db.inventory.find(
  { level: { $exists: true } },
  { _id: 0, level: 1, society: 1 }
);

// ou

db.inventory.updateMany({}, { $unset: { level: "" } });
