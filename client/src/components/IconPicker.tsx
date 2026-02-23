import { useState, useMemo } from "react";
import { icons } from "lucide-react";
import { DynamicIcon } from "@/components/DynamicIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X } from "lucide-react";

const CURATED_ICONS = [
  "Home", "Building", "Building2", "Hotel", "Warehouse", "Factory", "Castle", "Church", "Landmark",
  "Bed", "BedDouble", "BedSingle", "Bath", "ShowerHead", "Sofa",
  "DoorOpen", "DoorClosed", "Fence", "ParkingCircle", "Car", "CarFront",
  "Trees", "TreePine", "Flower2", "Sun", "CloudSun", "Droplets", "Waves",
  "Ruler", "Maximize2", "Move", "Square", "RectangleHorizontal", "Grid3x3",
  "Compass", "MapPin", "Map", "Navigation", "Globe",
  "IndianRupee", "Wallet", "CreditCard", "Receipt", "Calculator",
  "Star", "Heart", "Award", "Trophy", "Medal", "ThumbsUp",
  "Shield", "ShieldCheck", "Lock", "Key", "KeyRound",
  "Wifi", "Tv", "AirVent", "Fan", "Flame", "Zap", "Lightbulb", "Plug",
  "Dumbbell", "Swimming", "Bike", "Footprints",
  "Phone", "Mail", "Clock", "Calendar", "CalendarDays",
  "Camera", "Image", "Video", "FileText", "FileCheck", "FolderOpen",
  "Users", "UserCheck", "Baby", "PawPrint",
  "Mountain", "Palmtree", "Tent", "Umbrella",
  "Hammer", "Wrench", "PaintBucket", "Paintbrush",
  "ArrowUpDown", "Layers", "LayoutGrid", "List", "CheckCircle2", "CircleCheck",
  "Eye", "Sparkles", "Tag", "Percent",
];

const validIconNames = CURATED_ICONS.filter((name) => name in icons);

interface IconPickerProps {
  value?: string;
  onChange: (iconName: string) => void;
  placeholder?: string;
}

export function IconPicker({ value, onChange, placeholder = "Select icon..." }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return validIconNames;
    const q = search.toLowerCase();
    return validIconNames.filter((name) => name.toLowerCase().includes(q));
  }, [search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 font-normal"
          data-testid="button-icon-picker"
        >
          {value ? (
            <>
              <DynamicIcon name={value} className="h-4 w-4" />
              <span>{value}</span>
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="flex items-center gap-2 border-b p-2">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 p-0 h-auto focus-visible:ring-0"
            data-testid="input-icon-search"
          />
          {value && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              data-testid="button-clear-icon"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <ScrollArea className="h-[240px]">
          <div className="grid grid-cols-4 gap-1 p-2">
            {filtered.map((name) => (
              <Button
                key={name}
                variant={value === name ? "default" : "ghost"}
                size="icon"
                className="relative group"
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                  setSearch("");
                }}
                title={name}
                data-testid={`button-icon-${name}`}
              >
                <DynamicIcon name={name} className="h-4 w-4" />
              </Button>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-4 text-sm text-muted-foreground text-center py-4">
                No icons found
              </p>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
