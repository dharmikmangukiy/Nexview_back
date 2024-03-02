import CustomErrorHandler from "../service/CustomErrorHandler";
import { Product, TVProduct, Payment, User, Notification } from "../Models";
import { LoginToken } from "../Models/LoginToken";
const productController = {
  //insert tv/movie
  async store(req, res, next) {
    const {
      backdrop_path,
      genre_ids,
      id,
      original_language,
      original_title,
      overview,
      poster_path,
      release_date,
      vote_average,
      status,
      tagline,
      runtime,
      director,
      writer,
      genres,
      isPrime
    } = req.body;
    let document;
    try {
      document = await Product.create({
        backdrop_path,
        genre_ids,
        id,
        original_language,
        original_title,
        overview,
        poster_path,
        release_date,
        vote_average,
        status,
        tagline,
        runtime,
        director,
        writer,
        genres,
        isPrime,
      });
    } catch (err) {
      return next(err);
    }
    res.status(201).json(document);
  },

  async TVstore(req, res, next) {
    const {
      backdrop_path,
      genre_ids,
      id,
      original_language,
      original_name,
      overview,
      poster_path,
      vote_average,
      status,
      tagline,
      runtime,
      director,
      writer,
      genres,
      isPrime,
    } = req.body;
    let document;
    try {
      document = await TVProduct.create({
        backdrop_path,
        genre_ids,
        id,
        original_language,
        original_name,
        overview,
        poster_path,
        vote_average,
        status,
        tagline,
        runtime,
        director,
        genres,
        writer,
        isPrime,
      });
    } catch (err) {
      return next(err);
    }
    res.status(201).json(document);
  },
  async payment(req, res, next) {
    const {
      name,
      plan,
      application,
      trationId,
      cardNumber,
      expiration,
      cvv,
      token
    } = req.body;
    const userLoginData = await LoginToken.findOne({ token: token });
    const { email } = userLoginData;
    const status = false;
    try {
      // Check if the email exists in the User model
      const user = await User.findOne({ email: email });
      if (!user) {
        return next(CustomErrorHandler.userNotFound());
      }

      // If the user exists, proceed with saving the payment information
      const document = await Payment.create({
        name,
        plan,
        application,
        trationId,
        status,
        email,
        cardNumber,
        expiration,
        cvv,
        token
      });

      res.status(201).json(document);
    } catch (err) {
      return next(CustomErrorHandler.userNotFound());
    }
  },
  async favorite(req, res, next) {
    const {
      id,
      token,
      states,
      type
    } = req.body;
    const userLoginData = await LoginToken.findOne({ token: token });
    const { email } = userLoginData;
    try {
      // Check if the email exists in the User model
      const user = await User.findOne({ email: email });
      if (!user) {
        return next(CustomErrorHandler.userNotFound());
      }

      // Initialize favorites array if it doesn't exist
      if (!user.favorite) {
        user.favorite = [];
      }

      let product = null;
      if (type === "movie") {
        product = await Product.findOne({ id: id });
      } else {
        product = await TVProduct.findOne({ id: id });
      }

      if (!product) {
        return next(CustomErrorHandler.productNotFound());
      }

      const isFavorite = user.favorite.some(favProduct => favProduct.id.toString() === product.id.toString());

      if (isFavorite) {
        // If the product exists in favorites, return status code 200 and a message
        return res.status(200).send("Favorite view exists");
      } else {
        // If the product does not exist in favorites, proceed with the original logic
        if (states === true || states === "true") {
          // If states is true, add the product object to user's favorites
          user.favorite.push(product);
        } else {
          // If states is false, remove the product from user's favorites
          user.favorite = user.favorite.filter(favProduct => favProduct.id.toString() !== product.id.toString());
        }
        // Optionally, you can return a different status code or message here if needed
      }

      // Save the updated user document
      await user.save();

      res.status(201).json({ message: "Favorite updated successfully" });
    } catch (err) {
      return next(err);
    }
  },

  //update tv /movie
  async update(req, res, next) {
    const {
      backdrop_path,
      genre_ids,
      original_language,
      original_title,
      overview,
      poster_path,
      release_date,
      vote_average,
      status,
      tagline,
      runtime,
      director,
      writer,
      genres,
      isPrime,
    } = req.body;

    try {
      let updatedMovie = await Product.findOneAndUpdate(
        { id: req.params.id },
        {
          backdrop_path,
          genre_ids,
          original_language,
          original_title,
          overview,
          poster_path,
          release_date,
          vote_average,
          status,
          tagline,
          runtime,
          director,
          writer,
          genres,
          isPrime,
        },
        { new: true }
      );

      if (!updatedMovie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      res.status(200).json(updatedMovie);
    } catch (err) {
      return next(err);
    }
  },
  async TVupdate(req, res, next) {
    const {
      backdrop_path,
      genre_ids,
      original_language,
      original_name,
      overview,
      poster_path,
      vote_average,
      status,
      tagline,
      runtime,
      director,
      genres,
      writer,
      isPrime,
    } = req.body;
    let document;
    try {
      document = await TVProduct.findOneAndUpdate(
        { id: req.params.id },
        {
          backdrop_path,
          genre_ids,
          original_language,
          original_name,
          overview,
          poster_path,
          vote_average,
          status,
          tagline,
          runtime,
          director,
          genres,
          writer,
          isPrime,
        },
        { new: true }
      );
    } catch (err) {
      return next(err);
    }
    res.status(201).json(document);
  },
  async paymentStateChange(req, res, next) {
    const { status } = req.body;
    let document;
    try {
      document = await Payment.findById(req.params.id);
      if (!document) {
        return next(CustomErrorHandler.userNotFound());
      }

      if (document.status === 'true' || document.status === true) {
        return next(CustomErrorHandler.userNotFound());
      }

      // Update the status only if it's not already true
      await Payment.findByIdAndUpdate(
        req.params.id,
        { $set: { status } },
        { new: true }
      );

      if (status === true || status === 'true') {
        const user = await User.findOne({ email: document.email });

        if (user) {
          // Update user's information based on payment document
          user.paymentType = document.type;
          user.paymentTransactionId = document.paymentTransactionId;
          user.type = 'prime user';
          user.plan = document.plan;
          user.planStartDate = new Date();

          // Calculate plan end date based on plan type
          let planEndDate = new Date(user.planStartDate);
          switch (document.plan) {
            case "premium":
              planEndDate.setFullYear(planEndDate.getFullYear() + 1);
              break;
            case "standard":
              planEndDate.setMonth(planEndDate.getMonth() + 6);
              break;
            case "basic":
              planEndDate.setMonth(planEndDate.getMonth() + 3);
              break;
            case "mobile":
              planEndDate.setMonth(planEndDate.getMonth() + 1);
              break;
            default:
              // Handle unsupported plan types
              break;
          }

          user.planEndDate = planEndDate;

          await user.save();
        }
      }

      res.status(200).json(document);
    } catch (err) {
      return next(CustomErrorHandler.userNotFound());
    }
  },

  //delete tv/movie
  async destroy(req, res, next) {
    const document = await Product.findOneAndRemove({ id: req.params.id });
    if (!document) {
      return next(new Error("Nothing to delete"));
    }
    return res.json(document);
  },
  async TVdestroy(req, res, next) {
    const document = await TVProduct.findOneAndRemove({ id: req.params.id });
    if (!document) {
      return next(new Error("Nothing to delete"));
    }
    return res.json(document);
  },

  //get all movie/tv
  async index(req, res, next) {
    let documents;
    // pagination mongoose-pagination
    try {
      documents = await Product.find()
        .select("-updatedAt -__v -createdAt")
        .sort({ id: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },
  async indexTV(req, res, next) {
    let documents;
    // pagination mongoose-pagination
    try {
      documents = await TVProduct.find()
        .select("-updatedAt -__v -createdAt")
        .sort({ id: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },
  async getPayment(req, res, next) {
    let documents;
    // pagination mongoose-pagination
    try {
      documents = await Payment.find()
        .select("-updatedAt -__v -createdAt")
        .sort({ id: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },
  async getMovielength(req, res, next) {
    let documents = {
      movies: 0,
      tVshow: 0
    };
    try {
      const movies = await Product.find();
      const tvShows = await TVProduct.find();
      documents.movies = movies.length;
      documents.tVshow = tvShows.length;
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },
  async getnotification(req, res, next) {
    let movies = []
    try {
      movies = await Notification.find();
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(movies);
  },

  //perticular movie/tv
  async show(req, res, next) {
    let document;
    try {
      document = await Product.findOne({ id: +req.params.id }).select(
        "-updatedAt -__v -createdAt"
      );
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(document);
  },
  async TVshow(req, res, next) {
    let document;
    try {
      document = await TVProduct.findOne({ id: +req.params.id }).select(
        "-updatedAt -__v -createdAt"
      );
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(document);
  },
};

export default productController;
