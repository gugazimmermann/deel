const supertest = require("supertest");
const sequelizeMock = require("sequelize-mock");
const app = require("../app");

const dbMock = new sequelizeMock();
const JobMock = dbMock.define("Job");
const ProfileMock = dbMock.define("Profile");

app.get("models").Job = JobMock;
app.get("models").Profile = ProfileMock;

describe("Balances", () => {
  afterEach(() => {
    JobMock.$clearQueue();
    ProfileMock.$clearQueue();
    jest.clearAllMocks();
  });

  describe("deposit", () => {
    test("should prevent unauthorized deposits", async () => {
      ProfileMock.$queueResult(ProfileMock.build({id: 2, balance: 1000, type: "client"}));
      const response = await supertest(app).post("/balances/deposit/1").send({amount: 100}).set("profile_id", 2);
      expect(response.statusCode).toBe(403);
    });

    test("should prevent deposits when not a client", async () => {
      ProfileMock.$queueResult(ProfileMock.build({id: 1, balance: 1000, type: "contractor"}));
      const response = await supertest(app).post("/balances/deposit/1").send({amount: 100}).set("profile_id", 1);
      expect(response.statusCode).toBe(403);
    });

    test("should prevent deposits that exceed 25% of of total unpaid jobs", async () => {
      JobMock.$queryInterface.$useHandler(query => {
        if (query === "sum") return 400;
      });
      ProfileMock.$queueResult(ProfileMock.build({id: 1, balance: 1000, type: "client"}));
      const response = await supertest(app).post("/balances/deposit/1").send({amount: 200}).set("profile_id", 1);
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Deposit exceeds 25% of total unpaid jobs.");
    });

    test("should make the deposit with success", async () => {
      const currentValue = 1000;
      const amount = 100;
      JobMock.$queryInterface.$useHandler(query => {
        if (query === "sum") return 400;
      });
      ProfileMock.$queueResult(ProfileMock.build({id: 1, balance: currentValue, type: "client"}));
      ProfileMock.update = jest.fn();
      ProfileMock.findByPk = jest.fn();
      ProfileMock.findByPk.mockResolvedValue({balance: currentValue + amount});
      const response = await supertest(app).post("/balances/deposit/1").send({amount}).set("profile_id", 1);
      expect(ProfileMock.update).toHaveBeenCalledTimes(1);
      expect(ProfileMock.update).toHaveBeenCalledWith({balance: {val: `balance + ${amount}`}}, {where: {id: "1"}});
      expect(ProfileMock.findByPk).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({newBalance: currentValue + amount});
    });
  });
});
