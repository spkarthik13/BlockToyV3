// Module imports.
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Score = require('./models/scores')
const scoreRouter = require('./routeControllers/scoreRoute')

// Initialize static resources.
app.use(express.static('./game_elements'));
app.use(express.json());
app.use('/scores', scoreRouter)

// Constants.
const PORT = process.env.PORT || 5000;

// Initialize MongoDB.
mongoose.connect('mongodb+srv://AaronQuinn:Quinner7638858@cluster0.ie4jh.mongodb.net/Data', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).then(console.log('Connected successfully to MongoDB'));

// Serve the game when user hits the homepage.
app.get('/', (req, res) => {
    // Sends all resources from the game-elements folder.
    res.sendFile(path.resolve(__dirname, './game_elements'));
});

let highscores = [
    { name: 'Aaron', score: 1},
];

app.post('/api/highscores', (req, res) => {
    let highscore = {
        name: req.body.name,
        score: req.body.score
    }

    // const score = new Score({
    //     value: req.body.score,
    //     playerName: req.body.name
    // })

    // score.save()
    highscores.push(highscore);
    console.log(highscores)
    res.send(highscores);
});

app.all('*', (req, res) => {
    res.status(404).send('<h1> 404 - Page Not Found </h1>');
});

app.listen(PORT || 5000, () => {
    console.log(`User hit the server on port ${PORT}`);
});