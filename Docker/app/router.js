const { getCollection } = require('./database');

const express = require('express');
const { render } = require('pug');
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

  // Récupère l'objet Collection 'restaurants' de la base Mongo
  const restaurants = await getCollection('restaurants');

  // Test de récupération
  const results = await restaurants.aggregate([
    { $group: {
      _id: '$borough',
      nbRestaurants: { $sum: 1 }
    } }
  ]).toArray();

  viewData = { results };

  res.render('restos', viewData);
}

async function getExplore(req, res) {

  const restaurants = await getCollection('restaurants');

  const results = await restaurants.distinct('borough');

  // db.restaurants.distinct('borough');

  res.render('explore', { results });
}

// Exporte le routeur pour le fichier principal
module.exports = router;