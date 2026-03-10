'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crosshair, Target, Zap } from 'lucide-react';
import { Match } from '@/lib/henrik-api';

interface DetailedWeaponStatsProps {
  matches: Match[];
  playerPUUID: string;
}

interface WeaponStat {
  id: string;
  name: string;
  kills: number;
  headshots: number;
  bodyshots: number;
  legshots: number;
  damage: number;
  assists: number;
}

// Weapon ID to display name mapping
const weaponNames: { [key: string]: string } = {
  '462080d1-4035-2937-7c09-27aa2a5c27a7': 'Spectre',
  '9c82e19d-4575-0200-1a81-3eacf00cf872': 'Vandal',
  'ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a': 'Phantom',
  'ec845bf4-4f79-ddda-a3da-0db3774b2794': 'Judge',
  'a03b24d3-4319-996d-0f8c-94bbfba1dfc7': 'Operator',
  'e336c6b8-418d-9340-d77f-7a9e4cfe0702': 'Sheriff',
  '4ade7faa-4cf1-8376-95ef-39884480959b': 'Guardian',
  'c4883e50-9b22-3d4b-6f92-1b40e8d5a1e5': 'Bulldog',
  '910be174-449b-c412-ab22-d0872936b9cd': 'Classic',
  '29a0cfab-485b-f5d5-809a-b959b5f76dc2': 'Shorty',
  '44d4e923-4154-ed3d-9f4a-1b25dfd3a855': 'Frenzy',
  '1baa85b4-4c70-1284-64bb-6481db3e4eeb': 'Ghost',
  '57da0d53-4d69-5ebc-9e72-76a5a4e72b6e': 'Marshal',
  '5f0aaf7a-4289-3d97-b0eb-d853b93a0e8e': 'Odin',
  '55d8a0f4-4274-ca67-fe2c-06ab45dcbf93': 'Ares',
  '2f59173c-4bed-6b4c-e375-6def4b5b6e7d': 'Outlaw',
  '822bcab2-40a2-324e-c137-e09195ad7692': 'Melee'
};

export function DetailedWeaponStats({ matches, playerPUUID }: DetailedWeaponStatsProps) {
  // Extract weapon stats from kills
  const weaponStats = new Map<string, WeaponStat>();

  matches.forEach(match => {
    const kills = match.kills || [];
    
    kills.forEach(kill => {
      if (kill.killer.puuid === playerPUUID) {
        const weaponId = kill.weapon.id.toLowerCase();
        const weaponName = weaponNames[weaponId] || kill.weapon.name;
        
        const existing = weaponStats.get(weaponId) || {
          id: weaponId,
          name: weaponName,
          kills: 0,
          headshots: 0,
          bodyshots: 0,
          legshots: 0,
          damage: 0,
          assists: 0
        };

        existing.kills++;
        weaponStats.set(weaponId, existing);
      }
    });

    // Also count damage events from round stats if available
    match.rounds.forEach(round => {
      round.stats.forEach(stat => {
        if (stat.player.puuid === playerPUUID) {
          stat.damage_events.forEach(event => {
            // Track damage but not weapon-specific from here
          });
        }
      });
    });
  });

  const sortedWeapons = Array.from(weaponStats.values())
    .sort((a, b) => b.kills - a.kills)
    .slice(0, 8); // Top 8 weapons

  const totalKills = sortedWeapons.reduce((sum, w) => sum + w.kills, 0);

  return (
    <div className="space-y-4">
      {/* Weapon Summary */}
      <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white">
              Top Weapons by Kills
            </CardTitle>
            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
              {sortedWeapons.length} weapons used
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sortedWeapons.map((weapon) => (
              <div 
                key={weapon.id} 
                className="bg-gray-800/50 rounded-lg p-4 text-center hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center justify-center mb-3">
                  <img 
                    src={`https://media.valorant-api.com/weapons/${weapon.id}/displayicon.png`}
                    alt={weapon.name}
                    className="w-12 h-12 object-contain"
                    onError={(e) => { 
                      (e.target as HTMLImageElement).src = 'https://media.valorant-api.com/weapons/462080d1-4035-2937-7c09-27aa2a5c27a7/displayicon.png';
                    }}
                  />
                </div>
                <p className="font-semibold text-white text-sm mb-1">{weapon.name}</p>
                <div className="flex items-center justify-center gap-2">
                  <Crosshair className="w-4 h-4 text-red-500" />
                  <span className="text-lg font-bold text-white">{weapon.kills}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {totalKills > 0 ? ((weapon.kills / totalKills) * 100).toFixed(1) : 0}% of kills
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weapon Kill Breakdown */}
      {sortedWeapons.length > 0 && (
        <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-red-500" />
              Weapon Kill Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedWeapons.slice(0, 5).map((weapon, index) => {
                const percentage = totalKills > 0 ? (weapon.kills / totalKills) * 100 : 0;
                return (
                  <div key={weapon.id} className="flex items-center gap-4">
                    <div className="flex items-center gap-3 w-32">
                      <span className="text-gray-400 w-4">{index + 1}.</span>
                      <img 
                        src={`https://media.valorant-api.com/weapons/${weapon.id}/displayicon.png`}
                        alt={weapon.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => { 
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <span className="text-white text-sm font-medium truncate">{weapon.name}</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right w-20">
                      <span className="text-white font-semibold">{weapon.kills}</span>
                      <span className="text-gray-400 text-sm ml-1">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Weapon Usage Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-400">
            {sortedWeapons.length === 0 ? (
              <p>No weapon data available from recent matches.</p>
            ) : (
              <>
                <p>• Your most used weapon is <strong className="text-white">{sortedWeapons[0]?.name}</strong> with {sortedWeapons[0]?.kills} kills</p>
                {sortedWeapons[1] && (
                  <p>• Secondary preference: <strong className="text-white">{sortedWeapons[1]?.name}</strong> ({sortedWeapons[1]?.kills} kills)</p>
                )}
                <p>• Weapon diversity: Using {sortedWeapons.length} different weapons across {matches.length} matches</p>
                {sortedWeapons[0]?.kills > (sortedWeapons[1]?.kills || 0) * 2 && (
                  <p className="text-yellow-500">• Tip: You rely heavily on one weapon. Try practicing with alternatives!</p>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
