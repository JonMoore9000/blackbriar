import { GameRun } from '@/types';
import { getStatDistribution } from '@/lib/utils';

interface RunStatsProps {
  run: GameRun;
}

export default function RunStats({ run }: RunStatsProps) {
  const statDistribution = getStatDistribution(run);
  
  return (
    <div className="space-y-3">
      {statDistribution.map(({ stat, value, percentage }) => (
        <div key={stat} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold text-gray-400 w-8">{stat}</span>
            <div className="flex-1 bg-gray-700 rounded-full h-2 min-w-[100px]">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  stat === 'HP' ? 'bg-red-500' :
                  stat === 'ATK' ? 'bg-orange-500' :
                  stat === 'DEF' ? 'bg-blue-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.max(percentage, 5)}%` }}
              />
            </div>
          </div>
          <span className="text-white font-semibold text-sm w-8 text-right">{value}</span>
        </div>
      ))}
    </div>
  );
}
