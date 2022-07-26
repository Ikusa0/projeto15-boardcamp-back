import { listRentals, insertRental, updateRental, deleteRental, findRentalById } from "../databases/dbManager.js";

export async function getRentals(req, res) {
  try {
    const { gameId, customerId } = req.query;
    const rentals = await listRentals(gameId, customerId);

    res.status(200).send(rentals);
  } catch (err) {
    console.error("Error while getting rentals", err.message);
    res.sendStatus(500);
  }
}

export async function createRental(req, res) {
  try {
    const newRental = req.body;

    await insertRental(newRental);

    res.sendStatus(201);
  } catch (err) {
    console.error("Error while creating rental", err.message);
    res.sendStatus(500);
  }
}

export async function endRental(req, res) {
  try {
    const { id } = req.params;
    
    const rental = await findRentalById(id);
    if (!rental) {
      return res.sendStatus(404);
    }
    
    if (rental.returnDate) {
      return res.status(400).send("Aluguel já finalizado.");
    }

    await updateRental(id);

    res.sendStatus(200);
  } catch (err) {
    console.error("Error while ending rental", err.message);
    res.sendStatus(500);
  }
}

export async function excludeRental(req, res) {
  try {
    const { id } = req.params;

    const rental = await findRentalById(id);
    if (!rental) {
      return res.sendStatus(404);
    }

    if (!rental.returnDate) {
      return res.status(400).send("Aluguel ainda não finalizado.");
    }

    await deleteRental(id);

    res.sendStatus(200);
  } catch (err) {
    console.error("Error while ending rental", err.message);
    res.sendStatus(500);
  }
}
