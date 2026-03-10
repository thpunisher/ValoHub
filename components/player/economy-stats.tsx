'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Target,
  ShoppingCart
} from 'lucide-react';
import { Match } from '@/lib/henrik-api';

interface EconomyStatsProps {
  matches: Match[];
  playerPUUID: string;
}

interface EconomyData {
  totalSpent: number;
  totalLoadoutValue: number;
  avgSpendPerRound: number;
  avgLoadoutValue: number;
  ecoRounds: number;
  fullBuyRounds: number;
  pistolRounds: number;
  savingsEfficiency: number;
}

export function EconomyStats({ matches, playerPUUID }: EconomyStatsProps) {
  // Calculate economy statistics
  let totalSpent = 0;
  let totalLoadoutValue = 0;
  let roundCount = 0;
  let ecoRounds = 0;
  let fullBuyRounds = 0;
  let pistolRounds = 0;

  matches.forEach(match => {
    const playerMatch = match.players.find(p => p.puuid === playerPUUID);
    if (!playerMatch) return;

    // Economy data is per match, not per round in the current API structure
    totalSpent += playerMatch.economy.spent.overall;
    totalLoadoutValue += playerMatch.economy.loadout_value.overall;
    
    // Estimate rounds from session playtime (average ~2 minutes per round)
    const estimatedRounds = Math.floor(playerMatch.session_playtime_in_ms / 120000) || match.rounds.length;
    roundCount += estimatedRounds;

    // Categorize rounds based on average spend
    const avgSpend = playerMatch.economy.spent.average;
    if (avgSpend < 1000) ecoRounds++;
    else if (avgSpend > 4000) fullBuyRounds++;
    if (estimatedRounds > 0 && estimatedRounds <= 2) pistolRounds += estimatedRounds;
  });

  const avgSpendPerRound = roundCount > 0 ? totalSpent / roundCount : 0;
  const avgLoadoutValue = roundCount > 0 ? totalLoadoutValue / roundCount : 0;
  const savingsEfficiency = totalLoadoutValue > 0 ? (totalLoadoutValue - totalSpent) / totalLoadoutValue * 100 : 0;

  const economyData: EconomyData = {
    totalSpent,
    totalLoadoutValue,
    avgSpendPerRound,
    avgLoadoutValue,
    ecoRounds,
    fullBuyRounds,
    pistolRounds,
    savingsEfficiency
  };

  const formatMoney = (amount: number) => {
    return `$${Math.round(amount).toLocaleString()}`;
  };

  if (matches.length === 0) {
    return (
      <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <Wallet className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No economy data available</p>
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
            <Wallet className="w-5 h-5 text-green-500" />
            Economy Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{formatMoney(economyData.totalSpent)}</p>
              <p className="text-sm text-gray-400">Total Spent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">{formatMoney(economyData.totalLoadoutValue)}</p>
              <p className="text-sm text-gray-400">Total Loadout Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-500">{formatMoney(economyData.avgSpendPerRound)}</p>
              <p className="text-sm text-gray-400">Avg/Game Spend</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{economyData.savingsEfficiency.toFixed(1)}%</p>
              <p className="text-sm text-gray-400">Value Efficiency</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Round Types Breakdown */}
      <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-500" />
            Round Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pistol Rounds */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Pistol/Eco Rounds</span>
                <Badge variant="secondary" className="bg-yellow-900/50 text-yellow-400">
                  {economyData.pistolRounds}
                </Badge>
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Low spending rounds (&lt;$1000)
              </div>
              <Progress 
                value={matches.length > 0 ? (economyData.pistolRounds / matches.length) * 100 : 0} 
                className="h-2 bg-gray-700"
              />
            </div>

            {/* Eco Rounds */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Force Buy Rounds</span>
                <Badge variant="secondary" className="bg-orange-900/50 text-orange-400">
                  {economyData.ecoRounds}
                </Badge>
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Medium spending ($1000-$4000)
              </div>
              <Progress 
                value={matches.length > 0 ? (economyData.ecoRounds / matches.length) * 100 : 0} 
                className="h-2 bg-gray-700"
              />
            </div>

            {/* Full Buy Rounds */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Full Buy Rounds</span>
                <Badge variant="secondary" className="bg-green-900/50 text-green-400">
                  {economyData.fullBuyRounds}
                </Badge>
              </div>
              <div className="text-xs text-gray-500 mb-2">
                High spending (&gt;$4000)
              </div>
              <Progress 
                value={matches.length > 0 ? (economyData.fullBuyRounds / matches.length) * 100 : 0} 
                className="h-2 bg-gray-700"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spending Insights */}
      <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-500" />
            Economy Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-400">
            <p>
              • You've spent a total of <strong className="text-red-500">{formatMoney(economyData.totalSpent)}</strong> across {matches.length} matches
            </p>
            <p>
              • Average loadout value: <strong className="text-blue-500">{formatMoney(economyData.avgLoadoutValue)}</strong> per game
            </p>
            <p>
              • Your spending efficiency is <strong className={economyData.savingsEfficiency > 50 ? 'text-green-500' : 'text-yellow-500'}>
                {economyData.savingsEfficiency.toFixed(1)}%
              </strong>
              {economyData.savingsEfficiency > 50 
                ? ' - Great value management!' 
                : ' - Consider optimizing your buys'}
            </p>
            {economyData.fullBuyRounds > economyData.ecoRounds && (
              <p className="text-yellow-500">
                • You favor full buys over eco rounds. Make sure to coordinate with your team!
              </p>
            )}
            {economyData.avgSpendPerRound > 3500 && (
              <p className="text-orange-500">
                • High average spending detected. Consider saving more for crucial rounds.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weapon Value Analysis */}
      <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-500" />
            Value per Kill Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const totalKills = matches.reduce((sum, match) => {
              const player = match.players.find(p => p.puuid === playerPUUID);
              return sum + (player?.stats.kills || 0);
            }, 0);
            
            const valuePerKill = totalKills > 0 ? economyData.totalSpent / totalKills : 0;
            
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Value per Kill</span>
                  <span className={`text-xl font-bold ${
                    valuePerKill < 3000 ? 'text-green-500' : 
                    valuePerKill < 5000 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {formatMoney(valuePerKill)}
                  </span>
                </div>
                
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      valuePerKill < 3000 ? 'bg-green-500' : 
                      valuePerKill < 5000 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((valuePerKill / 8000) * 100, 100)}%` }}
                  />
                </div>
                
                <p className="text-xs text-gray-500">
                  Lower is better - indicates efficient spending. 
                  {valuePerKill < 3000 
                    ? ' Excellent efficiency!' 
                    : valuePerKill < 5000 
                      ? ' Average efficiency.' 
                      : ' Consider optimizing your economy.'}
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{totalKills}</p>
                    <p className="text-xs text-gray-400">Total Kills</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{matches.length}</p>
                    <p className="text-xs text-gray-400">Matches</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">
                      {formatMoney(economyData.totalSpent / matches.length)}
                    </p>
                    <p className="text-xs text-gray-400">Avg/Match</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
