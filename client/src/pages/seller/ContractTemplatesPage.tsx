
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Edit } from "lucide-react";

export default function ContractTemplatesPage() {
  const templates = [
    {
      id: "1",
      name: "Sale Agreement Template",
      description: "Standard property sale agreement",
      category: "Sale",
      lastUpdated: "Nov 20, 2025",
      usageCount: 234,
    },
    {
      id: "2",
      name: "Rental Agreement Template",
      description: "Residential property rental contract",
      category: "Rental",
      lastUpdated: "Nov 15, 2025",
      usageCount: 456,
    },
    {
      id: "3",
      name: "Non-Disclosure Agreement",
      description: "NDA for property viewings",
      category: "Legal",
      lastUpdated: "Oct 30, 2025",
      usageCount: 89,
    },
  ];

  return (
    <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Contract Templates
            </h1>
            <p className="text-muted-foreground">
              Ready-to-use legal document templates
            </p>
          </div>

          <div className="space-y-4">
            {templates.map((template) => (
              <Card key={template.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-muted flex-shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {template.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Updated {template.lastUpdated}</span>
                        <span>•</span>
                        <span>Used {template.usageCount} times</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-preview-${template.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-edit-${template.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-download-${template.id}`}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
}
