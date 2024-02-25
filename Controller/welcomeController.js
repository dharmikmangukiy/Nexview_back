import { Configuration, Day, Genre, Movie_Genre, Popular, TVPopular, Trending } from "../Models";
import CustomErrorHandler from "../service/CustomErrorHandler";

const welcomeController = {
  //movie/popular
  async Popular(req, res, next) {
    let documents;
    // pagination mongoose-pagination
    try {
      documents = await Popular.find()
        .select("-updatedAt -__v -createdAt")
        .sort({ id: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },
    //tv/popular
    async TVPopular(req, res, next) {
        let documents;
        // pagination mongoose-pagination
        try {
          documents = await TVPopular.find();
        } catch (err) {
          return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
      },

  //day
  async Day(req, res, next) {
    let documents;
    // pagination mongoose-pagination
    try {
      documents = await Day.find()
        .select("-updatedAt -__v -createdAt")
        .sort({ id: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },

  //Configuration
  async Configuration(req, res, next) {
    let documents;
    // pagination mongoose-pagination
    try {
      documents = await Configuration.find();
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },

  //genre/tv/list/one
  async Genre(req, res, next) {
    let documents;
    // pagination mongoose-pagination
    try {
      documents = await Genre.find();
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },
  //genre/movie/list
  async Movie_Genre(req, res, next) {
    let documents;
    // pagination mongoose-pagination
    try {
      documents = await Movie_Genre.find();
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },
    //Trending
    async Trending(req, res, next) {
        let documents;
        // pagination mongoose-pagination
        try {
          documents = await Trending.find();
        } catch (err) {
          return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
      },
};

export default welcomeController;
