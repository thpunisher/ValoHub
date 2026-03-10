'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Trophy, 
  Users, 
  Target,
  TrendingUp,
  MapPin,
  Shield,
  Swords
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface PremierTeam {
  id: string;
  name: string;
  tag: string;
  enrolled: boolean;
  stats: {
    wins: number;
    matches: number;
    losses: number;
  };
  placement: {
    points: number;
    conference: string;
    division: number;
    place: number;
  };
  customization: {
    icon: string;
    image: string;
    primary: string;
    secondary: string;
    tertiary: string;
  };
  member: Array<{
    puuid: string;
    name: string;
    tag: string;
  }>;
}

interface PremierSearchResult {
  id: string;
  name: string;
  tag: string;
  conference: string;
  division: number;
  affinity: string;
  region: string;
  losses: number;
  wins: number;
  score: number;
  ranking: number;
  customization: {
    icon: string;
    image: string;
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

const conferences = [
  'EU_CENTRAL_EAST', 'EU_WEST', 'EU_MIDDLE_EAST', 'EU_TURKEY',
  'NA_US_EAST', 'NA_US_WEST', 'LATAM_NORTH', 'LATAM_SOUTH',
  'BR_BRAZIL', 'KR_KOREA', 'AP_ASIA', 'AP_JAPAN', 'AP_OCEANIA', 'AP_SOUTH_ASIA'
];

export function PremierTeamSearch() {
  const [teamName, setTeamName] = useState('');
  const [teamTag, setTeamTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [team, setTeam] = useState<PremierTeam | null>(null);
  const [searchResults, setSearchResults] = useState<PremierSearchResult[]>([]);

  const searchTeam = async () => {
    if (!teamName || !teamTag) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the API
      // For now, showing mock data structure
      const mockTeam: PremierTeam = {
        id: 'mock-team-id',
        name: teamName,
        tag: teamTag,
        enrolled: true,
        stats: {
          wins: 12,
          matches: 20,
          losses: 8
        },
        placement: {
          points: 450,
          conference: 'EU_CENTRAL_EAST',
          division: 5,
          place: 3
        },
        customization: {
          icon: 'default',
          image: '',
          primary: '#FF4655',
          secondary: '#0F1923',
          tertiary: '#FFFFFF'
        },
        member: [
          { puuid: '1', name: 'Player1', tag: 'TAG1' },
          { puuid: '2', name: 'Player2', tag: 'TAG2' },
          { puuid: '3', name: 'Player3', tag: 'TAG3' },
          { puuid: '4', name: 'Player4', tag: 'TAG4' },
          { puuid: '5', name: 'Player5', tag: 'TAG5' }
        ]
      };
      
      setTeam(mockTeam);
    } catch (err) {
      setError('Failed to fetch team data');
    } finally {
      setLoading(false);
    }
  };

  const searchPremierTeams = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock search results
      const mockResults: PremierSearchResult[] = [
        {
          id: '1',
          name: 'Team Alpha',
          tag: 'ALPH',
          conference: 'EU_CENTRAL_EAST',
          division: 5,
          affinity: 'eu',
          region: 'eu',
          losses: 8,
          wins: 12,
          score: 450,
          ranking: 3,
          customization: {
            icon: 'default',
            image: '',
            primary: '#FF4655',
            secondary: '#0F1923',
            tertiary: '#FFFFFF'
          }
        },
        {
          id: '2',
          name: 'Team Beta',
          tag: 'BETA',
          conference: 'EU_WEST',
          division: 3,
          affinity: 'eu',
          region: 'eu',
          losses: 5,
          wins: 15,
          score: 600,
          ranking: 1,
          customization: {
            icon: 'default',
            image: '',
            primary: '#00D4AA',
            secondary: '#0F1923',
            tertiary: '#FFFFFF'
          }
        }
      ];
      
      setSearchResults(mockResults);
    } catch (err) {
      setError('Failed to search teams');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Premier Team Lookup
          </CardTitle>
          <CardDescription className="text-gray-400">
            Search for Premier teams and view their stats, members, and rankings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Input
                placeholder="Tag"
                value={teamTag}
                onChange={(e) => setTeamTag(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white w-32"
              />
              <Button 
                onClick={searchTeam}
                disabled={loading || !teamName || !teamTag}
                className="bg-red-600 hover:bg-red-700"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              onClick={searchPremierTeams}
              disabled={loading}
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Browse Top Teams
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-900/20 bg-red-900/10">
          <CardContent className="p-4">
            <p className="text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Team Details */}
      {team && (
        <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  {team.name} #{team.tag}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Premier Team • Division {team.placement.division}
                </CardDescription>
              </div>
              <Badge 
                variant="secondary" 
                className={team.enrolled ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'}
              >
                {team.enrolled ? 'Enrolled' : 'Not Enrolled'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Team Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <p className="text-3xl font-bold text-green-500">{team.stats.wins}</p>
                <p className="text-sm text-gray-400">Wins</p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <p className="text-3xl font-bold text-red-500">{team.stats.losses}</p>
                <p className="text-sm text-gray-400">Losses</p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-500">
                  {((team.stats.wins / team.stats.matches) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-400">Win Rate</p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <p className="text-3xl font-bold text-blue-500">{team.placement.points}</p>
                <p className="text-sm text-gray-400">Points</p>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Placement Info */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                Conference Placement
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">Conference</p>
                  <p className="text-white font-medium">{team.placement.conference}</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">Division</p>
                  <p className="text-white font-medium">{team.placement.division}</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">Ranking</p>
                  <p className="text-white font-medium">#{team.placement.place}</p>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Team Members */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Team Members ({team.member.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {team.member.map((member, index) => (
                  <div 
                    key={index}
                    className="bg-gray-800/50 p-3 rounded-lg flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{member.name}</p>
                      <p className="text-sm text-gray-400">#{member.tag}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Swords className="w-5 h-5 text-red-500" />
              Top Premier Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <div 
                  key={result.id}
                  className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setTeamName(result.name);
                    setTeamTag(result.tag);
                    searchTeam();
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-gray-500">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {result.name} #{result.tag}
                        </p>
                        <p className="text-sm text-gray-400">
                          {result.conference} • Division {result.division}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-yellow-500">{result.score} pts</p>
                      <p className="text-sm text-gray-400">
                        {result.wins}W - {result.losses}L
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
