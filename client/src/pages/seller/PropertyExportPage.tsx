
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function PropertyExportPage() {
  const exportOptions = [
    {
      id: "pdf",
      title: "PDF Report",
      description: "Complete property details with photos",
      format: "PDF",
    },
    {
      id: "excel",
      title: "Excel Spreadsheet",
      description: "Property data in spreadsheet format",
      format: "XLSX",
    },
    {
      id: "images",
      title: "Image Gallery",
      description: "All property photos in a ZIP file",
      format: "ZIP",
    },
  ];

  return (
    <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Download className="h-8 w-8 text-primary" />
              Export Property Data
            </h1>
            <p className="text-muted-foreground">
              Download property information in various formats
            </p>
          </div>

          <div className="space-y-4">
            {exportOptions.map((option) => (
              <Card key={option.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {option.description}
                    </p>
                    <span className="text-xs px-2 py-1 bg-muted rounded font-mono">
                      .{option.format.toLowerCase()}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    data-testid={`button-export-${option.id}`}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
}
