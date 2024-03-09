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
    if (userLoginData === null) {
      return next(CustomErrorHandler.userNotFound());
    }
    const { email } = userLoginData;
    const status = 'pending';
    try {
      // Check if the email exists in the User model
      const user = await User.findOne({ email: email });
      if (!user) {
        return next(CustomErrorHandler.userNotFound());
      }
      const paymentUser = await Payment.findOne({ email: email });
      if (paymentUser) {
        return next(CustomErrorHandler.paymentFound());
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
      user.paymentStatus = 'pending';
      await user.save(); // Save the changes to the user object in the database

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
    if (userLoginData === null) {
      return next(CustomErrorHandler.userNotFound());
    }
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

      // Check if product is null or undefined
      if (!product) {
        return next(CustomErrorHandler.productNotFound());
      }

      // Now you can proceed with the logic
      const isFavorite = user.favorite.some(favProduct => favProduct.id == product.id);
      if (isFavorite && (states === true || states === "true")) {
        // If the product exists in favorites, return status code 200 and a message
        return res.status(200).send("Favorite view exists");
      } else {
        // If the product does not exist in favorites, proceed with the original logic
        if (states === true || states === "true") {
          // If states is true, add the product object to user's favorites
          user.favorite.push({ ...product._doc, mediaType: type });
        } else {
          // If states is false, remove the product from user's favorites
          user.favorite = user.favorite.filter(favProduct => favProduct.id != product.id);
        }
        // Optionally, you can return a different status code or message here if needed
      }

      // Save the updated user document
      await user.save();

      res.status(201).json({ message: "Favorite updated successfully" });
    } catch (err) {
      console.log('err',err)
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

      // if (document.status === 'success' || document.status === 'rejected') {
      //   return next(CustomErrorHandler.userNotFound());
      // }

      // Update the status only if it's not already true
      const newStatus = status === true || status === 'true' ? 'success' : 'rejected';

      await Payment.findByIdAndUpdate(
        req.params.id,
        { $set: { status: newStatus } },
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
          user.paymentStatus = newStatus;
          // Calculate plan end date based on plan type
          let planEndDate = new Date(user.planStartDate);
          switch (document.plan) {
            case "Premium":
              planEndDate.setFullYear(planEndDate.getFullYear() + 1);
              break;
            case "Standard":
              planEndDate.setMonth(planEndDate.getMonth() + 6);
              break;
            case "Basic":
              planEndDate.setMonth(planEndDate.getMonth() + 3);
              break;
            case "Mobile":
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
  async prime(req, res, next) {
    let documents;
    let filteredUsers = [];
    try {
      // Fetching documents with type 'prime user' and role 'customer'
      documents = await User.find({ type: 'prime user', role: 'customer' });
      filteredUsers = documents.reverse();
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(filteredUsers);
  },
  async notifiction(req, res, next) {
    let documents;
    let reverseUser = []
    // pagination mongoose-pagination
    try {
      documents = await Notification.find(); // Filtering documents
      reverseUser = documents.reverse();
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(reverseUser);
  },
  async nonPrime(req, res, next) {
    let documents;
    try {
      // Fetching documents with type other than 'prime user' and role 'customer'
      documents = await User.find({ type: { $ne: 'prime user' }, role: 'customer' });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },
  async getPayment(req, res, next) {
    let documents;
    let reversePayment = []
    try {
      documents = await Payment.find();
      reversePayment = documents.reverse();
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(reversePayment);
  },
  async getMovielength(req, res, next) {
    let documents = {
      movies: 0,
      primeMovies: 0,
      freeMovies: 0,
      tVshow: 0,
      primeTVshow: 0,
      freeTVshow: 0,
      payment: 0,
      pendingPayment: 0,
      successPayment: 0,
      user: 0,
      primeUser: 0,
      freeUser: 0,
    };
    try {
      const movies = await Product.find();
      documents.movies = movies.length;

      // Filter prime movies
      const primeMovies = movies.filter(movie => movie.isPrime === true || movie.isPrime == 'true');
      documents.primeMovies = primeMovies.length;

      // Calculate free movies
      documents.freeMovies = documents.movies - documents.primeMovies;

      const tvShows = await TVProduct.find();
      documents.tVshow = tvShows.length;

      // Filter prime TV shows
      const primeTVShows = tvShows.filter(show => show.isPrime === true || show.isPrime === 'true');
      documents.primeTVshow = primeTVShows.length;

      // Calculate free TV shows
      documents.freeTVshow = documents.tVshow - documents.primeTVshow;

      const payment = await Payment.find();

      // Calculate total payments
      documents.payment = payment.length;

      // Filter successful payments
      const successPayment = payment.filter(payment => payment.status === true || payment.status === 'success');
      documents.successPayment = successPayment.length;

      // Calculate pending payments
      documents.pendingPayment = documents.payment - documents.successPayment;

      const users = await User.find();

      // Total number of users
      documents.user = users.length;

      const freeUser = users.filter(user => user.plan == 'free Plan');
      documents.freeUser = freeUser.length;

      // Calculate free users
      documents.primeUser = documents.user - documents.freeUser;

    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },
  async getnotification(req, res, next) {
    let movies = [];
    let reverseNotification = []
    try {
      movies = await Notification.find();
      reverseNotification = movies.reverse();
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(reverseNotification);
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
