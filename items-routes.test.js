process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");


let newItem = { name: "popsicle", price: 1.45 }



beforeEach(function () {
    items.push(newItem);
});

afterEach(function () {
    items = []
    // items.length = 0;
});

describe("GET /items", function () {
    test("Gets a list of items", async () => {
        const res = await request(app).get(`/items`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual([newItem]);
    });
});

describe("GET /items/:name", function () {
    test("Gets a single item", async function () {
        const res = await request(app).get(`/items/${newItem.name}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(newItem);
    });

    test("Responds with 404 if can't find item", async function () {
        const res = await request(app).get(`/items/0`);
        expect(res.status).toBe(404);
    });
});

describe("POST /items", function () {
    test("Creating a list item", async () => {
        const res = await request(app).post(`/items`).send(newItem);
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ added: newItem });
    });
    test("Responds with 400 if name and price is missing", async () => {
        const res = await request(app).post(`/items`).send({});
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Both name and price are required' });
    })
    test("Responds with 400 if invalid price ", async () => {
        const res = await request(app).post(`/items`).send({ name: 'invalid item', price: 'invalid' });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Invalid price' });
    })

});

describe("PATCH /items/:name", function () {
    test("Updates a single item", async () => {
        const res = await request(app).patch(`/items/${newItem.name}`).send({ name: "icecream", price: 1.45 });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            updated: { name: "icecream", price: 1.45 }
        });
    });

    test("Responds with 404 if id invalid", async () => {
        const res = await request(app).patch(`/items/0`);
        expect(res.status).toBe(404);
    });
});

describe("DELETE /items/:name", function () {
    test("Deletes a single item", async () => {
        const res = await request(app).delete(`/items/${newItem.name}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Deleted" });
    });
});