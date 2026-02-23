import { icons, type LucideIcon } from "lucide-react";

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function DynamicIcon({ name, className, size }: DynamicIconProps) {
  const IconComponent = icons[name as keyof typeof icons] as LucideIcon | undefined;

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} size={size} />;
}
