import { matchLeadersAndFollowers, calculatePartners, calculateAvgDancePartners, randomlySelectMatches } from "./ballroomHandlers";
import { BallroomData } from "../../types/ballroom";

// Mock data for tests
const leader_knowledge = {
    leader1: ["waltz", "tango"],
    leader2: ["waltz", "foxtrot"],
};

const follower_knowledge = {
    follower1: ["waltz", "quickstep"],
    follower2: ["tango", "foxtrot"],
};

describe("matchLeadersAndFollowers", () => {
    it("should return all leader-follower pairs with shared dances", () => {
        const matches = matchLeadersAndFollowers(leader_knowledge, follower_knowledge);
        expect(matches).toEqual(
            expect.arrayContaining([
                { leader: "leader1", follower: "follower1", sharedDance: "waltz" },
                { leader: "leader1", follower: "follower2", sharedDance: "tango" },
                { leader: "leader2", follower: "follower1", sharedDance: "waltz" },
                { leader: "leader2", follower: "follower2", sharedDance: "foxtrot" },
            ])
        );
        expect(matches.length).toBe(4);
    });

    it("should return empty array if no shared dances", () => {
        const leaders = { l1: ["waltz"] };
        const followers = { f1: ["tango"] };
        const matches = matchLeadersAndFollowers(leaders, followers);
        expect(matches).toEqual([]);
    });
});

describe("calculatePartners", () => {
    const data: BallroomData = {
        total_leaders: 3,
        total_followers: 3,
        dance_styles: ["Waltz", "Tango", "Foxtrot"],
        leader_knowledge: {
            1: ["Waltz", "Tango"],
            2: ["Foxtrot"],
            3: ["Waltz", "Foxtrot"]
        },
        follower_knowledge: {
            A: ["Waltz", "Tango", "Foxtrot"],
            B: ["Tango"],
            C: ["Waltz"]
        },
        dance_duration_minutes: 120
    }

    it("should calculate the correct number of dances and average partners", () => {
        const result = calculatePartners(data);
        expect(result.numDancesDanced).toBeLessThanOrEqual(24);
        expect(result.avgDancePartners).toBeGreaterThan(1.5);
    });

    it("should handle zero dance duration", () => {
        const zeroData = { ...data, dance_duration_minutes: 0 };
        const result = calculatePartners(zeroData);
        expect(result.numDancesDanced).toBe(0);
        expect(result.avgDancePartners).toBeGreaterThanOrEqual(1);
    });

    it("should handle no possible matches", () => {

        const noMatchData: BallroomData = {
          leader_knowledge: { l1: ["waltz"] },
          follower_knowledge: { f1: ["tango"] },
          dance_duration_minutes: 10,
          total_leaders: 0,
          total_followers: 0,
          dance_styles: []
        };
        const result = calculatePartners(noMatchData);
        expect(result.numDancesDanced).toBe(0);
        expect(result.avgDancePartners).toBeNaN();
    });
});

describe("randomlySelectMatches", () => {
    const matches = [
        { leader: "leader1", follower: "follower1", sharedDance: "waltz" },
        { leader: "leader1", follower: "follower2", sharedDance: "tango" },
        { leader: "leader2", follower: "follower1", sharedDance: "waltz" },
        { leader: "leader2", follower: "follower2", sharedDance: "foxtrot" },
    ];

    it("should select up to numPossibleDances unique matches", () => {
        const numPossibleDances = 2;
        const selected = randomlySelectMatches(matches, numPossibleDances);
        expect(selected.length).toBeLessThanOrEqual(numPossibleDances);
        // All selected matches should be from the original matches
        selected.forEach((match: any) => {
            expect(matches).toContainEqual(match);
        });
    });

    it("should return all matches if numPossibleDances >= matches.length", () => {
        const numPossibleDances = 10;
        const selected = randomlySelectMatches(matches, numPossibleDances);
        // All matches should be present
        matches.forEach(match => {
            expect(selected).toContainEqual(match);
        });
        // Should not contain more unique matches than available
        expect(new Set(selected.map(m => JSON.stringify(m))).size).toBe(matches.length);
    });

    it("should return empty array if matches is empty", () => {
        const selected = randomlySelectMatches([], 3);
        expect(selected).toEqual([]);
    });

    it("should return empty array if numPossibleDances is 0", () => {
        const selected = randomlySelectMatches(matches, 0);
        expect(selected).toEqual([]);
    });
});

describe("calculateAvgDancePartners", () => {

    it("should return correct average partners for multiple matches", () => {
        const matches = [
            { leader: "l1", follower: "f1", sharedDance: "waltz" },
            { leader: "l1", follower: "f2", sharedDance: "tango" },
            { leader: "l2", follower: "f1", sharedDance: "waltz" },
        ];
        // l1: f1, f2; l2: f1; f1: l1, l2; f2: l1
        // l1: 2, l2: 1, f1: 2, f2: 1 => (2+1+2+1)/4 = 1.5
        expect(calculateAvgDancePartners(matches).avgDancePartners).toBe(1.5);
    });

    it("should return 0 for empty matches", () => {
        expect(calculateAvgDancePartners([])).toStrictEqual({"avgDancePartners": NaN, "partnerMap": {}});
    });

    it("should handle one match", () => {
        const matches = [
            { leader: "l1", follower: "f1", sharedDance: "waltz" }
        ];
        // l1: f1, f1: l1 => (1+1)/2 = 1
        expect(calculateAvgDancePartners(matches).avgDancePartners).toBe(1);
    });

    it("should handle duplicate matches (should not double-count partners)", () => {
        const matches = [
            { leader: "l1", follower: "f1", sharedDance: "waltz" },
            { leader: "l1", follower: "f1", sharedDance: "tango" }
        ];
        // l1: f1, f1: l1 => (1+1)/2 = 1
        expect(calculateAvgDancePartners(matches).avgDancePartners).toBe(1);
    });

    it("should handle matches with more than two people", () => {
        const matches = [
            { leader: "l1", follower: "f1", sharedDance: "waltz" },
            { leader: "l2", follower: "f2", sharedDance: "tango" },
            { leader: "l1", follower: "f2", sharedDance: "foxtrot" },
        ];
        // l1: f1, f2; l2: f2; f1: l1; f2: l2, l1
        // l1:2, l2:1, f1:1, f2:2 => (2+1+1+2)/4 = 1.5
        expect(calculateAvgDancePartners(matches).avgDancePartners).toBe(1.5);
    });
});