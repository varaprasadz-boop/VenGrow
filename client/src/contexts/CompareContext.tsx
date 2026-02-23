import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "vengrow_compare_property_ids";
const MAX_COMPARE = 3;

function loadIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_COMPARE) : [];
  } catch {
    return [];
  }
}

function saveIds(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

interface CompareContextValue {
  compareIds: string[];
  addToCompare: (propertyId: string) => void;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  isInCompare: (propertyId: string) => boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>(loadIds);
  const { toast } = useToast();

  useEffect(() => {
    saveIds(compareIds);
  }, [compareIds]);

  const addToCompare = useCallback(
    (propertyId: string) => {
      setCompareIds((prev) => {
        if (prev.includes(propertyId)) return prev;
        if (prev.length >= MAX_COMPARE) {
          toast({
            title: `You can compare up to 3 properties`,
            variant: "destructive",
          });
          return prev;
        }
        const next = [...prev, propertyId];
        saveIds(next);
        toast({ title: "Added to compare" });
        return next;
      });
    },
    [toast]
  );

  const removeFromCompare = useCallback((propertyId: string) => {
    setCompareIds((prev) => prev.filter((id) => id !== propertyId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
  }, []);

  const isInCompare = useCallback(
    (propertyId: string) => compareIds.includes(propertyId),
    [compareIds]
  );

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare must be used within CompareProvider");
  }
  return ctx;
}

export function useCompareOptional() {
  return useContext(CompareContext);
}
