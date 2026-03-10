'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Shield, 
  Zap, 
  Star,
  Calendar,
  MapPin,
  Activity
} from 'lucide-react';
import { HenrikAccountV2, MMRDetails } from '@/lib/henrik-api';

interface PlayerProfileProps {
  account: HenrikAccountV2;
  mmr?: MMRDetails;
  matchStats?: {
    wins: number;
    losses: number;
    winRate: number;
    totalMatches: number;
    overallKD: number;
    totalKills: number;
    totalDeaths: number;
  };
}

const rankColors = {
  0: 'bg-gray-500', // Unranked
  1: 'bg-gray-500', // Iron
  2: 'bg-amber-600', // Bronze
  3: 'bg-gray-300', // Silver
  4: 'bg-amber-400', // Gold
  5: 'bg-blue-500', // Platinum
  6: 'bg-purple-500', // Diamond
  7: 'bg-red-500', // Immortal
  8: 'bg-gradient-to-r from-red-600 to-yellow-500', // Radiant
};

const rankNames = [
  'Unranked',
  'Iron 1', 'Iron 2', 'Iron 3',
  'Bronze 1', 'Bronze 2', 'Bronze 3',
  'Silver 1', 'Silver 2', 'Silver 3',
  'Gold 1', 'Gold 2', 'Gold 3',
  'Platinum 1', 'Platinum 2', 'Platinum 3',
  'Diamond 1', 'Diamond 2', 'Diamond 3',
  'Immortal 1', 'Immortal 2', 'Immortal 3',
  'Radiant'
];

export function PlayerProfile({ account, mmr, matchStats }: PlayerProfileProps) {
  const getRankInfo = () => {
    if (!mmr) return { name: 'Unranked', color: 'bg-gray-500', tier: 0 };
    
    const tier = mmr.currenttier;
    const rankIndex = Math.min(tier, rankNames.length - 1);
    const rankName = rankNames[rankIndex] || 'Unranked';
    const colorClass = rankColors[tier as keyof typeof rankColors] || 'bg-gray-500';
    
    return { name: rankName, color: colorClass, tier };
  };

  const getWinRate = () => {
    if (matchStats) return Math.round(matchStats.winRate);
    if (!mmr) return 0;
    const total = mmr.wins + mmr.losses;
    return total > 0 ? Math.round((mmr.wins / total) * 100) : 0;
  };

  const getWins = () => {
    if (matchStats) return matchStats.wins;
    return mmr?.wins || 0;
  };

  const getLosses = () => {
    if (matchStats) return matchStats.losses;
    return mmr?.losses || 0;
  };

  const rankInfo = getRankInfo();
  const winRate = getWinRate();
  const wins = getWins();
  const losses = getLosses();

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card className="border-red-900/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-2 border-red-500/50">
                <AvatarImage src={`https://media.valorant-api.com/playercards/${account.card}/smallart.png`} alt={account.name} />
                <AvatarFallback className="bg-red-900/50 text-white text-xl font-bold">
                  {account.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  {account.name}
                  <span className="text-gray-400">#{account.tag}</span>
                </CardTitle>
                <CardDescription className="text-gray-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Level {account.account_level} • {account.region.toUpperCase()}
                </CardDescription>
              </div>
            </div>
            
            {mmr && (
              <div className="text-right">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${rankInfo.color}`}>
                  <Trophy className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">{rankInfo.name}</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  RR: {mmr.ranking_in_tier}/100
                </p>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-white">{wins}</p>
              <p className="text-sm text-gray-400">Wins</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-white">{losses}</p>
              <p className="text-sm text-gray-400">Losses</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-white">{winRate}%</p>
              <p className="text-sm text-gray-400">Win Rate</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-white">
                {matchStats ? matchStats.overallKD.toFixed(2) : (mmr?.leaderboard_rank || 'N/A')}
              </p>
              <p className="text-sm text-gray-400">{matchStats ? 'K/D Ratio' : 'Leaderboard'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Match Stats Overview */}
      {matchStats && (
        <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500" />
              Match Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{matchStats.totalKills}</p>
                <p className="text-sm text-gray-400">Total Kills</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{matchStats.totalDeaths}</p>
                <p className="text-sm text-gray-400">Total Deaths</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">{matchStats.overallKD.toFixed(2)}</p>
                <p className="text-sm text-gray-400">K/D Ratio</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-500">{matchStats.totalMatches}</p>
                <p className="text-sm text-gray-400">Matches Analyzed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Rank Progression */}
      {mmr && (
        <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500" />
              Rank Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress to Next Rank</span>
                  <span className="text-white">{mmr.ranking_in_tier}/100 RR</span>
                </div>
                <Progress value={mmr.ranking_in_tier} className="h-2 bg-gray-700" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-400">ELO:</span>
                  <span className="text-sm font-semibold text-white">{mmr.elo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-400">Games:</span>
                  <span className="text-sm font-semibold text-white">{mmr.number_of_games}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-400">Last Game:</span>
                  <span className={`text-sm font-semibold ${
                    mmr.mmr_change_to_last_game > 0 ? 'text-green-500' : 
                    mmr.mmr_change_to_last_game < 0 ? 'text-red-500' : 'text-white'
                  }`}>
                    {mmr.mmr_change_to_last_game > 0 ? '+' : ''}{mmr.mmr_change_to_last_game} RR
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Info */}
      <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            Platform Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {account.platforms.map((platform, index) => (
              <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300">
                {platform.toUpperCase()}
              </Badge>
            ))}
          </div>
          <Separator className="my-4 bg-gray-700" />
          <div className="text-sm text-gray-400">
            <p>Account ID: {account.puuid}</p>
            <p>Last Updated: {new Date(account.updated_at).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
