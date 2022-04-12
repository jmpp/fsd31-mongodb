// Méthode 1 :
// ===============

let count = 0;

db.restaurants.find({ borough: 'Brooklyn' }).forEach(() => count++);

console.log(count);


// Méthode 2 :
// ===============
/*
    let count = 0;

    const cursor = db.restaurants.find({ borough: 'Brooklyn'})

    while (cursor.hasNext()) {
        count++;
        cursor.next();
    }

    console.log(count);
*/