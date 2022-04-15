const { getCollection } = require('./database');

const express = require('express');
const router = new express.Router()

/**
 * Déclaration des routes de l'app
 */

router.get("/", getHome);
router.get("/restos", getRestos);
router.get("/explore", getExplore);

/**
 * Déclaration des controlleurs de l'app
 */

/**
 * GET /
 * Page d'accueil
 */
async function getHome(req, res) {
  let viewData = {};
  res.render('index', viewData);
}

async function getRestos(req, res) {
  let viewData = {};

  // Récupérer les données de la QueryString
  const { searchString } = req.query;

  if (searchString) {
    console.log('La personne souhaite rechercher '+ searchString);

    // Récupère l'objet Collection 'restaurants' de la base Mongo
    const restaurants = await getCollection('restaurants');

    const results = await restaurants.find({
      name: new RegExp(searchString, 'ig')
    }).sort({ name: 1 }).limit(20).toArray();

    viewData = { results, searchString };
  }

  res.render('restos', viewData);
}

async function getExplore(req, res) {
  let viewData = {};

  const restaurants = await getCollection('restaurants');

  // Récupération des éléments de la Query String
  const { selectedBorough, selectedCuisine } = req.query;

  if (selectedBorough && selectedCuisine) {
    const results = await restaurants.find({
      borough: selectedBorough,
      cuisine: selectedCuisine
    }).toArray();

    viewData = { results };
  }

  // Parallèlisation des promesses pour un gain de temps
  const [boroughs, cuisines] = await Promise.all([
    restaurants.distinct('borough'),
    restaurants.distinct('cuisine')
  ]);

  // const boroughs = await restaurants.distinct('borough');
  // const cuisines = await restaurants.distinct('cuisine');

  viewData = {
    ...viewData,
    boroughs,
    cuisines,
    selectedBorough,
    selectedCuisine
  }

  res.render('explore', viewData);
}

// Exporte le routeur pour le fichier principal
module.exports = router;