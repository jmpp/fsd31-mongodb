// 02 Exercice faire une augmentation de 50% & 150%

// 1

db.inventory.updateMany(
    {
      $or: [{ status: "C" }, { status: "D" }],
    },
    { $mul: { qty: 1.5 } }
  );
  
  // ou
  
  db.inventory.updateMany(
    { status: { $in: ["C", "D"] } },
    { $mul: { qty: 1.5 } }
  );
  
  // 2
  
  db.inventory.updateMany(
    {
      status: { $in: ["A", "B"] },
      tags: "blank",
    },
    {
      $mul: { qty: 2.5 },
    }
  );
  
  // ou
  
  db.inventory.updateMany(
    { status: { $in: ["A", "B"] }, tags: { $all: ["blank", "blank", "blank"] } },
    { $mul: { qty: 2.5 } }
  );