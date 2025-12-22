import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  homeHref?: string;
  className?: string;
}

export function Breadcrumbs({ items, homeHref, className = "" }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center gap-1 text-sm text-muted-foreground ${className}`}
      data-testid="nav-breadcrumbs"
    >
      {homeHref && (
        <>
          <Link href={homeHref}>
            <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer" data-testid="breadcrumb-home">
              <Home className="h-4 w-4" />
              <span className="sr-only">Dashboard</span>
            </span>
          </Link>
          {items.length > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground/50" />}
        </>
      )}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center gap-1">
            {item.href && !isLast ? (
              <Link href={item.href}>
                <span 
                  className="hover:text-foreground transition-colors cursor-pointer"
                  data-testid={`breadcrumb-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </span>
              </Link>
            ) : (
              <span 
                className={isLast ? "text-foreground font-medium" : ""}
                data-testid={`breadcrumb-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="h-4 w-4 text-muted-foreground/50" />}
          </div>
        );
      })}
    </nav>
  );
}
