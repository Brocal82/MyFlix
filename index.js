const express = require('express');
const app = express();

const morgan = require('morgan');


const topMovies = [
    {
        title: 'Inception',
        genre: 'Science Fiction',
        year: 2010
      },
      {
        title: 'The Dark Knight',
        genre: 'Action',
        year: 2008
      },
      {
        title: 'Interstellar',
        genre: 'Science Fiction',
        year: 2014
      },
      {
        title: 'Get Out',
        genre: 'Horror',
        year: 2017
      },
      {
        title: 'The Social Network',
        genre: 'Drama',
        year: 2010
      },
      {
        title: 'Mad Max: Fury Road',
        genre: 'Action',
        year: 2015
      },
      {
        title: 'Black Panther',
        genre: 'Action',
        year: 2018
      },
      {
        title: 'Top Gun Maverick',
        genre: 'Action',
        year: 2022
      },
      {
        title: 'Parasite',
        genre: 'Thriller',
        year: 2019
      },
      {
        title: 'Whiplash',
        genre: 'Drama',
        year: 2014
      }
    
  ];
  
  // Creating GET route at endpoint "/movies" returning JSON object 
  app.get('/movies', (req, res) => {
    res.json(topMovies);
  });
  
  // Creating GET route at endpoint "/" returning text
  app.get('/', (req, res) => {
    res.send('ENJOY WATCHING!!!');
  });

  // This Serves the statics files in the "public" folder
  app.use(express.static('public'));

  // Log all requests using Morgan
  app.use(morgan('common'));

  // Creating error-handling that log all errors to terminal
  app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Ups, something went wrong!');
    });
  
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });
