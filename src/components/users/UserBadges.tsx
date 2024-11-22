import { Card } from "@/components/ui/card";
import { Trophy, Star, Award, Medal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Badge {
  icon: JSX.Element;
  name: string;
  description: string;
  earned: boolean;
}

interface UserBadgesProps {
  attendanceCount: number;
}

export const UserBadges = ({ attendanceCount }: UserBadgesProps) => {
  const badges: Badge[] = [
    {
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      name: "Assidu",
      description: "Présent à 10 événements",
      earned: attendanceCount >= 10
    },
    {
      icon: <Star className="w-6 h-6 text-blue-500" />,
      name: "Régulier",
      description: "Présent à 25 événements",
      earned: attendanceCount >= 25
    },
    {
      icon: <Award className="w-6 h-6 text-purple-500" />,
      name: "Fidèle",
      description: "Présent à 50 événements",
      earned: attendanceCount >= 50
    },
    {
      icon: <Medal className="w-6 h-6 text-red-500" />,
      name: "Champion",
      description: "Présent à 100 événements",
      earned: attendanceCount >= 100
    }
  ];

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Badges</h3>
      <div className="flex gap-4">
        <TooltipProvider>
          {badges.map((badge) => (
            <Tooltip key={badge.name}>
              <TooltipTrigger>
                <div className={`p-3 rounded-full ${
                  badge.earned 
                    ? "bg-primary/10 ring-2 ring-primary/20" 
                    : "bg-gray-100 opacity-50"
                }`}>
                  {badge.icon}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-semibold">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                  {!badge.earned && (
                    <p className="text-xs text-primary mt-1">
                      {attendanceCount} / {parseInt(badge.description.match(/\d+/)?.[0] || "0")} présences
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </Card>
  );
};