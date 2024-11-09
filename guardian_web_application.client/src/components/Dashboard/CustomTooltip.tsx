import { CustomTooltipProps } from '@/types/dashboard';

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
     if (active && payload && payload.length) {
          return (
               <div className="p-4 border border-gray-200 rounded-lg shadow-lg bg-white/90 backdrop-blur-sm">
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    {payload.map((entry, index) => (
                         <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {`${entry.name}: ${entry.value}`}
                         </p>
                    ))}
               </div>
          );
     }
     return null;
};

export default CustomTooltip;