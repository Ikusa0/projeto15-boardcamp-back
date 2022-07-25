import { listCustomers, insertCustomer, findCustomerById, updateCustomer } from "../databases/dbManager.js";

export async function getCustomers(req, res) {
  try {
    const { cpf } = req.query;

    const customers = await listCustomers(cpf);

    res.status(200).send(customers);
  } catch (err) {
    console.error("Error while getting customers", err.message);
    res.sendStatus(500);
  }
}

export async function createCustomer(req, res) {
  try {
    const newCustomer = req.body;

    await insertCustomer(newCustomer);

    res.sendStatus(201);
  } catch (err) {
    console.error("Error while creating customer", err.message);
    res.sendStatus(500);
  }
}

export async function getCustomerById(req, res) {
  try {
    const { id } = req.params;

    const customer = await findCustomerById(id);

    if (!customer) {
      return res.sendStatus(404);
    }

    res.status(200).send(customer);
  } catch (err) {
    console.error("Error while getting customer by id", err.message);
    res.sendStatus(500);
  }
}

export async function changeCustomer(req, res) {
  try {
    const { id } = req.params;
    const newCustomer = req.body;

    await updateCustomer(newCustomer, id);

    res.sendStatus(200);
  } catch (err) {
    console.error("Error while updating customer", err.message);
    res.sendStatus(500);
  }
}
