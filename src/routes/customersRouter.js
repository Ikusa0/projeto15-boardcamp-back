import { Router } from "express";
import { getCustomers, createCustomer, getCustomerById, changeCustomer } from "../controllers/customersController.js";
import validateCustomer from "../middlewares/validateCustomerMiddleware.js";

const router = Router();

router.get("/customers", getCustomers);
router.post("/customers", validateCustomer, createCustomer);
router.get("/customers/:id", getCustomerById);
router.put("/customers/:id", validateCustomer, changeCustomer);

export default router;
