# Data restaurants

Récupérez les données dans votre conteneur de la mamière suivante :

1. Connectez vous au conteneur, il faut lancer Docker puis créez l'image avec le fichier stack.yml

```bash
docker-compose -f stack.yml up
# Pour reconstruire l'image
docker-compose -f stack.yml up --build
```

Puis en bash dans le conteneur vous allez utiliser le fichier json des données pour créer la base de données ny et la collection restaurants.

```bash
docker exec -it docker_mongo bash 
```

2. Une fois dans le conteneur Mongo vous devez vous connectez à Mongo et créez la base de données et la collection restaurants à partir des données partagées de votre machine hôte vers le conteneur. Les données sont dans data/db (voir le fichier yaml), placez vous dans le dossier db :

```bash
cd data/db
mongoimport --db ny --collection restaurants --authenticationDatabase admin --username root --password example --drop --file ./primer-dataset.json
```

3. Restez connecter à votre machine et connectez-vous à Mongo, le mot de passe est apriori example (voir le fichier stack.yml). Puis une fois connecté loguez vous à la base de données ny.

```bash
mongo -u root -p

mongo> use ny
mongo> db.restaurants.count()
```

## Remarques Windows

- Attention il faut aller dans les settings > ressources > Network  TODO 