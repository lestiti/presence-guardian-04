import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";

interface AdvancedSearchProps {
  onSearch: (params: any) => void;
}

export const AdvancedSearch = ({ onSearch }: AdvancedSearchProps) => {
  const [searchParams, setSearchParams] = useState({
    searchTerm: "",
    role: "all",
    synodId: "all",
    dateRange: {
      start: null as Date | null,
      end: null as Date | null,
    },
    status: "",
  });

  const handleSearch = () => {
    onSearch(searchParams);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Recherche avancée
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Recherche avancée</SheetTitle>
          <SheetDescription>
            Utilisez les filtres pour affiner votre recherche
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Recherche</label>
            <Input
              placeholder="Nom, téléphone..."
              value={searchParams.searchTerm}
              onChange={(e) =>
                setSearchParams({ ...searchParams, searchTerm: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Fonction</label>
            <Select
              value={searchParams.role}
              onValueChange={(value) =>
                setSearchParams({ ...searchParams, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une fonction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="MPIOMANA">Mpiomana</SelectItem>
                <SelectItem value="MPIANDRY">Mpiandry</SelectItem>
                <SelectItem value="MPAMPIANATRA">Mpampianatra</SelectItem>
                <SelectItem value="IRAKA">Iraka</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Période</label>
            <div className="grid gap-2">
              <Calendar
                mode="single"
                selected={searchParams.dateRange.start}
                onSelect={(date) =>
                  setSearchParams({
                    ...searchParams,
                    dateRange: { ...searchParams.dateRange, start: date },
                  })
                }
              />
            </div>
          </div>
          <Button className="w-full" onClick={handleSearch}>
            Appliquer les filtres
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};