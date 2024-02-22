const supertest = require("supertest");
const sequelizeMock = require("sequelize-mock");
const app = require("../app");

const dbMock = new sequelizeMock();
const JobMock = dbMock.define("Job");

app.get("models").Job = JobMock;

describe("Admin", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("bestProfession", () => {
    test("should return not found", async () => {
      JobMock.$queueResult([]);
      const response = await supertest(app).get("/admin/best-profession?start=2024-08-01&end=2024-12-31");
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toEqual("Not Found");
    });

    test("should return most paid profession", async () => {
      JobMock.$queueResult([
        JobMock.build({
          total: "1000",
          profession: "Full Stack Developer",
        }),
      ]);
      const response = await supertest(app).get("/admin/best-profession?start=2019-01-01&end=2023-12-31");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        profession: "Full Stack Developer",
        total: "1000",
      });
    });
  });

  describe('bestClients', () => {
    test('should return 2 when limit is not set', async () => {
      JobMock.$queueResult([
        JobMock.build({
          "Contract.Client.id": 1,
          fullName: "John Doe",
          paid: "1500",
        }),
        JobMock.build({
          "Contract.Client.id": 2,
          fullName: "Jane Doe",
          paid: "1000",
        })
      ]);
      const response = await supertest(app).get('/admin/best-clients?start=2019-01-01&end=2023-12-31');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        { id: 1, fullName: "John Doe", paid: "1500.00" },
        { id: 2, fullName: "Jane Doe", paid: "1000.00" }
      ]);
    });

    test('should return 3 when limit is set to 3', async () => {
      JobMock.$queueResult([
        JobMock.build({
          "Contract.Client.id": 1,
          fullName: "John Doe",
          paid: "1500",
        }),
        JobMock.build({
          "Contract.Client.id": 2,
          fullName: "Jane Doe",
          paid: "1000",
        }),
        JobMock.build({
          "Contract.Client.id": 3,
          fullName: "Mary Marie",
          paid: "500",
        })
      ]);
      const response = await supertest(app).get('/admin/best-clients?start=2019-01-01&end=2023-12-31&limit=3');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        { id: 1, fullName: "John Doe", paid: "1500.00" },
        { id: 2, fullName: "Jane Doe", paid: "1000.00" },
        { id: 3, fullName: "Mary Marie", paid: "500.00" }
      ]);
    });

    test('should return empty array when no result is found', async () => {
      JobMock.$queueResult([]);
      const response = await supertest(app).get('/admin/best-clients?start=2024-08-01&end=2024-12-31');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toEqual(0);
    });
  });
  
});
