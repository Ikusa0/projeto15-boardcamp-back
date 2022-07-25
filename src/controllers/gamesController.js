import { listGames, insertGame } from "../databases/dbManager.js";

export async function getGames(req, res) {
  try {
    const { name } = req.query;
    const games = await listGames(name);

    res.status(200).send(games);
  } catch (err) {
    console.error("Error while getting games", err.message);
    res.sendStatus(500);
  }
}

export async function createGame(req, res) {
  try {
    const newGame = req.body;

    await insertGame(newGame);

    res.sendStatus(201);
  } catch (err) {
    console.error("Error while creating category", err.message);
    res.sendStatus(500);
  }
}
