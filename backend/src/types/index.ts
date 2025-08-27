export interface Race {
  id: number;
  name: string;
  description?: string;
  date: string;
  location?: string;
  distance?: string;
  race_type?: string;
  medal_image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface RaceStat {
  id: number;
  race_id: number;
  participant_name: string;
  bib_number: string;
  finish_time?: string;
  overall_place?: number;
  age_group_place?: number;
  age_group?: string;
  gender?: string;
  city?: string;
  state?: string;
  country?: string;
  created_at: Date;
}

export interface UserMedal {
  id: number;
  user_id: string;
  race_id: number;
  race_stat_id?: number;
  medal_image_url?: string;
  claimed_at: Date;
  notes?: string;
  full_name?: string;
  is_verified: boolean;
}

export interface UserMedalWithDetails extends UserMedal {
  race: Race;
  race_stat?: RaceStat;
}
