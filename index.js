const mongoose = require('mongoose');
const Models = require('./models.js');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const app = express();
const { check, validationResult } = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app);

const cors = require('cors');
app.use(cors());

const passport = require('passport');
require('./passport');

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://127.0.0.1/MyFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });






let users = [
  { 
    Username: "Antonio",
    Password: "0001",
    Email: "antonio@gmail.com",
    Birthday: "01/01/2001",
    FavoriteMovies: []
  },
  {
    ID: 2,
    Username: "Mara",
    Password: "0002",
    Email: "mara@gmail.com",
    Birthday: "02/02/2002",
    FavoriteMovies: ["Top Gun"]
  },
  {
    Username: "Monica",
    Password: "0003",
    Email: "monica@gmail.com",
    Birthday: "03/03/2003",
    FavoriteMovies: []
  }
];

let movies = [
  {
    Title: 'Inception',
    Genre: {
      Name: 'Science Fiction',
      Description: 'A mind-bending heist thrillers set within the architecture of dreams.'
    },
    Director: {
      Name: 'Christopher Nolan',
      Bio: 'Christopher Nolan is a British-American filmmaker known for his innovative storytelling and visually stunning films. He has directed several critically acclaimed movies, including "The Dark Knight" trilogy, "Inception," and "Interstellar."',
      BirthYear: 1970,
      DeathYear: null
    },
    ImageUrl: 'inception.jpg',
    Featured: true
  },
  {
    Title: 'The Dark Knight',
    Genre: {
      Name: 'Action',
      Description: 'A gritty crime thriller featuring the iconic superhero Batman.'
    },
    Director: {
      Name: 'Christopher Nolan',
      Bio: 'Christopher Nolan is a British-American filmmaker known for his innovative storytelling and visually stunning films. He has directed several critically acclaimed movies, including "The Dark Knight" trilogy, "Inception," and "Interstellar."',
      BirthYear: 1970,
      DeathYear: null
    },
    ImageUrl: 'darkknight.jpg',
    Featured: false
  },
  {
    Title: 'Interstellar',
    Genre: {
      Name: 'Science Fiction',
      Description: 'An epic space exploration journey to save humanity from a dying Earth.'
    },
    Director: {
      Name: 'Christopher Nolan',
      Bio: 'Christopher Nolan is a British-American filmmaker known for his innovative storytelling and visually stunning films. He has directed several critically acclaimed movies, including "The Dark Knight" trilogy, "Inception," and "Interstellar."',
      BirthYear: 1970,
      DeathYear: null
    },
    ImageUrl: 'interstellar.jpg',
    Featured: true
  },
  {
    Title: 'Get Out',
    Genre: {
      Name: 'Horror',
      Description: 'A suspenseful horror film tackling racial themes in a unique and chilling way.'
    },
    Director: {
      Name: 'Jordan Peele',
      Bio: 'Jordan Peele is an American filmmaker, actor, and comedian. He gained recognition for his sketch comedy work on the television series "Key & Peele." In recent years, he has ventured into directing and has received critical acclaim for his thought-provoking horror films, including "Get Out" and "Us."',
      BirthYear: 1979,
      DeathYear: null
    },
    ImageUrl: 'getout.jpg',
    Featured: false
  },
  {
    Title: 'The Social Network',
    Genre: {
      Name: 'Drama',
      Description: 'A captivating drama portraying the rise of Facebook and its founder Mark Zuckerberg.'
    },
    Director: {
      Name: 'David Fincher',
      Bio: 'David Fincher is an American filmmaker known for his dark and atmospheric movies. He has directed critically acclaimed films such as "Fight Club," "Gone Girl," and "The Social Network," which earned him an Academy Award nomination for Best Director.',
      BirthYear: 1962,
      DeathYear: null
    },
    ImageUrl: 'socialnetwork.jpg',
    Featured: true
  },
  {
    Title: 'Mad Max: Fury Road',
    Genre: {
      Name: 'Action',
      Description: 'An adrenaline-fueled post-apocalyptic action film set in a desert wasteland.'
    },
    Director: {
      Name: 'George Miller',
      Bio: 'George Miller is an Australian filmmaker and physician. He is best known for his work on the "Mad Max" series, including "Mad Max: Fury Road," which received critical acclaim and won multiple Academy Awards.',
      BirthYear: 1945,
      DeathYear: null
    },
    ImageUrl: 'madmax.jpg',
    Featured: false
  },
  {
    Title: 'Black Panther',
    Genre: {
      Name: 'Action',
      Description: 'A groundbreaking superhero film celebrating African culture and its hero, Black Panther.'
    },
    Director: {
      Name: 'Ryan Coogler',
      Bio: 'Ryan Coogler is an American filmmaker known for his socially conscious and visually stunning movies. He gained recognition for his debut film "Fruitvale Station" and achieved massive success with "Black Panther," becoming the first black director to helm a film in the Marvel Cinematic Universe.',
      BirthYear: 1986,
      DeathYear: null
    },
    ImageUrl: 'blackpanther.jpg',
    Featured: true
  },
  {
    Title: 'Top Gun',
    Genre: {
      Name: 'Action',
      Description: 'An iconic \'80s action film showcasing the high-flying world of fighter pilots.'
    },
    Director: {
      Name: 'Tony Scott',
      Bio: 'Tony Scott was a British filmmaker known for his stylish and fast-paced action films. He directed movies such as "Top Gun," "Man on Fire," and "True Romance," establishing himself as a prominent director in the action genre.',
      BirthYear: 1944,
      DeathYear: 2012
    },
    ImageUrl: 'topgun.jpg',
    Featured: false
  },
  {
    Title: 'Parasite',
    Genre: {
      Name: 'Thriller',
      Description: 'A gripping and darkly comedic tale of class struggle and deception.'
    },
    Director: {
      Name: 'Bong Joon-ho',
      Bio: 'Bong Joon-ho is a South Korean filmmaker known for his unique storytelling and genre-bending films. "Parasite" gained international acclaim, winning multiple awards, including four Academy Awards, and becoming the first South Korean film to win the Palme d\'Or at the Cannes Film Festival.',
      BirthYear: 1969,
      DeathYear: null
    },
    ImageUrl: 'parasite.jpg',
    Featured: true
  },
  {
    Title: 'Whiplash',
    Genre: {
      Name: 'Drama',
      Description: 'An intense drama exploring the pursuit of greatness and the cost of ambition in the world of music.'
    },
    Director: {
      Name: 'Damien Chazelle',
      Bio: 'Damien Chazelle is an American filmmaker and screenwriter. He rose to prominence with the critically acclaimed film "Whiplash," which garnered five Academy Award nominations. Chazelle later directed the musical "La La Land," which won six Academy Awards, including Best Director.',
      BirthYear: 1985,
      DeathYear: null
    },
    ImageUrl: 'whiplash.jpg',
    Featured: false
  }
];

// Creating GET route at endpoint "/movies" returning JSON object (Returns all movies)
  app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {  //Applying JWT authentication to endpoint
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });
  
  // Creating GET route at endpoint "/users" returning JSON object (Returns all users)
  app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  // Creating GET that returns movies by title (READ)
  app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  // Creating GET that returns the Genre by name(READ)
  app.get('/movies/genres/:genreName', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.genreName })
      .then((movie) => {
        res.status(200).json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });
  
  // Creating GET that returns data from Director by name(READ)
  app.get('/movies/directors/:directorName', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.directorName })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Allow new users to Register (CREATE)
  app.post('/users',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

    
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {

        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });


// Allow users to update user info(username) (UPDATE)
app.put('/users/:Username', passport.authenticate('jwt', {session: false}),
[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {

  let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }) // This line makes sure that the updated document is returned
    .then(updatedUser => {
      res.json(updatedUser);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Allow users to add movies to ther favorites list and sent text of confirmations as added (CREATE)
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $push: { FavoriteMovies: req.params.MovieID } },
    { new: true }
  )
    .then(updatedUser => {
      res.json(updatedUser);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


  // Allow users to remove a movie from the favorites list (DELETE)
  app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    )
      .then(updatedUser => {
        res.json(updatedUser);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });
  

  //Allow users to delete the registration
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
  





  
  
    // Creating GET route at endpoint "/" returning text
    app.get('/', (req, res) => {
      res.send('ENJOY WATCHING!!!');
    });

    // This Serves the statics files in the "public" folder
    app.use(express.static('public'));

    // Creating a write stream (in append mode) to the log file
    const accessLogStream = fs.createWriteStream(path.join(__dirname,'log.txt'), {flags: 'a'})

    // Log all requests using Morgan
    app.use(morgan('combined', {stream: accessLogStream}));

    // Creating error-handling that log all errors to terminal
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Ups, something went wrong!');
      });
      
  const port = process.env.PORT || 8080;
  app.listen(port, '0.0.0.0',() => {
    console.log('Your app is listening on port 8080.');

  });