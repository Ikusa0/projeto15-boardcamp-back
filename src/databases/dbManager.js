import connection from "./postgresql.js";
import dayjs from "dayjs";

export async function listCategories() {
  const { rows: categories } = await connection.query("SELECT * FROM categories");
  return categories;
}

export async function insertCategory(category) {
  await connection.query("INSERT INTO categories(name) VALUES ($1)", [category.name]);
}

export async function findCategory(category) {
  const { rows: categoryFound } = await connection.query("SELECT * FROM categories WHERE name = $1 LIMIT 1", [
    category.name,
  ]);
  return categoryFound[0];
}

export async function findCategoryById(categoryId) {
  const { rows: categoryFound } = await connection.query("SELECT * FROM categories WHERE id = $1 LIMIT 1", [
    categoryId,
  ]);
  return categoryFound[0];
}

export async function listGames(name) {
  let games;
  if (name) {
    const { rows } = await connection.query("SELECT * FROM games WHERE name ILIKE $1 || '%'", [name]);
    games = rows;
  } else {
    const { rows } = await connection.query("SELECT * FROM games");
    games = rows;
  }
  return games;
}

export async function findGame(game) {
  const { rows: gameFound } = await connection.query("SELECT * FROM games WHERE name = $1 LIMIT 1", [game.name]);
  return gameFound[0];
}

export async function findGameById(gameId) {
  const { rows: gameFound } = await connection.query(`SELECT * FROM games WHERE id = $1 LIMIT 1`, [gameId]);
  return gameFound[0];
}

export async function insertGame(game) {
  await connection.query(
    `INSERT INTO games(name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`,
    Object.values(game)
  );
}

export async function listCustomers(cpf) {
  let customers;

  if (cpf) {
    const { rows } = await connection.query("SELECT * FROM customers WHERE cpf ILIKE $1 || '%'", [cpf]);
    customers = rows;
  } else {
    const { rows } = await connection.query("SELECT * FROM customers");
    customers = rows;
  }

  return customers;
}

export async function findCustomer(customer) {
  const { rows: customerFound } = await connection.query("SELECT * FROM customers WHERE cpf = $1 LIMIT 1", [
    customer.cpf,
  ]);
  return customerFound[0];
}

export async function findCustomerById(customerId) {
  const { rows: customerFound } = await connection.query("SELECT * FROM customers WHERE id = $1 LIMIT 1", [customerId]);
  return customerFound[0];
}

export async function insertCustomer(customer) {
  await connection.query(
    `INSERT INTO customers(name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
    Object.values(customer)
  );
}

export async function updateCustomer(customer, customerId) {
  await connection.query("UPDATE customers SET (name, phone, cpf, birthday) = ($1, $2, $3, $4) WHERE id = $5", [
    ...Object.values(customer),
    customerId,
  ]);
}

export async function countGameRentals(gameId) {
  const { rowCount: gameRentalsQtd } = await connection.query(
    `SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL`,
    [gameId]
  );
  return gameRentalsQtd;
}

export async function findRentalById(rentalId) {
  const { rows: rental } = await connection.query("SELECT * FROM rentals WHERE id = $1", [rentalId]);
  return rental[0];
}

export async function insertRental(rental) {
  const rentDate = dayjs().format("YYYY-MM-DD");
  const game = await findGameById(rental.gameId);
  const originalPrice = game.pricePerDay * rental.daysRented;

  await connection.query(
    `INSERT INTO rentals("customerId", "gameId", "daysRented", "rentDate", "originalPrice") VALUES ($1, $2, $3, $4, $5)`,
    [...Object.values(rental), rentDate, originalPrice]
  );
}

export async function listRentals(gameId, customerId) {
  let constraints = "";
  if (gameId && customerId) {
    constraints = `WHERE "gameId" = ${gameId} AND "customerId" = ${customerId}`;
  } else {
    if (gameId) {
      constraints = `WHERE "gameId" = ${gameId}`;
    }
    if (customerId) {
      constraints = `WHERE "customerId" = ${customerId}`;
    }
  }

  const { rows: rentals } = await connection.query(
    `SELECT rentals.*, 
            json_build_object('id', customers.id, 'name', customers.name) AS customer, 
            json_build_object('id', games.id, 'name', games.name, 'categoryId', categories.id, 'categoryName', categories.name) AS game
    FROM rentals 
    JOIN customers 
    ON "customerId" = customers.id 
    JOIN games 
    ON "gameId" = games.id
    JOIN categories
    ON games."categoryId" = categories.id ` + constraints
  );

  return rentals;
}

export async function updateRental(rentalId) {
  const rental = findRentalById(rentalId);
  const game = await findGameById(rental.gameId);
  const returnDate = String(dayjs().format("YYYY-MM-DD"));
  const daysLate = dayjs().diff(rental.rentDate, "day");
  const delayFee = daysLate > rental.daysRented ? daysLate * game.pricePerDay : 0;

  await connection.query(`UPDATE rentals SET "returnDate" = ${returnDate}, "delayFee" = ${delayFee} WHERE id = $1`, [
    rentalId,
  ]);
}

export async function deleteRental(rentalId) {
  await connection.query(`DELETE FROM rentals WHERE id = $1`, [rentalId]);
}
