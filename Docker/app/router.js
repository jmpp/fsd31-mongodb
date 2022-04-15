const express = require('express');
const router = new express.Router()

/**
 * Déclaration des routes de l'app
 */

router.get("/", getHome);

/**
 * Déclaration des controlleurs de l'app
 */

/**
 * GET /
 * Page d'accueil
 */
function getHome(req, res) {
  let viewData = {};
  res.render('index', viewData);
}

// Exporte le routeur pour le fichier principal
module.exports = router;