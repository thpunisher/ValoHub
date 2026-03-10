'use client';

import { useState } from 'react';
import { Search, User, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const searchSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  tag: z.string().min(3, 'Tag must be at least 3 characters'),
  region: z.enum(['na', 'eu', 'ap', 'kr', 'br', 'latam']).default('na'),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface PlayerSearchProps {
  onSearch: (name: string, tag: string, region: string) => void;
  isLoading?: boolean;
}

export function PlayerSearch({ onSearch, isLoading = false }: PlayerSearchProps) {
  const [recentSearches, setRecentSearches] = useState<Array<{ name: string; tag: string; region: string }>>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      region: 'na',
    },
  });

  const selectedRegion = watch('region');

  const onSubmit = (data: SearchFormData) => {
    onSearch(data.name, data.tag, data.region);
    
    const newSearch = { name: data.name, tag: data.tag, region: data.region };
    setRecentSearches(prev => {
      const filtered = prev.filter(search => 
        !(search.name === data.name && search.tag === data.tag && search.region === data.region)
      );
      return [newSearch, ...filtered].slice(0, 5);
    });
  };

  const regions = [
    { value: 'na', label: 'North America', flag: '🇺🇸' },
    { value: 'eu', label: 'Europe', flag: '🇪🇺' },
    { value: 'ap', label: 'Asia Pacific', flag: '🌏' },
    { value: 'kr', label: 'Korea', flag: '🇰🇷' },
    { value: 'br', label: 'Brazil', flag: '🇧🇷' },
    { value: 'latam', label: 'Latin America', flag: '🇲🇽' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="border-red-900/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Search className="w-6 h-6 text-red-500" />
            Player Statistics Search
          </CardTitle>
          <CardDescription className="text-gray-400">
            Search for any Valorant player to view detailed match statistics, agent performance, and rankings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Player Name
                </label>
                <Input
                  {...register('name')}
                  placeholder="Enter player name"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
                />
                {errors.name && (
                  <p className="text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Player Tag
                </label>
                <Input
                  {...register('tag')}
                  placeholder="Enter player tag"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
                />
                {errors.tag && (
                  <p className="text-sm text-red-400">{errors.tag.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Region</label>
              <Select value={selectedRegion} onValueChange={(value) => setValue('region', value as any)}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white focus:border-red-500 focus:ring-red-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {regions.map(region => (
                    <SelectItem key={region.value} value={region.value} className="text-white hover:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span>{region.flag}</span>
                        <span>{region.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Player Stats
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {recentSearches.length > 0 && (
        <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-white">Recent Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors cursor-pointer"
                  onClick={() => onSearch(search.name, search.tag, search.region)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-white">
                      <span className="font-medium">{search.name}</span>
                      <span className="text-gray-400 mx-1">#</span>
                      <span className="text-gray-400">{search.tag}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                    {regions.find(r => r.value === search.region)?.flag} {search.region.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
