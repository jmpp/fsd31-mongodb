// 01. Affichez tous les articles de type journal. Et donnez la quantité total de ces articles (propriété qty). Pensez à faire un script en JS.

let totalJournaux = 0;

db.inventory.find({ type: 'journal' }).forEach(doc => {
    totalJournaux += doc.qty;
});

console.log('Quantité totale de journaux :' + totalJournaux); // 159

// 02. Affichez les noms de sociétés depuis 2018 avec leur quantité (sans agrégation)

db.inventory.find({
    year: { $gte: 2018 }
});

// 03. Affichez les types des articles pour les sociétés dont le nom commence par A.

db.inventory.find({
    society: /^A/ig
});

// 04. Affichez le nom des sociétés dont la quantité d'articles est supérieur à 45.

db.inventory.find({
    qty: { $gt: 45 }
}); // 4

// 05. Affichez le nom des sociétés dont la quantité d'article(s) est strictement supérieur à 45 et inférieur à 90.

db.inventory.find({
    $and: [
        { qty: { $gt: 45 } },
        { qty: { $lt: 90 } }
    ]
});

// 06. Affichez le nom des sociétés dont le statut est A ou le type est journal.
db.inventory.find({
    $or: [
        { status: 'A' },
        { type: 'journal' }
    ]
});

// 07. Affichez le nom des sociétés dont le statut est A ou le type est journal et la quantité inférieur strictement à 100.

db.inventory.find(
  {
    $and: [
      { qty: { $lt: 100 } },
      { $or: [{ status: "A" }, { type: "journal" }] },
    ],
  },
  { _id: 0, qty: 1, status: 1, type: 1 }
);

// C'est la même chose :

db.inventory.find({
    qty: { $lt: 100 },
    $or: [
        { status: 'A' },
        { type: 'journal' }
    ]
}, { _id: 0, qty: 1, status: 1, type: 1});

// 08. Affichez le type des articles qui ont un prix de 0.99 ou 1.99 et qui sont true pour la propriété sale ou ont une quantité strictement inférieur à 45.

    /* (prix === 0.99 || prix === 1.99)
    &&
    (sale === true || qty < 45) */

db.inventory.find({
    $and: [
        { $or: [ { price: 0.99 }, { price: 1.99 } ] },
        { $or: [ { sale: true }, { qty: { $lt: 45 } } ] },
    ]
});
    
// Solution sans $and (Clémence) :
db.inventory.find({
    price: { $in: [0.99, 1.99] },
    $or: [ { sale: true }, { qty: { $lt: 45 } } ],
});


// 09. Affichez le nom des sociétés et leur(s) tag(s) si et seulement si ces sociétés ont au moins un tag.

db.inventory.find({ tags: { $exists: true } }, { _id:0, society:1, tags:1})

// 10. Affichez le nom des sociétés qui ont au moins un tag blank.

db.inventory.find({ tags: 'blank' });