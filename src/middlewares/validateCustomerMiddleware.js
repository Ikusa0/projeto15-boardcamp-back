import { findCustomer, findCustomerById } from "../databases/dbManager.js";
import customerSchema from "../schemas/customerSchema.js";

export default async function validateCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const newCustomer = req.body;
    const validate = customerSchema.validate(newCustomer);

    if (validate.error) {
      return res.status(400).send(validate.error.details[0].message);
    }

    const customerExists = await findCustomer(newCustomer);
    let oldCustomer;

    if (id) {
      oldCustomer = await findCustomerById(id);

      if (!oldCustomer) {
        return res.sendStatus(404);
      }
    }

    let isCpfFromOldCustomer = false;

    if (oldCustomer) {
      isCpfFromOldCustomer = oldCustomer.cpf === newCustomer.cpf;
    }

    if (customerExists && !isCpfFromOldCustomer) {
      return res.status(409).send("Usuário já existente");
    }

    next();
  } catch (err) {
    console.error("Error while validating customer", err.message);
    res.sendStatus(500);
  }
}
