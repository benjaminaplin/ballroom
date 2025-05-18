export type BallroomData = {
  total_leaders: number;
  total_followers: number;
  dance_styles: string[];
  leader_knowledge: Record<string, string[]>;
  follower_knowledge: Record<string, string[]>;
  dance_duration_minutes: number;
};
