// Transformer un champ en coordonnee => créer un index en BD mettre des propriétés sur un champ afin que l'on puisse faire des calculs spécifiques
// Par exemple en MySQL vous pouvez transformer un champ email => index unique 

db.restaurants.createIndex({"address.coord" : "2dsphere"}) ; // calcul géométrique possible sur ce champ

const coordinates = [-73.961704, 40.662942];
const METERS_PER_MILES = 1609.34; // D'après Google

db.restaurants.find({
    'address.coord': {
        $nearSphere: {
            $geometry: { type: 'Point', coordinates },
            $maxDistance: METERS_PER_MILES * 5
        }
    }
}, { _id: 0, name: 1, borough: 1, 'address.coord': 1}).forEach(doc => {

    const { name, borough, address } = doc;

    console.log(name);
    console.log('Quartier de ' + borough);
    console.log(address.coord.reverse().join(', '));
    console.log('------------');

});