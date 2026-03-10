export interface HenrikAccount {
  puuid: string;
  region: string;
  account_level: number;
  name: string;
  tag: string;
  card: {
    small: string;
    large: string;
    wide: string;
    id: string;
  };
  last_update: string;
  last_update_raw: number;
}

export interface HenrikAccountV2 {
  puuid: string;
  region: string;
  account_level: number;
  name: string;
  tag: string;
  card: string;
  title: string;
  platforms: string[];
  updated_at: string;
}

export interface MMRDetails {
  currenttier: number;
  currenttierpatched: string;
  ranking_in_tier: number;
  mmr_change_to_last_game: number;
  elo: number;
  wins: number;
  losses: number;
  ties: number;
  number_of_games: number;
  leaderboard_rank: number;
}

export interface Match {
  metadata: {
    match_id: string;
    game_version: string;
    game_length_in_ms: number;
    started_at: string;
    is_completed: boolean;
    queue: {
      id: string;
      name: string;
      mode_type: string;
    };
    season: {
      id: string;
      short: string;
    };
    platform: string;
    premier: any;
    party_rr_penalties: any[];
    map: {
      id: string;
      name: string;
    };
  };
  players: Array<{
    puuid: string;
    name: string;
    tag: string;
    team_id: string;
    platform: string;
    party_id: string;
    agent: {
      id: string;
      name: string;
    };
    stats: {
      score: number;
      kills: number;
      deaths: number;
      assists: number;
      headshots: number;
      bodyshots: number;
      legshots: number;
      damage: {
        dealt: number;
        received: number;
      };
    };
    ability_casts: {
      grenade: number;
      ability1: number;
      ability2: number;
      ultimate: number;
    };
    tier: {
      id: number;
      name: string;
    };
    customization: {
      card: string;
      title: string;
      preferred_level_border: string | null;
    };
    account_level: number;
    session_playtime_in_ms: number;
    behavior: {
      afk_rounds: number;
      friendly_fire: {
        incoming: number;
        outgoing: number;
      };
      rounds_in_spawn: number;
    };
    economy: {
      spent: {
        overall: number;
        average: number;
      };
      loadout_value: {
        overall: number;
        average: number;
      };
    };
  }>;
  observers?: Array<{
    puuid: string;
    name: string;
    tag: string;
    account_level: number;
    session_playtime_in_ms: number;
    card_id: string;
    title_id: string;
    party_id: string;
  }>;
  coaches?: Array<{
    puuid: string;
    team_id: string;
  }>;
  teams: Array<{
    team_id: string;
    rounds: {
      won: number;
      lost: number;
    };
    won: boolean;
    premier_roster?: {
      id: string;
      name: string;
      tag: string;
      members: string[];
      customization: {
        icon: string;
        image: string;
        primary_color: string;
        secondary_color: string;
        tertiary_color: string;
      };
    };
  }>;
  rounds: Array<{
    id: number;
    result: string;
    ceremony: string;
    winning_team: string;
    plant?: {
      round_time_in_ms: number;
      site: string;
      location: {
        x: number;
        y: number;
      };
      player: {
        puuid: string;
        name: string;
        tag: string;
        team: string;
      };
      player_locations: Array<{
        puuid: string;
        name: string;
        tag: string;
        team: string;
        view_radians: number;
        location: {
          x: number;
          y: number;
        };
      }>;
    };
    defuse?: {
      round_time_in_ms: number;
      location: {
        x: number;
        y: number;
      };
      player: {
        puuid: string;
        name: string;
        tag: string;
        team: string;
      };
      player_locations: Array<{
        puuid: string;
        name: string;
        tag: string;
        team: string;
        view_radians: number;
        location: {
          x: number;
          y: number;
        };
      }>;
    };
    stats: Array<{
      ability_casts: {
        grenade: number;
        ability1: number;
        ability2: number;
        ultimate: number;
      };
      player: {
        puuid: string;
        name: string;
        tag: string;
        team: string;
      };
      damage_events: Array<{
        puuid: string;
        name: string;
        tag: string;
        team: string;
        bodyshots: number;
        headshots: number;
        legshots: number;
        damage: number;
      }>;
      stats: {
        bodyshots: number;
        headshots: number;
        legshots: number;
        damage: number;
        kills: number;
        assists: number;
        score: number;
      };
      economy: {
        loadout_value: number;
        remaining: number;
        weapon: {
          id: string;
          name: string;
          type: string;
        };
        armor: {
          id: string;
          name: string;
        };
      };
      was_afk: boolean;
      received_penalty: boolean;
      stayed_in_spawn: boolean;
    }>;
  }>;
  kills?: Array<{
    round: number;
    time_in_round_in_ms: number;
    time_in_match_in_ms: number;
    killer: {
      puuid: string;
      name: string;
      tag: string;
      team: string;
    };
    victim: {
      puuid: string;
      name: string;
      tag: string;
      team: string;
    };
    assistants: Array<{
      puuid: string;
      name: string;
      tag: string;
      team: string;
    }>;
    location: {
      x: number;
      y: number;
    };
    weapon: {
      id: string;
      name: string;
      type: string;
    };
    secondary_fire_mode: boolean;
    player_locations: Array<{
      puuid: string;
      name: string;
      tag: string;
      team: string;
      view_radians: number;
      location: {
        x: number;
        y: number;
      };
    }>;
  }>;
}

export interface PlayerMatchStats {
  puuid: string;
  name: string;
  tag: string;
  team_id: string;
  character: string;
  stats: {
    score: number;
    kills: number;
    deaths: number;
    assists: number;
    bodyshots: number;
    headshots: number;
    legshots: number;
    damage_made: number;
    damage_received: number;
    ability_casts: {
      c_cast: number;
      q_cast: number;
      e_cast: number;
      x_cast: number;
      ultimate_casts: number;
    };
  };
  economy: {
    loadout_value: number;
    spent: number;
    saved: number;
  };
}

export interface AgentPerformance {
  agent: string;
  matches_played: number;
  wins: number;
  losses: number;
  win_rate: number;
  avg_kills: number;
  avg_deaths: number;
  avg_assists: number;
  kd_ratio: number;
  avg_score: number;
  headshot_percentage: number;
  avg_damage: number;
}

export interface WeaponStats {
  weapon: string;
  kills: number;
  headshots: number;
  bodyshots: number;
  legshots: number;
  accuracy: number;
  headshot_percentage: number;
  damage_per_kill: number;
}

class HenrikAPIClient {
  private apiKey: string;
  private baseURL = 'https://api.henrikdev.xyz';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': this.apiKey,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Henrik API Error: ${response.status} - ${response.statusText}. Details: ${errorText}`);
      }

      const data = await response.json();
      
      // Handle successful responses (status 200)
      if (data.status === 200) {
        return data.data;
      }
      
      // Handle API errors
      if (data.errors && Array.isArray(data.errors)) {
        const error = data.errors[0];
        throw new Error(`API Error: ${error.message || 'Unknown error'}`);
      }
      
      // Handle other error formats
      throw new Error(`API Error: ${data.message || data.error || 'Unknown error'}`);
    } catch (error) {
      throw error;
    }
  }

  async getAccount(name: string, tag: string, version: 1 | 2 = 2): Promise<HenrikAccountV2 | HenrikAccount> {
    return this.request(`/valorant/v${version}/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
  }

  async getAccountByPUUID(puuid: string, version: 1 | 2 = 2): Promise<HenrikAccountV2 | HenrikAccount> {
    return this.request(`/valorant/v${version}/by-puuid/account/${puuid}`);
  }

  async getMMRDetails(name: string, tag: string, region: string = 'na', platform: 'pc' | 'console' = 'pc'): Promise<MMRDetails> {
    return this.request(`/valorant/v3/mmr/${region}/${platform}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
  }

  async getMMRByPUUID(puuid: string, region: string = 'na', platform: 'pc' | 'console' = 'pc'): Promise<MMRDetails> {
    return this.request(`/valorant/v3/by-puuid/mmr/${region}/${platform}/${puuid}`);
  }

  async getMatchHistory(name: string, tag: string, region: string = 'na', platform: 'pc' | 'console' = 'pc', size: number = 20): Promise<Match[]> {
    return this.request(`/valorant/v4/matches/${region}/${platform}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?size=${size}`);
  }

  async getMatchHistoryByPUUID(puuid: string, region: string = 'na', platform: 'pc' | 'console' = 'pc', size: number = 20): Promise<Match[]> {
    return this.request(`/valorant/v4/by-puuid/matches/${region}/${platform}/${puuid}?size=${size}`);
  }

  async getMatchDetails(matchId: string, region: string = 'na'): Promise<Match> {
    return this.request(`/valorant/v4/match/${region}/${matchId}`);
  }

  calculateAgentPerformance(matches: Match[], playerPUUID: string): AgentPerformance[] {
    const agentStats = new Map<string, AgentPerformance>();

    matches.forEach(match => {
      const playerMatch = match.players.find(player => player.puuid === playerPUUID);

      if (!playerMatch) return;

      const agent = playerMatch.agent.name;
      const existing = agentStats.get(agent) || {
        agent,
        matches_played: 0,
        wins: 0,
        losses: 0,
        win_rate: 0,
        avg_kills: 0,
        avg_deaths: 0,
        avg_assists: 0,
        kd_ratio: 0,
        avg_score: 0,
        headshot_percentage: 0,
        avg_damage: 0,
      };

      const playerTeam = match.teams.find(team => team.team_id === playerMatch.team_id);
      const won = playerTeam?.won || false;

      existing.matches_played++;
      if (won) existing.wins++;
      else existing.losses++;

      const stats = playerMatch.stats;
      existing.avg_kills = (existing.avg_kills * (existing.matches_played - 1) + stats.kills) / existing.matches_played;
      existing.avg_deaths = (existing.avg_deaths * (existing.matches_played - 1) + stats.deaths) / existing.matches_played;
      existing.avg_assists = (existing.avg_assists * (existing.matches_played - 1) + stats.assists) / existing.matches_played;
      existing.avg_score = (existing.avg_score * (existing.matches_played - 1) + stats.score) / existing.matches_played;
      existing.avg_damage = (existing.avg_damage * (existing.matches_played - 1) + stats.damage.dealt) / existing.matches_played;
      
      const totalShots = stats.bodyshots + stats.headshots + stats.legshots;
      existing.headshot_percentage = totalShots > 0 ? (stats.headshots / totalShots) * 100 : 0;
      existing.kd_ratio = existing.avg_deaths > 0 ? existing.avg_kills / existing.avg_deaths : existing.avg_kills;
      existing.win_rate = (existing.wins / existing.matches_played) * 100;

      agentStats.set(agent, existing);
    });

    return Array.from(agentStats.values()).sort((a, b) => b.matches_played - a.matches_played);
  }

  calculateWeaponStats(matches: Match[], playerPUUID: string): WeaponStats[] {
    const weaponStats = new Map<string, WeaponStats>();

    matches.forEach(match => {
      const playerMatch = match.players.find(player => player.puuid === playerPUUID);

      if (!playerMatch) return;

      const stats = playerMatch.stats;
      const totalShots = stats.bodyshots + stats.headshots + stats.legshots;
      
      if (totalShots === 0) return;

      const weaponName = 'All Weapons';
      const existing = weaponStats.get(weaponName) || {
        weapon: weaponName,
        kills: 0,
        headshots: 0,
        bodyshots: 0,
        legshots: 0,
        accuracy: 0,
        headshot_percentage: 0,
        damage_per_kill: 0,
      };

      existing.kills += stats.kills;
      existing.headshots += stats.headshots;
      existing.bodyshots += stats.bodyshots;
      existing.legshots += stats.legshots;
      existing.damage_per_kill += stats.damage.dealt / (stats.kills || 1);

      weaponStats.set(weaponName, existing);
    });

    return Array.from(weaponStats.values()).map(weapon => ({
      ...weapon,
      accuracy: weapon.kills > 0 ? ((weapon.headshots + weapon.bodyshots + weapon.legshots) / (weapon.kills * 10)) * 100 : 0,
      headshot_percentage: (weapon.headshots + weapon.bodyshots + weapon.legshots) > 0 ? 
        (weapon.headshots / (weapon.headshots + weapon.bodyshots + weapon.legshots)) * 100 : 0,
      damage_per_kill: weapon.damage_per_kill / weaponStats.size,
    }));
  }

  getRecommendations(agentPerformance: AgentPerformance[], weaponStats: WeaponStats[]): {
    bestAgents: AgentPerformance[];
    weaponRecommendations: string[];
    improvementTips: string[];
  } {
    const bestAgents = agentPerformance
      .filter(agent => agent.matches_played >= 5)
      .sort((a, b) => (b.win_rate * 0.6 + b.kd_ratio * 0.4) - (a.win_rate * 0.6 + a.kd_ratio * 0.4))
      .slice(0, 3);

    const weaponRecommendations = [
      'Focus on headshots - Your accuracy could improve',
      'Consider rifle practice for better mid-range performance',
      'Shotgun practice for close combat situations',
    ];

    const improvementTips = [];
    
    if (agentPerformance.length > 0) {
      const avgKD = agentPerformance.reduce((sum, agent) => sum + agent.kd_ratio, 0) / agentPerformance.length;
      if (avgKD < 1.0) {
        improvementTips.push('Work on positioning and map awareness');
      }
      if (avgKD > 1.0 && avgKD < 1.5) {
        improvementTips.push('Good K/D! Focus on utility usage and team coordination');
      }
      if (avgKD >= 1.5) {
        improvementTips.push('Excellent performance! Consider mentoring teammates');
      }
    }

    return {
      bestAgents,
      weaponRecommendations,
      improvementTips,
    };
  }
}

export const henrikAPI = new HenrikAPIClient('HDEV-fe347cb4-d94e-486a-abbf-da6c38f9693b');
export default HenrikAPIClient;
