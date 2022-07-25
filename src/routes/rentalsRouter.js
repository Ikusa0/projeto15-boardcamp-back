import { Router } from "express";
import { getRentals, createRental, endRental } from "../controllers/rentalsController.js";
import validateRental from "../middlewares/validateRentalMiddleware.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", validateRental, createRental);
router.post("/rentals/:id/return", endRental);
// router.delete("/rentals/:id");

export default router;
