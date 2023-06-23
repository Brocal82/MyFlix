const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

app.use(bodyParser.json());

let users = [
  { 
    Username: "Antonio",
    Password: "0001",
    Email: "antonio@gmail.com",
    Birthday: "01/01/2001",
    FavoriteMovies: []
  },
  {
    Username: "Mara",
    Password: "0002",
    Email: "mara@gmail.com",
    Birthday: "02/02/2002",
    FavoriteMovies: []
  },
  {
    Username: "Monica",
    Password: "0003",
    Email: "monica@gmail.com",
    Birthday: "03/03/2003",
    FavoriteMovies: []
  },
  {
    Username: "Mariano",
    Password: "0004",
    Email: "mariano@gmail.com",
    Birthday: "04/04/2004",
    FavoriteMovies: []
  },
  {
    Username: "Araceli",
    Password: "0005",
    Email: "araceli@gmail.com",
    Birthday: "05/05/2005",
    FavoriteMovies: []
  }
];

let movies = [
  {
    Title: 'Inception',
    Genre: {
      Name: 'Science Fiction',
      Description: 'A mind-bending heist thriller set within the architecture of dreams.'
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
  app.get('/movies', (req, res) => {
    res.json(movies);
  });
  
  // Creating GET route at endpoint "/users" returning JSON object (Returns all movies)
  app.get('/users', (req, res) => {
    res.json(users);
  });

  // Creating GET that returns movies by title (READ)
  app.get('/movies/:title', (req, res) => {
    const {title} = req.params;
    const movie = movies.find( movie => movie.Title === title);

    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).send('Movie not found!!!')
    }
  });

  // Creating GET that returns the Genre by name(READ)
  app.get('/movies/genre/:genreName', (req, res) => {
    const {genreName} = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
      res.status(200).json(genre);
    } else {
      res.status(400).send('Genre not found!!!')
    }
  });
  
  // Creating GET that returns data from Director by name(READ)
  app.get('/movies/directors/:directorName', (req, res) => {
    const {directorName} = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName).Director;

    if (director) {
      res.status(200).json(director);
    } else {
      res.status(400).send('Director not found!!!')
    }
  });

  // Allow new users to Register (CREATE)
  app.post('/users', (req, res) => {
    const newUser = req.body;

    if(newUser.name) {
      newUser.id = uuid.v4();
      users.push(newUser);
      res.status(201).json(newUser)
    } else {
      res.status(400).send('users need name')
    }
  })
  
  // Allow users to update user info(username) (UPDATE)
  app.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id);

    if (user) {
      user.name = updatedUser.name;
      res.status(200).json(user);
    } else {
      res.status(400).send('no user updated')
    }

  })
  
  // Allow users to add movies to ther favorites list and sent text of confirmations as added (CREATE)
  app.post('/users/:id/:movieTitle', (req, res) => {
    const {id, movieTitle} = req.params;
    
    let user = users.find( user => user.id == id);

    if (user) {
      user.favoriteMovies.push(movieTitle);
      res.status(200).json(user).send(`${movieName} has been added to ${id}'s array`);
    } else {
      res.status(400).send(`${movieName} has NOT been added`)
    }

  })

  // Allow users to remove a movie from the favorites list (DELETE)
  app.delete('/users/:id/:movieTitle', (req, res) => {
    const {id, movieTitle} = req.params;
    
    let user = users.find( user => user.id == id);

    if (user) {
      user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
      res.status(200).send(`${movieTitle} has been removed from ${id}'s array`);
    } else {
      res.status(400).send(`${movieTitle} is not in the Array`)
    }

  })

  //Allow users to delete the registration
  app.delete('/users/:id', (req, res) => {
    const {id} = req.params;
    
    let user = users.find( user => user.id == id);

    if (user) {
      users = users.filter( user => user.id != id);
      res.status(200).send(`User ${id} has been deleted`);
    } else {
      res.status(400).send(`User ${id} doesn't exist`)
    }

  })
  





  
  
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
  
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');

  });
