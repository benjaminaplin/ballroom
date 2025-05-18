import request from "supertest";
import express from "express";
import ballroomRouter from "./ballroomRouter";

describe("Ballroom API Routes", () => {
  const app = express();
  app.use(express.json());
  app.use("/ballroom", ballroomRouter);

  const payload = {
    total_leaders: 3,
    total_followers: 3,
    dance_styles: ["Waltz", "Tango"],
    leader_knowledge: {
      1: ["Waltz"],
      2: ["Foxtrot"],
      3: ["Waltz", "Foxtrot"]
    },
    follower_knowledge: {
      A: ["Waltz", "Tango", "Foxtrot"],
      B: ["Tango"],
      C: ["Waltz"]
    },
    "dance_duration_minutes": 120
  };
  
  const response = {
    "data": {
        "numDancesDanced": 24,
        "avgDancePartners": 2,
        "partnerMap": {
            "1": [
                "A",
                "C"
            ],
            "2": [
                "A"
            ],
            "3": [
                "A",
                "C"
            ],
            "A": [
                "1",
                "2",
                "3"
            ],
            "C": [
                "1",
                "3"
            ]
        }
    }
}

  it("POST /ballroom/calculate-partners should echo data", async () => {
    const res = await request(app)
      .post("/ballroom/calculate-partners")
      .send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(response);
  });

  it("POST /ballroom/calculate-partners should return 500 if handler throws", async () => {
    // Mock calculatePartners to throw an error
    jest.resetModules();
    jest.doMock("./ballroomHandlers", () => ({
      calculatePartners: () => {
        throw new Error("Test error");
      }
    }));
    const mockedRouter = (await import("./ballroomRouter")).default;
    const errorApp = express();
    errorApp.use(express.json());
    errorApp.use("/ballroom", mockedRouter);

    const res = await request(errorApp)
      .post("/ballroom/calculate-partners")
      .send(payload);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });

    jest.dontMock("./ballroomHandlers");
  });
});
