import request from "supertest";
import express from "express";
import ballroomRouter from "./ballroomRouter";

describe("Ballroom API Routes", () => {
  const app = express();
  app.use(express.json());
  app.use("/ballroom", ballroomRouter);

  it("POST /ballroom/calculate-partners should echo data", async () => {
    const payload = { data: "test" };
    const res = await request(app)
      .post("/ballroom/calculate-partners")
      .send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: "test" });
  });
});
