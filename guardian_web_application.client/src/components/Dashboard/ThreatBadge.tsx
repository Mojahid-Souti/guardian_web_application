import { Badge } from "@/components/ui/badge";

interface ThreatBadgeProps {
     level?: string;
}

export const ThreatBadge: React.FC<ThreatBadgeProps> = ({ level = 'unknown' }) => {
     const getColorClass = (threatLevel: string): string => {
          switch (threatLevel.toLowerCase()) {
               case 'low':
                    return 'bg-green-100 text-green-800';
               case 'medium':
                    return 'bg-yellow-100 text-yellow-800';
               case 'high':
                    return 'bg-red-100 text-red-800';
               case 'critical':
                    return 'bg-purple-100 text-purple-800';
               default:
                    return 'bg-gray-100 text-gray-800';
          }
     };

     const displayText = level ? level.charAt(0).toUpperCase() + level.slice(1) : 'Unknown';
     const colorClass = getColorClass(level || '');

     return (
          <Badge variant="outline" className={colorClass}>
               {displayText}
          </Badge>
     );
};