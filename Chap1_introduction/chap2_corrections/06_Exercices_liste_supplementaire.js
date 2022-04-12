
// 1. Affichez la liste des restaurants dont le nom commence et se termine par une voyelle.
db.restaurants.find(
  { name: /^[aeiouy].*[aeiouy]$/gi },
  { _id: 0, name: 1 }
);

// 2. Affichez la liste des restaurants dont le nom commence et se termine par une même lettre. Vous ferez attention à ne pas récupérer dans votre requête les restaurants n'ayant pas de nom. 
db.restaurants.find(
    { name: /^(\w).*\1$/gi },
    { _id: 0, name: 1 }
);