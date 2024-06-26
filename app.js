
const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const {Server} = require('socket.io');

const userRouter = require('./Routes/userRoutes.js')
const indexRouter = require('./Routes/indexRouter.js')

const  mongoose  = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const server = httpServer.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
});

const bodyParser = require('body-parser'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const exphbs = require('express-handlebars');

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.log("No se pudo conectar la base de datos : " + error);
    process.exit();
  }
};

connectToMongo();



const io = new Server (server);

io.on('connection', socket=>{
  console.log("nuevo cliente conectado")

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado.');
  });
});
const productsRouter = require('./Routes/productsRoutes.js')(io);
const cartsRouter = require('./Routes/cartsRoutes.js');

app.use('/', productsRouter);
app.use('/api', cartsRouter);
app.use('/api/users', userRouter)
app.use('/', indexRouter);




// Configuración de archivos estáticos y Handlebars
app.use(express.static('public'));

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

