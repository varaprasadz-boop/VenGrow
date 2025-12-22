
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText } from "lucide-react";

export default function ExportDataPage() {
  const exportOptions = [
    {
      id: "properties",
      title: "Property Listings",
      description: "Export all your property listings with details",
      formats: ["CSV", "Excel", "PDF"],
    },
    {
      id: "inquiries",
      title: "Buyer Inquiries",
      description: "Export inquiry history and contact details",
      formats: ["CSV", "Excel"],
    },
    {
      id: "analytics",
      title: "Performance Analytics",
      description: "Export property performance metrics",
      formats: ["Excel", "PDF"],
    },
    {
      id: "transactions",
      title: "Payment History",
      description: "Export transaction and payment records",
      formats: ["CSV", "Excel", "PDF"],
    },
  ];

  return (


      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Download className="h-8 w-8 text-primary" />
              Export Data
            </h1>
            <p className="text-muted-foreground">
              Download your data in various formats
            </p>
    

          <div className="space-y-4">
            {exportOptions.map((option) => (
              <Card key={option.id} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
            
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {option.description}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label htmlFor={`format-${option.id}`}>Format</Label>
                        <Select>
                          <SelectTrigger
                            id={`format-${option.id}`}
                            className="mt-1"
                            data-testid={`select-format-${option.id}`}
                          >
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            {option.formats.map((format) => (
                              <SelectItem key={format} value={format.toLowerCase()}>
                                {format}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                
                      <Button
                        className="mt-6"
                        data-testid={`button-export-${option.id}`}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
              
            
          
              </Card>
            ))}
    

          <Card className="p-6 mt-8 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
            <h3 className="font-semibold mb-2">Data Privacy</h3>
            <p className="text-sm text-muted-foreground">
              Exported data contains sensitive information. Keep files secure and
              delete them after use.
            </p>
          </Card>
  
      </main>
  );
}
