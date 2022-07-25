import { findCategory } from "../databases/dbManager.js";
import categorySchema from "../schemas/categorySchema.js";

export default async function validateCategory(req, res, next) {
  try {
    const newCategory = req.body;
    const validate = categorySchema.validate(newCategory);

    if (validate.error) {
      return res.status(400).send(validate.error.details[0].message);
    }

    const categoryExists = await findCategory(newCategory);

    if (categoryExists) {
      return res.status(409).send("Categoria já existente");
    }

    next();
  } catch (err) {
    console.error("Error while validating category", err.message);
    res.sendStatus(500);
  }
}
