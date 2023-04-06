export interface Poll {
  id: number;
  title: string;
  description: string;
  expired: boolean;
  expiry_date: string;
  total_vote_count: number;
  choices_with_vote_percentage: {
    id: number;
    choice_text: string;
    vote_count: number;
    vote_percentage: number;
  }[];
}
