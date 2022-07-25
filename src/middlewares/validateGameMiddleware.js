import { findGame, findCategoryById } from "../databases/dbManager.js";
import gameSchema from "../schemas/gameSchema.js";

export default async function validateGame(req, res, next) {
  try {
    const newGame = req.body;
    const validate = gameSchema.validate(newGame);

    if (validate.error) {
      return res.status(400).send(validate.error.details[0].message);
    }

    const categoryIdExists = await findCategoryById(newGame.categoryId);

    if (!categoryIdExists) {
      return res.status(400).send("categoryId must be an valid ID");
    }

    const gameExists = await findGame(newGame);

    if (gameExists) {
      return res.status(409).send("Jogo já existente");
    }

    next();
  } catch (err) {
    console.error("Error while validating game", err.message);
    res.sendStatus(500);
  }
}
