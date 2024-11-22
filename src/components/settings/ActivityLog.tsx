import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Activity, UserCheck, UserX, Settings, Download, Upload } from "lucide-react";

interface LogEntry {
  id: string;
  type: "presence" | "settings" | "export" | "import";
  description: string;
  timestamp: Date;
}

interface ActivityLogProps {
  logs: LogEntry[];
}

export const ActivityLog = ({ logs }: ActivityLogProps) => {
  const getIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "presence":
        return <UserCheck className="w-4 h-4" />;
      case "settings":
        return <Settings className="w-4 h-4" />;
      case "export":
        return <Download className="w-4 h-4" />;
      case "import":
        return <Upload className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Journal d'activités</h3>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="p-2 rounded-full bg-primary/10">
                {getIcon(log.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm">{log.description}</p>
                <p className="text-xs text-muted-foreground">
                  {log.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};