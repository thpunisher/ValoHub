'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronUp, 
  Target, 
  Skull, 
  Zap, 
  Shield,
  Clock,
  Bomb,
  Crosshair
} from 'lucide-react';
import { Match } from '@/lib/henrik-api';

interface MatchTimelineProps {
  match: Match;
  playerPUUID: string;
}

interface RoundEvent {
  type: 'kill' | 'plant' | 'defuse' | 'spike_explode' | 'elimination';
  description: string;
  player?: string;
  team?: string;
  time?: number;
  icon: React.ReactNode;
  color: string;
}

export function MatchTimeline({ match, playerPUUID }: MatchTimelineProps) {
  const [isOpen, setIsOpen] = useState(false);

  const playerMatch = match.players.find(p => p.puuid === playerPUUID);
  const playerTeam = match.teams.find(t => t.team_id === playerMatch?.team_id);
  const won = playerTeam?.won || false;

  // Get round results
  const getRoundEvents = (roundIndex: number) => {
    const round = match.rounds[roundIndex];
    const events: RoundEvent[] = [];

    if (!round) return events;

    // Spike plant event
    if (round.plant) {
      events.push({
        type: 'plant',
        description: `${round.plant.player.name} planted the spike at ${round.plant.site}`,
        player: round.plant.player.name,
        team: round.plant.player.team,
        time: round.plant.round_time_in_ms,
        icon: <Bomb className="w-4 h-4" />,
        color: 'text-yellow-500'
      });
    }

    // Spike defuse event
    if (round.defuse) {
      events.push({
        type: 'defuse',
        description: `${round.defuse.player.name} defused the spike`,
        player: round.defuse.player.name,
        team: round.defuse.player.team,
        time: round.defuse.round_time_in_ms,
        icon: <Shield className="w-4 h-4" />,
        color: 'text-blue-500'
      });
    }

    // Kill events from the match kills array (filtered by round)
    const roundKills = match.kills?.filter(k => k.round === roundIndex + 1) || [];
    
    roundKills.forEach(kill => {
      const isPlayerKill = kill.killer.puuid === playerPUUID;
      const isPlayerDeath = kill.victim.puuid === playerPUUID;
      
      events.push({
        type: 'kill',
        description: isPlayerKill 
          ? `You killed ${kill.victim.name}` 
          : isPlayerDeath 
            ? `Killed by ${kill.killer.name}` 
            : `${kill.killer.name} killed ${kill.victim.name}`,
        player: kill.killer.name,
        team: kill.killer.team,
        time: kill.time_in_round_in_ms,
        icon: <Crosshair className="w-4 h-4" />,
        color: isPlayerKill ? 'text-green-500' : isPlayerDeath ? 'text-red-500' : 'text-gray-400'
      });
    });

    // Sort events by time
    return events.sort((a, b) => (a.time || 0) - (b.time || 0));
  };

  const getRoundResult = (round: typeof match.rounds[0], roundIndex: number) => {
    const roundStats = round.stats.find(s => s.player.puuid === playerPUUID);
    const playerWon = round.winning_team === playerMatch?.team_id;
    
    return {
      won: playerWon,
      kills: roundStats?.stats.kills || 0,
      deaths: roundStats?.stats.damage > 0 && !roundStats?.stats.kills ? 1 : 0,
      damage: roundStats?.stats.damage || 0,
      economy: roundStats?.economy
    };
  };

  const formatTime = (ms: number | undefined) => {
    if (!ms) return '';
    const seconds = Math.floor(ms / 1000);
    const remainingMs = Math.floor((ms % 1000) / 100);
    return `${seconds}.${remainingMs}s`;
  };

  if (!playerMatch) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-between p-2 hover:bg-gray-800/50"
        >
          <span className="text-sm text-gray-400 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            View Round-by-Round Breakdown
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-2 mt-2">
        <Card className="border-gray-700 bg-gray-900/50">
          <CardContent className="p-3">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {match.rounds.map((round, index) => {
                const roundResult = getRoundResult(round, index);
                const events = getRoundEvents(index);
                
                return (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border ${
                      roundResult.won 
                        ? 'border-green-900/30 bg-green-900/10' 
                        : 'border-red-900/30 bg-red-900/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            roundResult.won 
                              ? 'bg-green-900/50 text-green-400' 
                              : 'bg-red-900/50 text-red-400'
                          }`}
                        >
                          Round {index + 1}
                        </Badge>
                        <span className={`text-xs font-medium ${
                          roundResult.won ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {roundResult.won ? 'WON' : 'LOST'}
                        </span>
                      </div>
                      
                      {roundResult.economy && roundResult.economy.weapon && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>Loadout: ${roundResult.economy.loadout_value}</span>
                          <span>Weapon: {roundResult.economy.weapon.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Round Stats */}
                    <div className="flex items-center gap-4 mb-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3 text-green-500" />
                        <span className="text-gray-300">{roundResult.kills} kills</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Skull className="w-3 h-3 text-red-500" />
                        <span className="text-gray-300">{roundResult.damage} damage</span>
                      </div>
                    </div>

                    {/* Events Timeline */}
                    {events.length > 0 && (
                      <div className="space-y-1 mt-2 pl-2 border-l-2 border-gray-700">
                        {events.map((event, eventIndex) => (
                          <div 
                            key={eventIndex}
                            className="flex items-start gap-2 text-xs"
                          >
                            <span className={`${event.color} mt-0.5`}>{event.icon}</span>
                            <div className="flex-1">
                              <span className={event.color}>{event.description}</span>
                              {event.time && (
                                <span className="text-gray-500 ml-2">
                                  ({formatTime(event.time)})
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Round End Reason */}
                    <div className="mt-2 pt-2 border-t border-gray-800">
                      <span className="text-xs text-gray-500">
                        End: {round.result} ({round.winning_team} won)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
