import mongoose from "mongoose";
const Schema = mongoose.Schema;

// First Product Schema
const productSchema = new Schema(
  {
    backdrop_path: { type: String, required: true },
    genre_ids: { type: Array, required: true },
    id: { type: Number, required: true },
    original_language: { type: String, required: true },
    original_title: { type: String, required: true },
    overview: { type: String, required: true },
    poster_path: { type: String, required: true },
    release_date: { type: String, required: true },
    vote_average: { type: Number, required: true },
    status: { type: String, required: true },
    tagline: { type: String, required: true },
    runtime: { type: Number, required: true },
    director: { type: String, required: true },
    writer: { type: String, required: true },
    genres: { type: Array, required: true },
    isPrime: { type: Boolean, required: true },
  },
  { timestamps: true, toJSON: { getters: true }, id: false }
);

// Second Product Schema (TVProduct)
const tvProductSchema = new Schema(
  {
    backdrop_path: { type: String, required: true },
    genre_ids: { type: Array, required: true },
    id: { type: Number, required: true },
    original_language: { type: String, required: true },
    original_name: { type: String, required: true },
    overview: { type: String, required: true },
    poster_path: { type: String, required: true },
    vote_average: { type: Number, required: true },
    status: { type: String, required: true },
    tagline: { type: String, required: true },
    runtime: { type: Number, required: true },
    director: { type: String, required: true },
    writer: { type: String, required: true },
    genres: { type: Array, required: true },
    isPrime: { type: Boolean, required: true },
  },
  { timestamps: true, toJSON: { getters: true }, id: false }
);
// Second Product Schema (TVProduct)
const payment = new Schema(
  {
    name: { type: String },
    plan: { type: String, required: true },
    application: { type: String },
    trationId: { type: String },
    status: { type: String, default: false },
    email: { type: String, required: true },
    cardNumber: { type: Number },
    expiration: { type: String },
    cvv: { type: String },
  },
  { timestamps: true, toJSON: { getters: true }, id: false }
);

const Notification = new mongoose.model('Notification', new mongoose.Schema({}, { strict: false })); // Set strict option to false

const Product = mongoose.model("Product", productSchema, "products");
const TVProduct = mongoose.model("TVProduct", tvProductSchema, "tvproduct");
const Payment = mongoose.model("Payment", payment, "payment");
const Popular = mongoose.model("Popular", productSchema, "popular");
const TVPopular = mongoose.model("TVPopular", productSchema, "tv_popular");
const Trending = mongoose.model("Trending", productSchema, "trending");

const Day = mongoose.model("Day", productSchema, "day");
const Genre = mongoose.model("Genre", productSchema, "genre");
const Movie_Genre = mongoose.model("Movie_Genre", productSchema, "movie_genre");

const Configuration = mongoose.model(
  "Configuration",
  productSchema,
  "configuration"
);

export {
  Product,
  TVProduct,
  Popular,
  Payment,
  Day,
  Configuration,
  Genre,
  Movie_Genre,
  TVPopular,
  Trending,
  Notification
};
