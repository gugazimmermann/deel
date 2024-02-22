const supertest = require("supertest");
const sequelizeMock = require("sequelize-mock");
const app = require("../app");

const dbMock = new sequelizeMock();
const ProfileMock = dbMock.define("Profile");
const JobMock = dbMock.define("Job");

ProfileMock.update = jest.fn();

app.get("models").Profile = ProfileMock;
app.get("models").Job = JobMock;

describe("jobs", () => {
  beforeEach(() => {
    ProfileMock.$queueResult([ProfileMock.build()]);
  });

  afterEach(() => {
    ProfileMock.$clearQueue();
    JobMock.$clearQueue();
    jest.clearAllMocks();
  });

  describe("getJobsUnpaid", () => {
    test("should return job", async () => {
      JobMock.$queueResult([JobMock.build({price: 99})]);
      const res = await supertest(app).get("/jobs/unpaid");
      expect(res.statusCode).toBe(200);
      expect(res.body[0].price).toBe(99);
    });

    test("should return empty array when no unpaid job is found", async () => {
      JobMock.$queueResult([]);
      const res = await supertest(app).get("/jobs/unpaid");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(0);
    });
  });

  describe("payJob", () => {
    it("should return error when not found", async () => {
      JobMock.$queueResult(null);
      const response = await supertest(app).post("/jobs/999/pay");
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("Not Found");
    });

    it("should return error when insufficient funds", async () => {
      JobMock.$queueResult(
        JobMock.build({
          id: 2,
          price: 500,
          paid: false,
          Contract: {ClientId: 1, ContractorId: 2, Client: {balance: 200}},
        }),
      );
      const response = await supertest(app).post("/jobs/2/pay");
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Insufficient Funds");
    });

    it("should should success", async () => {
      const mockJob = {
        id: 3,
        price: 100,
        paid: false,
        Contract: {
          ClientId: 1,
          ContractorId: 2,
          Client: {id: 1, balance: 300},
          Contractor: {id: 2, balance: 100},
        },
        update: jest.fn(),
      };
      JobMock.$queueResult(JobMock.build(mockJob));
      const response = await supertest(app).post("/jobs/3/pay");
      expect(ProfileMock.update).toHaveBeenCalledTimes(2);
      expect(mockJob.update).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Job Paid");
    });
  });
});
