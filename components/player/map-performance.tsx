'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, TrendingUp, Target, Trophy } from 'lucide-react';
import { Match } from '@/lib/henrik-api';

interface MapPerformanceProps {
  matches: Match[];
  playerPUUID: string;
}

interface MapStats {
  mapName: string;
  mapId: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  totalKills: number;
  totalDeaths: number;
  kdRatio: number;
  avgScore: number;
  totalDamage: number;
}

// Map images from Valorant API
const mapImages: { [key: string]: string } = {
  'Ascent': 'https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png',
  'Split': 'https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/splash.png',
  'Fracture': 'https://media.valorant-api.com/maps/b529448b-4d60-346e-e89e-00a4c5272b94/splash.png',
  'Bind': 'https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd935c/splash.png',
  'Breeze': 'https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-c74e1a4ba434/splash.png',
  'Icebox': 'https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9641-8a7c8a4d7b3e/splash.png',
  'Haven': 'https://media.valorant-api.com/maps/bb94503c-bb35-4d7b-8d4e-5b684d77a095/splash.png',
  'Lotus': 'https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78cfbc87/splash.png',
  'Pearl': 'https://media.valorant-api.com/maps/fd267378-4d1d-484f-ff52-77821ed10dc2/splash.png',
  'Sunset': 'https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9faa-39b0f486b498/splash.png',
  'Abyss': 'https://media.valorant-api.com/maps/224b0a95-48b9-f703-1bc8-5f48e9c7c8d9/splash.png',
  'District': 'https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd935c/splash.png', // Placeholder
  'Kasbah': 'https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd935c/splash.png', // Placeholder
  'Piazza': 'https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd935c/splash.png', // Placeholder
};

export function MapPerformance({ matches, playerPUUID }: MapPerformanceProps) {
  // Calculate map statistics
  const mapStats = new Map<string, MapStats>();

  matches.forEach(match => {
    const playerMatch = match.players.find(p => p.puuid === playerPUUID);
    if (!playerMatch) return;

    const mapName = match.metadata.map.name;
    const mapId = match.metadata.map.id;
    
    const playerTeam = match.teams.find(t => t.team_id === playerMatch.team_id);
    const won = playerTeam?.won || false;

    const existing = mapStats.get(mapName) || {
      mapName,
      mapId,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      totalKills: 0,
      totalDeaths: 0,
      kdRatio: 0,
      avgScore: 0,
      totalDamage: 0,
    };

    existing.matchesPlayed++;
    if (won) existing.wins++;
    else existing.losses++;
    
    existing.totalKills += playerMatch.stats.kills;
    existing.totalDeaths += playerMatch.stats.deaths;
    existing.totalDamage += playerMatch.stats.damage.dealt;
    existing.avgScore += playerMatch.stats.score;

    mapStats.set(mapName, existing);
  });

  // Calculate final stats
  const processedStats = Array.from(mapStats.values()).map(stats => {
    const winRate = stats.matchesPlayed > 0 ? (stats.wins / stats.matchesPlayed) * 100 : 0;
    const kdRatio = stats.totalDeaths > 0 ? stats.totalKills / stats.totalDeaths : stats.totalKills;
    const avgScore = stats.matchesPlayed > 0 ? stats.avgScore / stats.matchesPlayed : 0;
    
    return {
      ...stats,
      winRate,
      kdRatio,
      avgScore,
    };
  }).sort((a, b) => b.matchesPlayed - a.matchesPlayed); // Sort by matches played

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 60) return 'text-green-500';
    if (winRate >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getKDColor = (kd: number) => {
    if (kd >= 1.5) return 'text-green-500';
    if (kd >= 1.0) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (processedStats.length === 0) {
    return (
      <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No map data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Map Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{processedStats.length}</p>
              <p className="text-sm text-gray-400">Maps Played</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">
                {processedStats.filter(m => m.winRate >= 60).length}
              </p>
              <p className="text-sm text-gray-400">Strong Maps (60%+ WR)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-500">
                {processedStats.filter(m => m.winRate >= 50 && m.winRate < 60).length}
              </p>
              <p className="text-sm text-gray-400">Average Maps</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-500">
                {processedStats.filter(m => m.winRate < 50).length}
              </p>
              <p className="text-sm text-gray-400">Weak Maps (&lt;50% WR)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best and Worst Maps */}
      {processedStats.length >= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Best Map */}
          <Card className="border-green-900/20 bg-green-900/10 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-green-500" />
                Best Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const bestMap = [...processedStats].sort((a, b) => b.winRate - a.winRate)[0];
                return (
                  <div className="space-y-3">
                    <div className="relative h-32 rounded-lg overflow-hidden">
                      <img 
                        src={mapImages[bestMap.mapName] || mapImages['Ascent']}
                        alt={bestMap.mapName}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-2xl font-bold text-white drop-shadow-lg">{bestMap.mapName}</h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-green-500">{bestMap.winRate.toFixed(1)}%</p>
                        <p className="text-xs text-gray-400">Win Rate</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white">{bestMap.kdRatio.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">K/D</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white">{bestMap.matchesPlayed}</p>
                        <p className="text-xs text-gray-400">Games</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Worst Map */}
          <Card className="border-red-900/20 bg-red-900/10 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-red-500" />
                Needs Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const worstMap = [...processedStats].sort((a, b) => a.winRate - b.winRate)[0];
                return (
                  <div className="space-y-3">
                    <div className="relative h-32 rounded-lg overflow-hidden">
                      <img 
                        src={mapImages[worstMap.mapName] || mapImages['Ascent']}
                        alt={worstMap.mapName}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-2xl font-bold text-white drop-shadow-lg">{worstMap.mapName}</h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-red-500">{worstMap.winRate.toFixed(1)}%</p>
                        <p className="text-xs text-gray-400">Win Rate</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white">{worstMap.kdRatio.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">K/D</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white">{worstMap.matchesPlayed}</p>
                        <p className="text-xs text-gray-400">Games</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* All Maps Grid */}
      <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            All Maps Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedStats.map((map) => (
              <div 
                key={map.mapName}
                className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={mapImages[map.mapName] || mapImages['Ascent']}
                      alt={map.mapName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{map.mapName}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        map.winRate >= 60 ? 'bg-green-900/50 text-green-400' : 
                        map.winRate >= 50 ? 'bg-yellow-900/50 text-yellow-400' : 
                        'bg-red-900/50 text-red-400'
                      }`}
                    >
                      {map.winRate.toFixed(1)}% WR
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">W/L</span>
                    <span className="text-white">{map.wins}/{map.losses}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">K/D</span>
                    <span className={getKDColor(map.kdRatio)}>{map.kdRatio.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Games</span>
                    <span className="text-white">{map.matchesPlayed}</span>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Win Rate</span>
                      <span className={getWinRateColor(map.winRate)}>{map.winRate.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={map.winRate} 
                      className="h-1.5 bg-gray-700"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Map Insights */}
      <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-yellow-500" />
            Map Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-400">
            {(() => {
              const sortedByWinRate = [...processedStats].sort((a, b) => b.winRate - a.winRate);
              const bestMap = sortedByWinRate[0];
              const worstMap = sortedByWinRate[sortedByWinRate.length - 1];
              
              return (
                <>
                  <p>
                    • Your strongest map is <strong className="text-green-500">{bestMap.mapName}</strong> with a {bestMap.winRate.toFixed(1)}% win rate
                  </p>
                  <p>
                    • You struggle most on <strong className="text-red-500">{worstMap.mapName}</strong> ({worstMap.winRate.toFixed(1)}% WR)
                  </p>
                  <p>
                    • You've played <strong className="text-white">{processedStats.length}</strong> different maps with an average win rate of{' '}
                    <strong className="text-white">
                      {(processedStats.reduce((sum, m) => sum + m.winRate, 0) / processedStats.length).toFixed(1)}%
                    </strong>
                  </p>
                  {processedStats.length >= 3 && (
                    <p>
                      • Your top 3 maps account for{' '}
                      <strong className="text-white">
                        {((processedStats.slice(0, 3).reduce((sum, m) => sum + m.matchesPlayed, 0) / 
                          processedStats.reduce((sum, m) => sum + m.matchesPlayed, 0)) * 100).toFixed(0)}%
                      </strong>
                      {' '}of your total matches
                    </p>
                  )}
                </>
              );
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
