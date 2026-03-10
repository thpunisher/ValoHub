'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb,
  Star,
  Shield,
  Zap,
  Crosshair,
  Users
} from 'lucide-react';
import { AgentPerformance, WeaponStats } from '@/lib/henrik-api';

interface AIRecommendationsProps {
  agentPerformance: AgentPerformance[];
  weaponStats: WeaponStats[];
  overallKD: number;
  overallWinRate: number;
  totalMatches: number;
}

export function AIRecommendations({ 
  agentPerformance, 
  weaponStats, 
  overallKD, 
  overallWinRate, 
  totalMatches 
}: AIRecommendationsProps) {
  const getSkillLevel = () => {
    if (overallKD >= 2.0 && overallWinRate >= 65) return { level: 'Expert', color: 'text-purple-500', description: 'Top-tier player performance' };
    if (overallKD >= 1.5 && overallWinRate >= 55) return { level: 'Advanced', color: 'text-blue-500', description: 'Strong competitive player' };
    if (overallKD >= 1.0 && overallWinRate >= 50) return { level: 'Intermediate', color: 'text-green-500', description: 'Solid fundamental skills' };
    return { level: 'Developing', color: 'text-yellow-500', description: 'Room for improvement' };
  };

  const getTopAgents = () => {
    return agentPerformance
      .filter(agent => agent.matches_played >= 3)
      .sort((a, b) => (b.win_rate * 0.6 + b.kd_ratio * 0.4) - (a.win_rate * 0.6 + a.kd_ratio * 0.4))
      .slice(0, 3);
  };

  const getWeaknesses = () => {
    const weaknesses = [];
    
    if (overallKD < 1.0) {
      weaknesses.push({
        type: 'Aim',
        description: 'Focus on aim training and crosshair placement',
        priority: 'high',
        icon: Target
      });
    }
    
    if (overallWinRate < 50) {
      weaknesses.push({
        type: 'Game Sense',
        description: 'Work on map awareness and positioning',
        priority: 'high',
        icon: Brain
      });
    }
    
    const avgHeadshot = weaponStats.reduce((sum, weapon) => sum + weapon.headshot_percentage, 0) / weaponStats.length;
    if (avgHeadshot < 25) {
      weaknesses.push({
        type: 'Headshot Accuracy',
        description: 'Practice one-tap drills and headshot focus',
        priority: 'medium',
        icon: Crosshair
      });
    }
    
    return weaknesses;
  };

  const getStrengths = () => {
    const strengths = [];
    
    if (overallKD >= 1.5) {
      strengths.push({
        type: 'Fragging Power',
        description: 'Excellent kill contribution to team',
        icon: Target
      });
    }
    
    if (overallWinRate >= 60) {
      strengths.push({
        type: 'Team Impact',
        description: 'Strong positive influence on match outcomes',
        icon: Users
      });
    }
    
    const topAgent = getTopAgents()[0];
    if (topAgent && topAgent.win_rate >= 60) {
      strengths.push({
        type: 'Agent Mastery',
        description: `Exceptional performance with ${topAgent.agent}`,
        icon: Star
      });
    }
    
    return strengths;
  };

  const getRecommendedAgents = () => {
    const currentAgents = agentPerformance.map(a => a.agent);
    const allAgents = ['Jett', 'Reyna', 'Phoenix', 'Raze', 'Yoru', 'Neon', 'Sage', 'Killjoy', 'Cypher', 'Sova', 'Breach', 'Omen', 'Brimstone', 'Viper', 'Astra', 'Kay/O', 'Chamber', 'Harbor', 'Gekko', 'Deadlock', 'Iso', 'Clove'];
    
    const unplayedAgents = allAgents.filter(agent => !currentAgents.includes(agent));
    
    if (overallKD >= 1.2) {
      return ['Jett', 'Reyna', 'Phoenix'].filter(agent => !currentAgents.includes(agent));
    } else {
      return ['Sage', 'Killjoy', 'Sova'].filter(agent => !currentAgents.includes(agent));
    }
  };

  const getTrainingFocus = () => {
    const focus = [];
    
    if (overallKD < 1.0) {
      focus.push({
        area: 'Aim Training',
        exercises: ['Aim Lab', 'KovaaK\'s', 'Deathmatch'],
        timeSpent: '30-45 min daily'
      });
    }
    
    if (overallWinRate < 50) {
      focus.push({
        area: 'Tactical Awareness',
        exercises: ['VOD Review', 'Map Callouts', 'Positioning Drills'],
        timeSpent: '20-30 min daily'
      });
    }
    
    focus.push({
      area: 'Agent Utility',
      exercises: ['Lineup Practice', 'Ability Timing', 'Combo Usage'],
      timeSpent: '15-20 min daily'
    });
    
    return focus;
  };

  const skillLevel = getSkillLevel();
  const topAgents = getTopAgents();
  const weaknesses = getWeaknesses();
  const strengths = getStrengths();
  const recommendedAgents = getRecommendedAgents();
  const trainingFocus = getTrainingFocus();

  return (
    <div className="space-y-6">
      {/* Skill Assessment */}
      <Card className="border-purple-900/20 bg-gradient-to-br from-purple-900/20 to-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            AI Performance Analysis
          </CardTitle>
          <CardDescription className="text-gray-400">
            Personalized insights based on your match history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-2xl font-bold ${skillLevel.color}`}>{skillLevel.level}</h3>
              <p className="text-sm text-gray-400">{skillLevel.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">Overall Performance Score</div>
              <div className="text-3xl font-bold text-white">
                {Math.round((overallKD * 30) + (overallWinRate * 0.7))}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Combat Efficiency</span>
              <span className="text-sm font-semibold text-white">{(overallKD * 50).toFixed(0)}%</span>
            </div>
            <Progress value={Math.min(overallKD * 50, 100)} className="h-2 bg-gray-700" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Team Impact</span>
              <span className="text-sm font-semibold text-white">{overallWinRate}%</span>
            </div>
            <Progress value={overallWinRate} className="h-2 bg-gray-700" />
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-900/20 bg-gray-900/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strengths.length > 0 ? strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-3">
                  <strength.icon className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white">{strength.type}</h4>
                    <p className="text-sm text-gray-400">{strength.description}</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 text-sm">Keep playing to identify your strengths!</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-900/20 bg-gray-900/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weaknesses.length > 0 ? weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-start gap-3">
                  <weakness.icon className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white">{weakness.type}</h4>
                    <p className="text-sm text-gray-400">{weakness.description}</p>
                    <Badge variant="secondary" className="mt-1 bg-red-900/20 text-red-400 text-xs">
                      {weakness.priority} priority
                    </Badge>
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 text-sm">Great performance! Keep it up!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Recommendations */}
      <Card className="border-blue-900/20 bg-gray-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-500" />
            Agent Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-2">Your Best Performing Agents</h4>
              <div className="flex flex-wrap gap-2">
                {topAgents.map((agent, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-900/20 text-blue-300">
                    {agent.agent} ({agent.win_rate.toFixed(0)}% WR)
                  </Badge>
                ))}
              </div>
            </div>
            
            <Separator className="bg-gray-700" />
            
            <div>
              <h4 className="font-medium text-white mb-2">Recommended Agents to Try</h4>
              <div className="flex flex-wrap gap-2">
                {recommendedAgents.slice(0, 3).map((agent, index) => (
                  <Badge key={index} variant="outline" className="border-blue-500/50 text-blue-400">
                    {agent}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-2">
                These agents complement your playstyle and could boost your performance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Focus */}
      <Card className="border-yellow-900/20 bg-gray-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Personalized Training Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trainingFocus.map((focus, index) => (
              <div key={index} className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{focus.area}</h4>
                  <span className="text-sm text-gray-400">{focus.timeSpent}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {focus.exercises.map((exercise, exIndex) => (
                    <Badge key={exIndex} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                      {exercise}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card className="border-indigo-900/20 bg-gradient-to-br from-indigo-900/20 to-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-500" />
            Pro Tips Based on Your Playstyle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {overallKD >= 1.5 && (
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-500 mt-0.5" />
                <p className="text-sm text-gray-300">
                  Your fragging power is strong. Focus on team coordination and utility usage to climb higher.
                </p>
              </div>
            )}
            
            {overallWinRate >= 60 && overallKD < 1.2 && (
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-500 mt-0.5" />
                <p className="text-sm text-gray-300">
                  You're a great team player! Work on individual mechanics to become a more complete player.
                </p>
              </div>
            )}
            
            {totalMatches < 50 && (
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-indigo-500 mt-0.5" />
                <p className="text-sm text-gray-300">
                  Focus on mastering 2-3 agents before expanding your pool. Quality over quantity!
                </p>
              </div>
            )}
            
            {weaponStats[0]?.headshot_percentage < 20 && (
              <div className="flex items-start gap-3">
                <Crosshair className="w-5 h-5 text-indigo-500 mt-0.5" />
                <p className="text-sm text-gray-300">
                  Spend 10-15 minutes daily in aim trainers. Headshot percentage is crucial for climbing.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
