const supertest = require("supertest");
const sequelizeMock = require("sequelize-mock");
const app = require("../app");

const dbMock = new sequelizeMock();
const ProfileMock = dbMock.define("Profile");
const ContractMock = dbMock.define("Contract");

app.get("models").Profile = ProfileMock;
app.get("models").Contract = ContractMock;

describe("Contracts", () => {
  afterEach(() => {
    ProfileMock.$clearQueue();
    ContractMock.$clearQueue();
    jest.clearAllMocks();
  });

  describe("getContractById", () => {
    test("should failt without profile id", async () => {
      ProfileMock.$queueResult(null);
      const res = await supertest(app).get("/contracts/");
      expect(res.statusCode).toBe(401);
    });

    test("should return contract", async () => {
      ProfileMock.$queueResult([ProfileMock.build()]);
      ContractMock.$queueResult([
        ContractMock.build({id: 1, terms: "terms test 1", status: "terminated", ClientId: 1, ContractorId: 5}),
      ]);
      const res = await supertest(app).get("/contracts/");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0].terms).toBe("terms test 1");
    });
  });

  describe("getContractsList", () => {
    test("should return contract", async () => {
      ProfileMock.$queueResult(ProfileMock.build());
      ContractMock.$queueResult(
        ContractMock.build({id: 2, terms: "terms test 2", status: "in_progress", ClientId: 1, ContractorId: 6}),
      );
      const res = await supertest(app).get("/contracts/2");
      expect(res.statusCode).toBe(200);
      expect(res.body.terms).toBe("terms test 2");
    });

    test("should not return contract", async () => {
      ProfileMock.$queueResult(ProfileMock.build());
      ContractMock.$queueResult(null);
      const res = await supertest(app).get("/contracts/3");
      expect(res.statusCode).toBe(404);
    });
  });
});
