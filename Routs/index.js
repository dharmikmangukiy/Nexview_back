import express from "express";
import { loginController, productController, registerController } from "../Controller";

const router = express.Router();
router.post("/me", loginController.me);
router.post("/login", loginController.login);
router.post("/face-login", loginController.faceLogin);
router.post("/register", registerController.register);

//insert
router.post("/products", productController.store);
router.post("/tvproducts", productController.TVstore);
router.post("/payment", productController.payment);
router.post("/favorite", productController.favorite);
// router.post("/favorite", productController.TVstore);

//update
router.put("/product/:id", productController.update);
router.put("/tvproduct/:id", productController.TVupdate);
router.put("/payment/:id", productController.paymentStateChange);
router.put("/forgat-password", registerController.forgatPassword);
router.put("/user-profile", registerController.userProfile);
router.put("/free-user", registerController.freePlan);

//delete
router.delete("/product/:id", productController.destroy);
router.delete("/tvproduct/:id", productController.TVdestroy);

//get all
router.get("/discover/movie", productController.index);
router.get("/discover/tv", productController.indexTV);
router.get("/user/prime", productController.prime);
router.get("/user/nonPrime", productController.nonPrime);
router.get("/payment", productController.getPayment);
router.get("/payment-length", productController.getMovielength);
router.get("/notification", productController.getnotification);
//get one
router.get("/movie/:id", productController.show);
router.get("/tv/:id", productController.TVshow);
router.get("/notifiction", productController.notifiction);

export default router;
