import express from "express";
import { welcomeController } from "../Controller";

const welcome = express.Router();

//movie/popular
welcome.get("/discover/movie/popular", welcomeController.Popular);
//tv/popular
welcome.get("/discover/tv/popular", welcomeController.TVPopular);
//trending/movie/day
welcome.get("/trending/movie/day", welcomeController.Day);
//configuration
welcome.get("/configuration", welcomeController.Configuration);
//genre/tv/list
welcome.get("/genre/tv/list", welcomeController.Genre);
//genre/movie/list
welcome.get("/genre/movie/list", welcomeController.Movie_Genre);
//trending/movie/week
welcome.get("/trending/movie/week", welcomeController.Trending);




export default welcome;
