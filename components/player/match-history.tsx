'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  MapPin,
  Trophy,
  Skull,
  Crosshair,
  Shield,
  Zap
} from 'lucide-react';
import { Match, AgentPerformance, WeaponStats } from '@/lib/henrik-api';
import { DetailedWeaponStats } from './detailed-weapon-stats';
import { MapPerformance } from './map-performance';
import { MatchTimeline } from './match-timeline';
import { EconomyStats } from './economy-stats';

interface MatchHistoryProps {
  matches: Match[];
  playerPUUID: string;
  agentPerformance: AgentPerformance[];
  weaponStats: WeaponStats[];
}

export function MatchHistory({ matches, playerPUUID, agentPerformance, weaponStats }: MatchHistoryProps) {
  const getPlayerStats = (match: Match) => {
    return match.players.find(player => player.puuid === playerPUUID);
  };

  const getPlayerTeam = (match: Match) => {
    const playerMatch = match.players.find(player => player.puuid === playerPUUID);
    if (!playerMatch) return undefined;
    
    return match.teams.find(team => team.team_id === playerMatch.team_id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDuration = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getKDColor = (kd: number) => {
    if (kd >= 2.0) return 'text-purple-500';
    if (kd >= 1.5) return 'text-blue-500';
    if (kd >= 1.0) return 'text-green-500';
    if (kd >= 0.5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 60) return 'text-green-500';
    if (winRate >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Helper function to map agent names to their IDs for images
  const getAgentIdByName = (name: string): string => {
    const agentMap: { [key: string]: string } = {
      'Sage': '569fdd95-4d10-43ab-ca70-79becc718b46',
      'Raze': 'f94c3b30-42be-e959-889c-5aa313dba261',
      'Jett': 'add6443a-41bd-e414-f6ad-e58d267f4e95',
      'Phoenix': 'eb93336a-449b-9c1b-0a54-a891f5f5ee60',
      'Viper': '707eab51-4836-f488-046a-cda6bf494859',
      'Brimstone': '9f0d8a9f-47b9-45fc-a26d-1b0b2b2e9f75',
      'Cypher': '117ed9e3-49f3-6512-3ccf-0cada7e3823b',
      'Sova': 'ded3520f-4264-bfed-162d-b080e2abccf9',
      'Omen': '8e253930-4c05-31dd-1b6c-968525494517',
      'Breach': '5f8d3a7f-467b-97f3-0628-099c85a7bb3f',
      'Reyna': 'a3bfb853-43b2-7238-a4f1-ad90e9e46bcc',
      'Killjoy': '1e58de9c-4950-5125-93e9-a0aee9f98746',
      'Skye': '6f2a04ca-43e0-be17-7f36-b3908627744d',
      'Yoru': '7f94d92c-4234-0a36-9646-3a87492c4b71',
      'Astra': '41fb69c1-4189-7b37-f117-bcaf1e96fc1d',
      'KAY/O': '601dbbe7-43ce-be57-2a40-4abd24953621',
      'Chamber': '22697a3d-45bf-8dd7-4fec-84a9e28c69d7',
      'Neon': 'bb2a4828-46eb-8cd1-e765-15848195d751',
      'Fade': 'dade69b4-4f5a-8528-247b-219e4a1c55cb',
      'Harbor': '95b78ed7-4637-86d9-7e41-71ba8c2c28d5',
      'Gekko': 'e370fa57-4757-3604-3648-499e1f642d3f',
      'Deadlock': 'cc8a64e8-4e74-30f8-85e3-e9f0b4c8b9e0',
      'Iso': '0f41b225-3c66-881f-8c53-a6f6b5ac76b5',
      'Clove': '1dbf2edd-4729-0984-3115-daa5eed4499c',
      'Vyse': 'ef6d74a8-7d11-47d8-86c6-c15a5b1f5a7e',
      'Waylay': 'df86f56a-45c0-11ed-8a5e-6c71fbe4b8e1'
    };
    return agentMap[name] || '';
  };

  const recentMatches = matches.slice(0, 10);
  const totalWins = matches.filter(match => getPlayerTeam(match)?.won).length;
  const totalGames = matches.length;
  const overallWinRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Match Summary */}
      <Card className="border-red-900/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-red-500" />
            Match Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{totalGames}</p>
              <p className="text-sm text-gray-400">Total Matches</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{totalWins}</p>
              <p className="text-sm text-gray-400">Wins</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{totalGames - totalWins}</p>
              <p className="text-sm text-gray-400">Losses</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${getWinRateColor(overallWinRate)}`}>{overallWinRate}%</p>
              <p className="text-sm text-gray-400">Win Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="matches" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="matches" className="text-white">Recent Matches</TabsTrigger>
          <TabsTrigger value="maps" className="text-white">Maps</TabsTrigger>
          <TabsTrigger value="agents" className="text-white">Agents</TabsTrigger>
          <TabsTrigger value="weapons" className="text-white">Weapons</TabsTrigger>
          <TabsTrigger value="economy" className="text-white">Economy</TabsTrigger>
        </TabsList>

        {/* Maps Performance Tab */}
        <TabsContent value="maps" className="space-y-4">
          <MapPerformance matches={matches} playerPUUID={playerPUUID} />
        </TabsContent>

        {/* Recent Matches Tab */}
        <TabsContent value="matches" className="space-y-4">
          <div>
            {recentMatches.map((match, index) => {
            const playerStats = getPlayerStats(match);
            const playerTeam = getPlayerTeam(match);
            const won = playerTeam?.won || false;
            const kd = playerStats ? (playerStats.stats.kills / (playerStats.stats.deaths || 1)) : 0;
            const headshotPercentage = playerStats ? 
              (playerStats.stats.headshots / (playerStats.stats.headshots + playerStats.stats.bodyshots + playerStats.stats.legshots)) * 100 : 0;

            return (
              <Card key={`match-${match.metadata.game_id}-${index}`} className={`border ${won ? 'border-green-900/20' : 'border-red-900/20'} bg-gray-900/30 backdrop-blur-sm`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${won ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className={`font-semibold ${won ? 'text-green-500' : 'text-red-500'}`}>
                        {won ? 'VICTORY' : 'DEFEAT'}
                      </span>
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {match.metadata.queue.name}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {formatDate(match.metadata.started_at)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{playerStats?.stats.kills || 0}</p>
                      <p className="text-xs text-gray-400">Kills</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{playerStats?.stats.deaths || 0}</p>
                      <p className="text-xs text-gray-400">Deaths</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{playerStats?.stats.assists || 0}</p>
                      <p className="text-xs text-gray-400">Assists</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-lg font-bold ${getKDColor(kd)}`}>{kd.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">K/D Ratio</p>
                    </div>
                  </div>

                  <Separator className="my-3 bg-gray-700" />

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{match.metadata.map.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img 
                          src={`https://media.valorant-api.com/agents/${playerStats?.agent?.id}/displayicon.png`}
                          alt={playerStats?.agent?.name || 'Agent'}
                          className="w-6 h-6 rounded"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <span className="text-gray-300">{playerStats?.agent?.name || 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Crosshair className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{headshotPercentage.toFixed(1)}% HS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{formatDuration(match.metadata.game_length_in_ms)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Timeline */}
                  <div className="mt-3">
                    <MatchTimeline match={match} playerPUUID={playerPUUID} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>
        </TabsContent>

        {/* Agent Performance Tab */}
        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agentPerformance.slice(0, 6).map((agent, index) => (
              <Card key={index} className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://media.valorant-api.com/agents/${getAgentIdByName(agent.agent)}/displayicon.png`}
                        alt={agent.agent}
                        className="w-10 h-10 rounded"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <CardTitle className="text-lg font-semibold text-white">{agent.agent}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                      {agent.matches_played} games
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Win Rate</span>
                      <span className={`font-semibold ${getWinRateColor(agent.win_rate)}`}>
                        {agent.win_rate.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={agent.win_rate} className="h-2 bg-gray-700" />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">K/D Ratio</p>
                        <p className={`font-semibold ${getKDColor(agent.kd_ratio)}`}>
                          {agent.kd_ratio.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Avg Kills</p>
                        <p className="font-semibold text-white">{agent.avg_kills.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Headshot %</p>
                        <p className="font-semibold text-white">{agent.headshot_percentage.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Avg Score</p>
                        <p className="font-semibold text-white">{agent.avg_score.toFixed(0)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Weapon Statistics Tab */}
        <TabsContent value="weapons" className="space-y-4">
          <DetailedWeaponStats matches={matches} playerPUUID={playerPUUID} />
        </TabsContent>

        {/* Economy Tab */}
        <TabsContent value="economy" className="space-y-4">
          <EconomyStats matches={matches} playerPUUID={playerPUUID} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
