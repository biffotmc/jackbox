const firebase = require('firebase-admin');
const express = require('express');

const app = express();

// Initialize Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyD7q-XuSnS8YjcWfTbJBDmCqV3YqSWCdls',
  authDomain: 'jackbox-3bc37.firebaseapp.com',
  databaseURL: 'https://jackbox-3bc37-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'jackbox-3bc37',
  storageBucket: 'jackbox-3bc37.appspot.com',
  messagingSenderId: '858867272459'
});

// Get a reference to the Firebase database
const db = firebase.database();

// A route to create a new game
app.post('/games', (req, res) => {
  // Create a new game in the Firebase database
  const game = db.ref('games').push({
    name: req.body.name,
    players: []
  });

  // Return the game id to the client
  res.send({ id: game.key });
});

// A route to get the game state
app.get('/games/:id', (req, res) => {
  // Get the game from the Firebase database
  db.ref(`games/${req.params.id}`).once('value', (snapshot) => {
    const game = snapshot.val();
    res.send(game);
  });
});

// A route to add a player to a game
app.post('/games/:id/players', (req, res) => {
  // Get the game from the Firebase database
  db.ref(`games/${req.params.id}`).once('value', (snapshot) => {
    const game = snapshot.val();

    // Add the player to the game
    game.players.push({
      name: req.body.name
    });

    // Update the game in the Firebase database
    db.ref(`games/${req.params.id}`).set(game);
    res.send();
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
