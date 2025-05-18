import { BallroomData} from "../../types/ballroom"
import { intersection } from "ramda";

type Match = {
  leader: string;
  follower: string;
  sharedDance: string;
};

const AVG_DANCE_TIME = 5

export const matchLeadersAndFollowers = (
    leader_knowledge: BallroomData['leader_knowledge'],
    follower_knowledge: BallroomData['follower_knowledge']
) => {
    const matches: Match[] = [];
    for (const [leaderId, leaderDances] of Object.entries(leader_knowledge)) {
        for (const [followerId, followerDances] of Object.entries(follower_knowledge)) {
             const sharedDances = intersection(leaderDances, followerDances);
            sharedDances.forEach((dance: string)=> {
                matches.push({ leader: leaderId, follower: followerId, sharedDance: dance });
            })
        }
    }
    return matches;
}

const randomlySelectMatches = (matches: Match[], numPossibleDances: number) => {
    const matchesToDance = [...matches]
    let dance = 0;
    const dancesDanced = []
    while (dance < numPossibleDances) {
        if (matchesToDance.length === 0) break;
        const randomIndex = Math.floor(Math.random() * matchesToDance.length);
        const selectedMatch = matchesToDance[randomIndex]
        dancesDanced.push(selectedMatch);
        dance++;
    }
    return dancesDanced  
}

export const calculateAvgDancePartners = (matches: Match[]) => {

    const partnerMap: Record<string, Set<string>> = {};

    matches.forEach(({ leader, follower }) => {
        if (!partnerMap[leader]) partnerMap[leader] = new Set();
        if (!partnerMap[follower]) partnerMap[follower] = new Set();
        partnerMap[leader].add(follower);
        partnerMap[follower].add(leader);
    });
    
    console.log("🚀 ~ calculateAvgDancePartners ~ partnerMap:", partnerMap)
    console.log("🚀 ~ calculateAvgDancePartners ~ Object.keys(partnerMap):", Object.keys(partnerMap))
    console.log("🚀 ~ calculateAvgDancePartners ~ Object.values(partnerMap):", Object.values(partnerMap))

    const totalPossiblePartners = Object.values(partnerMap).reduce((sum, partners) => sum + partners.size, 0);
    console.log("🚀 ~ calculateAvgDancePartners ~ totalPossiblePartners:", totalPossiblePartners)
    const avgPartners = totalPossiblePartners / Object.keys(partnerMap).length;
    return avgPartners;
};


export const calculatePartners = (data: BallroomData) => {
    const numPossibleDances = Math.floor(data.dance_duration_minutes / AVG_DANCE_TIME)
    console.log("🚀 ~ calculatePartners ~ numPossibleDances:", numPossibleDances)
    const matches = matchLeadersAndFollowers(data.leader_knowledge, data.follower_knowledge);
    const avgDancePartners = calculateAvgDancePartners(matches)
    const dancesDanced = randomlySelectMatches(matches, numPossibleDances);
    return {numDancesDanced: dancesDanced.length, avgDancePartners}
}