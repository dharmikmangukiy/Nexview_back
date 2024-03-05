import express from "express";
import bodyParser from "body-parser"; // Import body-parser
import { APP_PORT, DB_URL } from "./config";
import routes from "./Routs";
import http from "http";
import errorHandler from "./Middlewer/errorHandling";
import mongoose from "mongoose";
import welcome from "./Routs/WelcomeRout";
import socketIo from 'socket.io';
import cors from 'cors';
import { Notification, Product, TVProduct } from "./Models";

const app = express();

// Database connection
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).then(() => {
  console.log("DB connected...");
}).catch((error) => {
  console.error("Error connecting to DB:", error);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(routes);
app.use(welcome);
app.use(errorHandler);

const server = http.createServer(app);
const io = socketIo(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.post('/notification', async (req, res) => {
  const { id, status, type, releaseDate } = req.body;

  try {
    let product;

    if (type === "movie") {
      product = await Product.findOne({ id: id });
    } else {
      product = await TVProduct.findOne({ id: id });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingNotification = await Notification.findOne({ productId: id });

    if (status === true || status === "true") {
      if (existingNotification) {
        return res.status(200).json({ message: "Notification already exists" });
      }
      await Notification.create({ ...product._doc, productId: id, releaseDate: releaseDate, mediaType: type });
      io.emit('product', { ...product._doc, productId: id, releaseDate: releaseDate, keyStatus: status, mediaType: type });
    } else {
      await Notification.deleteOne({ productId: id });
      io.emit('product', { ...product._doc, productId: id, releaseDate: releaseDate, keyStatus: status, mediaType: type });
      io.emit('productDeleted', id); // Emit an event indicating product deletion
    }

    res.status(201).json({ message: "Notification updated successfully" });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: "Internal server error" });
  }
});


server.listen(APP_PORT, () => {
  console.log(`Server listening on Port ${APP_PORT}...`);
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
