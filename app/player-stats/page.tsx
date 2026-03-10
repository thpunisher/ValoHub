'use client';

import { useState, useEffect } from 'react';
import { PlayerSearch } from '@/components/player/player-search';
import { PlayerProfile } from '@/components/player/player-profile';
import { MatchHistory } from '@/components/player/match-history';
import { AIRecommendations } from '@/components/player/ai-recommendations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  User, 
  Trophy, 
  Brain, 
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Target,
  TrendingUp
} from 'lucide-react';
import { henrikAPI, HenrikAccountV2, MMRDetails, Match, AgentPerformance, WeaponStats } from '@/lib/henrik-api';

interface PlayerStats {
  account: HenrikAccountV2;
  mmr?: MMRDetails;
  matches: Match[];
  agentPerformance: AgentPerformance[];
  weaponStats: WeaponStats[];
  overallKD: number;
  overallWinRate: number;
}

export default function PlayerStatsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [searchParams, setSearchParams] = useState<{ name: string; tag: string; region: string } | null>(null);

  const handleSearch = async (name: string, tag: string, region: string) => {
    setLoading(true);
    setError(null);
    setSearchParams({ name, tag, region });

    try {
      const [account, mmr, matches] = await Promise.all([
        henrikAPI.getAccount(name, tag, 2),
        henrikAPI.getMMRDetails(name, tag, region, 'pc').catch(() => null),
        henrikAPI.getMatchHistory(name, tag, region, 'pc', 20).catch(() => [])
      ]);

      const agentPerformance = matches.length > 0 
        ? henrikAPI.calculateAgentPerformance(matches, account.puuid)
        : [];

      const weaponStats = matches.length > 0
        ? henrikAPI.calculateWeaponStats(matches, account.puuid)
        : [];

      const totalKills = matches.reduce((sum, match) => {
        const playerStats = match.players.find(player => player.puuid === account.puuid);
        return sum + (playerStats?.stats.kills || 0);
      }, 0);

      const totalDeaths = matches.reduce((sum, match) => {
        const playerStats = match.players.find(player => player.puuid === account.puuid);
        return sum + (playerStats?.stats.deaths || 0);
      }, 0);

      const totalWins = matches.filter(match => {
        const playerMatch = match.players.find(player => player.puuid === account.puuid);
        if (!playerMatch) return false;
        
        const playerTeam = match.teams.find(team => team.team_id === playerMatch.team_id);
        return playerTeam?.won || false;
      }).length;

      const overallKD = totalDeaths > 0 ? totalKills / totalDeaths : 0;
      const overallWinRate = matches.length > 0 ? (totalWins / matches.length) * 100 : 0;

      setPlayerStats({
        account,
        mmr,
        matches,
        agentPerformance,
        weaponStats,
        overallKD,
        overallWinRate
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch player data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (searchParams) {
      handleSearch(searchParams.name, searchParams.tag, searchParams.region);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <BarChart3 className="w-8 h-8 text-red-500" />
            VALORANT Player Statistics
          </h1>
          <p className="text-gray-400 text-lg">
            Advanced analytics and AI-powered insights for competitive improvement
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <PlayerSearch onSearch={handleSearch} isLoading={loading} />
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-900/20 bg-red-900/10 text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Player Stats Display */}
        {playerStats && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-white">
                <User className="w-5 h-5" />
                <span className="font-semibold">
                  {playerStats.account.name}#{playerStats.account.tag}
                </span>
                <span className="text-gray-400">({playerStats.matches.length} matches analyzed)</span>
              </div>
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-gray-800 border-gray-700 w-full justify-start">
                <TabsTrigger value="overview" className="text-white data-[state=active]:bg-red-600">
                  <Trophy className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="matches" className="text-white data-[state=active]:bg-red-600">
                  <Target className="w-4 h-4 mr-2" />
                  Match History
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-red-600">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Analytics
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <PlayerProfile 
                      account={playerStats.account} 
                      mmr={playerStats.mmr}
                      matchStats={{
                        wins: playerStats.matches.filter(m => {
                          const player = m.players.find(p => p.puuid === playerStats.account.puuid);
                          return player && m.teams.find(t => t.team_id === player.team_id)?.won;
                        }).length,
                        losses: playerStats.matches.filter(m => {
                          const player = m.players.find(p => p.puuid === playerStats.account.puuid);
                          return player && !m.teams.find(t => t.team_id === player.team_id)?.won;
                        }).length,
                        winRate: playerStats.overallWinRate,
                        totalMatches: playerStats.matches.length,
                        overallKD: playerStats.overallKD,
                        totalKills: playerStats.matches.reduce((sum, m) => {
                          const player = m.players.find(p => p.puuid === playerStats.account.puuid);
                          return sum + (player?.stats.kills || 0);
                        }, 0),
                        totalDeaths: playerStats.matches.reduce((sum, m) => {
                          const player = m.players.find(p => p.puuid === playerStats.account.puuid);
                          return sum + (player?.stats.deaths || 0);
                        }, 0)
                      }}
                    />
                  </div>
                  <div className="space-y-6">
                    {/* Quick Stats */}
                    <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-500" />
                          Performance Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Overall K/D</span>
                            <span className={`font-bold text-lg ${
                              playerStats.overallKD >= 1.5 ? 'text-green-500' :
                              playerStats.overallKD >= 1.0 ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                              {playerStats.overallKD.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Win Rate</span>
                            <span className={`font-bold text-lg ${
                              playerStats.overallWinRate >= 60 ? 'text-green-500' :
                              playerStats.overallWinRate >= 50 ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                              {playerStats.overallWinRate.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Total Matches</span>
                            <span className="font-bold text-lg text-white">
                              {playerStats.matches.length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Agents Played</span>
                            <span className="font-bold text-lg text-white">
                              {playerStats.agentPerformance.length}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Top Agents */}
                    {playerStats.agentPerformance.length > 0 && (
                      <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-white">
                            Top Agents
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {playerStats.agentPerformance.slice(0, 3).map((agent, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-white font-medium">{agent.agent}</span>
                                <div className="text-right">
                                  <div className="text-sm text-gray-400">
                                    {agent.matches_played} games
                                  </div>
                                  <div className="text-sm font-semibold text-green-500">
                                    {agent.win_rate.toFixed(1)}% WR
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Match History Tab */}
              <TabsContent value="matches">
                <MatchHistory 
                  matches={playerStats.matches}
                  playerPUUID={playerStats.account.puuid}
                  agentPerformance={playerStats.agentPerformance}
                  weaponStats={playerStats.weaponStats}
                />
              </TabsContent>

              {/* AI Analytics Tab */}
              <TabsContent value="analytics">
                <AIRecommendations
                  agentPerformance={playerStats.agentPerformance}
                  weaponStats={playerStats.weaponStats}
                  overallKD={playerStats.overallKD}
                  overallWinRate={playerStats.overallWinRate}
                  totalMatches={playerStats.matches.length}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Empty State */}
        {!playerStats && !loading && !error && (
          <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm text-center py-12">
            <CardContent>
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Search for a Player
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Enter a Valorant player's name and tag to view detailed statistics, 
                match history, and AI-powered performance insights.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
