import express from "express";
import { loginController, productController,registerController } from "../Controller";

const router = express.Router();
router.post("/me", loginController.me);
router.post("/login", loginController.login);
router.post("/register", registerController.register);

//insert
router.post("/products", productController.store);
router.post("/tvproducts", productController.TVstore);
router.post("/payment", productController.payment);
// router.post("/notifiction", productController.TVstore);
// router.post("/favorite", productController.TVstore);

//update
router.put("/product/:id", productController.update);
router.put("/tvproduct/:id", productController.TVupdate);
router.put("/payment/:id", productController.paymentStateChange);

//delete
router.delete("/product/:id", productController.destroy);
router.delete("/tvproduct/:id", productController.TVdestroy);

//get all
router.get("/discover/movie", productController.index);
router.get("/discover/tv", productController.indexTV);
router.get("/payment", productController.getPayment);
//get one
router.get("/movie/:id", productController.show);
router.get("/tv/:id", productController.TVshow);

export default router;
