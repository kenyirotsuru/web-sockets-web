// Imports
const express = require('express');
const webRoutes = require('./routes/web');

// Session imports
let cookieParser = require('cookie-parser');
let session = require('express-session');
let flash = require('express-flash');
let passport = require('passport');
let axios = require('axios');

// Express app creation
const app = express();


// Socket.io
const server = require('http').Server(app);
const io = require('socket.io')(server);



// Configurations
const appConfig = require('./configs/app');

// View engine configs
const exphbs = require('express-handlebars');
const hbshelpers = require("handlebars-helpers");
const multihelpers = hbshelpers();
const extNameHbs = 'hbs';
const hbs = exphbs.create({
  extname: extNameHbs,
  helpers: multihelpers
});
app.engine(extNameHbs, hbs.engine);
app.set('view engine', extNameHbs);

// Session configurations
let sessionStore = new session.MemoryStore;
app.use(cookieParser());
app.use(session({
  cookie: { maxAge: 60000 },
  store: sessionStore,
  saveUninitialized: true,
  resave: 'true',
  secret: appConfig.secret
}));
app.use(flash());

// Configuraciones de passport
require('./configs/passport');
app.use(passport.initialize());
app.use(passport.session());

// Receive parameters from the Form requests
app.use(express.urlencoded({ extended: true }))

app.use('/', express.static(__dirname+'/public'));
// Routes
app.use('/', webRoutes);

//variables para el juego
let jugadores = [];
let sockets = [];
let abecedario = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let letra = '';
let enJuego = false;

//Implementacion para la logica del servidor con el juego a partir de aqui
io.on('connection', (socket) => {
  console.log('Client coneected');
  //sacar un nombre random lol
  axios.get("https://random-word-api.herokuapp.com/word?number=1")
  .then((response) => {
    var newPlayer = response.data[0];
    jugadores.push(newPlayer);
    sockets.push(socket);
    socket.emit('welcome', {name : newPlayer, jugadores : jugadores, enJuego : enJuego, letra : letra});
    socket.broadcast.emit('newPlayer', {jugadores : jugadores});
  });
  socket.on('startGame', () => {
    letra = abecedario[Math.floor((Math.random() * 26))]; //del 0 a 25 del arreglo del abecedario
    enJuego = true; //Inicio del juego
    socket.emit('startGame', {letra : letra}); //mandar la letra y empezar el juego
    socket.broadcast.emit('startGame', {letra : letra}); //broadcast a todos de la letra
  });
  socket.on('stopGame', () => {
    enJuego = false;
    socket.emit('stopGame');
    socket.broadcast.emit('stopGame');
  })
  socket.on('disconnect', () => {
    var i = sockets.indexOf(socket);
    var disconnectedPlayer = jugadores[i];
    jugadores.splice(i,1);
    sockets.splice(i, 1);
    socket.broadcast.emit('playerDisconnect', {name : disconnectedPlayer, jugadores : jugadores});
  });
  /*let i = 0;
  setInterval(() => {
    socket.emit('toast', {message: 'mensaje' + i});
    i++;
  }, 1000);
  socket.on('message-to-server', (data) => {
    console.log('message received: ', data);
  })
  */
})

// App init
server.listen(appConfig.expressPort, () => {
  console.log(`Server is listenning on ${appConfig.expressPort}! (http://localhost:${appConfig.expressPort})`);
});
