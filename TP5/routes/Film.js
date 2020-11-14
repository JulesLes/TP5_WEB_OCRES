const express = require('express');
const router = express.Router();

//Ajouter Lodash
const _ = require('lodash');
//Ajouter Axios
const axios = require('axios');

//Ajouter mon API
const api_url = "http://www.omdbapi.com/";
const api_key = "def37825";

// Create RAW data array
let films = [
  {
    id: "0",
    movie: "Guardians of the Galaxy Vol. 2"
  },
];

/* GET films listing. */
router.get('/', (req, res) => {
  // Get List of film and return JSON
  res.status(200).json({ films });
});

/* GET one film. */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  // Find film in DB
  const film = _.find(films, ["id", id]);
  // Return film
  if(!film){
        res.status(404).json({
            message: 'Movie not found !'
        });
  }else{
    res.status(200).json({
      message: 'Film found!',
      film
    });
  }
});

/* PUT new film. */
router.put('/:title', (req, res) => {
  // Get the data from request from request
  const { title } = req.params;
  // Create new unique id
  const id = _.uniqueId();

  axios.get('${api_url}?apikey=${api_key}&t={title}').then((response) => {

    // Insert it in array (normaly with connect the data with the database)
    films.push({
      id: id,
      movie: response.Title
    });

  }).catch(error => {
      console.log(error);

  }).finally(() =>{
          // Return message
        res.status(200).json({
          message: `Just added ${title}`,
          film: {movie, id }
        });
    });
});


/* DELETE film. */
router.delete('/:id', (req, res) => {
  // Get the :id of the film we want to delete from the params of the request
  const { id } = req.params;

  // Remove from "DB"
  _.remove(films, ["id", id]);

  // Return message
  res.json({
    message: `Just removed ${id}`
  });
});

/* UPDATE film. */
router.post('/:id', (req, res) => {
  // Get the :id of the film we want to update from the params of the request
  const { id } = req.params;
  // Get the new data of the film we want to update from the body of the request
  const { film } = req.body;
  // Find in DB
  const filmToUpdate = _.find(films, ["id", id]);

  // Update data with new data (js is by address)
  axios.get('${api_url}?apikey=${api_key}&t={film}').then((response) => {

    filmToUpdate.Title = film;

  }).catch(error => {
          console.log(error);

      }).finally(() => {
        // Return message
        res.json({
          message: `Just updated ${id} with ${film}`
        });
    });
});

module.exports = router;
