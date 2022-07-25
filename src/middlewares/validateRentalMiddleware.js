import { findGameById, findCustomerById, countGameRentals } from "../databases/dbManager.js";
import rentalSchema from "../schemas/rentalSchema.js";

export default async function validateRental(req, res, next) {
  try {
    const newRental = req.body;
    const validate = rentalSchema.validate(newRental);

    if (validate.error) {
      return res.status(400).send(validate.error.details[0].message);
    }

    const customerExists = await findCustomerById(newRental.customerId);

    if (!customerExists) {
      return res.status(400).send("customerId must be an valid ID");
    }

    const gameExists = await findGameById(newRental.gameId);

    if (!gameExists) {
      return res.status(400).send("gameId must be an valid ID");
    }

    const totalGameRentals = await countGameRentals(newRental.gameId);

    if (totalGameRentals >= gameExists.stockTotal) {
      return res.status(400).send("this game is out of stock");
    }

    next();
  } catch (err) {
    console.error("Error while validating rental", err.message);
    res.sendStatus(500);
  }
}
