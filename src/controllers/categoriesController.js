import { listCategories, insertCategory } from "../databases/dbManager.js";

export async function getCategories(req, res) {
  try {
    const categories = await listCategories();
    res.status(200).send(categories);
  } catch (err) {
    console.error("Error while getting categories", err.message);
    res.sendStatus(500);
  }
}

export async function createCategory(req, res) {
  try {
    const newCategory = req.body;

    await insertCategory(newCategory);

    res.sendStatus(201);
  } catch (err) {
    console.error("Error while creating category", err.message);
    res.sendStatus(500);
  }
}
