const request = require("supertest");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("../routes/index.routes");
const User = require("../models/user");

jest.setTimeout(30000); // Set timeout to 30 seconds for all tests in this file

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/api", routes);

const connectDB = async () => {
  try {
    const uri = "mongodb://127.0.0.1:27017/test_database";
    return await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const disconnectDB = async (mongoose) => {
  await mongoose.connection.close();
};

describe("User Controller Tests", () => {
  let mongooseConnection;

  beforeAll(async () => {
    mongooseConnection = await connectDB();
  });

  afterAll(async () => {
    await disconnectDB(mongooseConnection);
  });

  beforeEach(async () => {
    await User.deleteMany(); // Clear users collection before each test
  });

  test("should create a new user", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ name: "John Doe", email: "john@example.com", age: 30 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name", "John Doe");
    expect(response.body).toHaveProperty("email", "john@example.com");
  }, 10000);

  test("should get all users", async () => {
    await User.create({ name: "Jane Doe", email: "jane@example.com", age: 25 });

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("name", "Jane Doe");
  }, 10000);

  test("should update a user by ID", async () => {
    const user = await User.create({
      name: "Alice",
      email: "alice@example.com",
      age: 28,
    });

    const response = await request(app).put(`/api/users/${user._id}`).send({
      name: "Alice Updated",
      email: "alice_updated@example.com",
      age: 29,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", "Alice Updated");
    expect(response.body).toHaveProperty("email", "alice_updated@example.com");
  }, 10000);

  test("should delete a user by ID", async () => {
    const user = await User.create({
      name: "Bob",
      email: "bob@example.com",
      age: 40,
    });

    const response = await request(app).delete(`/api/users/${user._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "User deleted");
  }, 10000);
});
