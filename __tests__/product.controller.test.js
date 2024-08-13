const request = require("supertest");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("../routes/product.routes");
const Product = require("../models/product");

const app = express();
app.use(bodyParser.json());
app.use("/api/products", productRoutes);

jest.setTimeout(30000);

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

describe("Product Controller Tests", () => {
  let mongooseConnection;

  beforeAll(async () => {
    mongooseConnection = await connectDB();
  });

  afterAll(async () => {
    await disconnectDB(mongooseConnection);
  });

  beforeEach(async () => {
    await Product.deleteMany(); // Clear users collection before each test
  });

  test("should create a new product", async () => {
    const response = await request(app)
      .post("/api/products")
      .send({ name: "CocaCola", category: "Minuman", price: 1000 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name", "CocaCola");
    expect(response.body).toHaveProperty("price", 1000);
  });
  test("should get a product by ID", async () => {
    const product = await Product.create({
      name: "Test Product",
      price: 9.99,
      category: "electronics",
    });

    const response = await request(app).get(`/api/products/${product._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", "Test Product");
  });

  test("should update a product", async () => {
    const product = await Product.create({
      name: "Old Name",
      price: 9.99,
      category: "electronics",
    });

    const response = await request(app)
      .put(`/api/products/${product._id}`)
      .send({ name: "New Name", price: 19.99 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", "New Name");
    expect(response.body).toHaveProperty("price", 19.99);
  });

  test("should delete a product", async () => {
    const product = await Product.create({
      name: "To Delete",
      price: 9.99,
      category: "electronics",
    });

    const response = await request(app).delete(`/api/products/${product._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Product deleted successfully"
    );
  });

  test("should search products", async () => {
    await Product.create({
      name: "Laptop",
      price: 999.99,
      category: "electronics",
    });
    await Product.create({
      name: "Phone",
      price: 499.99,
      category: "electronics",
    });

    const response = await request(app).get(
      "/api/products/search?query=Laptop"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("name", "Laptop");
  });

  test("should get products by category", async () => {
    await Product.create({
      name: "Laptop",
      price: 999.99,
      category: "electronics",
    });
    await Product.create({ name: "Book", price: 19.99, category: "books" });

    const response = await request(app).get(
      "/api/products/category/electronics"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("category", "electronics");
  });
});
