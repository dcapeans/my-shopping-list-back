import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';

beforeAll(async () => {
    await connection.query(`
        INSERT INTO items (name)
        VALUES ($1)
    `, ["teste"])
})

afterAll(async () => {
    await connection.query(`
        DELETE from items
    `)
    connection.end();
})


describe("GET /list", () => {
    it("returns status 200 and list of items for sucess", async () => {
        await connection.query(`
            SELECT * from items
        `)
        const result = await supertest(app).get("/list");
        expect(result.status).toEqual(200);

        expect(result.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String)
                })
            ])
        );
    });
});

describe("POST /new-item", () => {
    it("returns status 201 for creation success", async () => {
        const body = {text: "teste"}

        const result = await supertest(app).post("/new-item").send(body)
        expect(result.status).toEqual(201)
    })
})