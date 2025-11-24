import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, HardDrive, Activity, AlertTriangle } from "lucide-react";

export default function DatabaseManagementPage() {
  const stats = {
    size: "24.5 GB",
    tables: 42,
    records: "1.2M",
    connections: 24,
  };

  const tables = [
    { name: "users", records: 156789, size: "2.4 GB", growth: "+2.3%" },
    { name: "properties", records: 56234, size: "8.1 GB", growth: "+5.7%" },
    { name: "inquiries", records: 234567, size: "1.2 GB", growth: "+12.4%" },
    { name: "transactions", records: 45678, size: "890 MB", growth: "+3.1%" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Database Management
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage database health
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <HardDrive className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.size}</p>
                  <p className="text-sm text-muted-foreground">Database Size</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.tables}</p>
                  <p className="text-sm text-muted-foreground">Tables</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.records}</p>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.connections}</p>
                  <p className="text-sm text-muted-foreground">Active Connections</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tables */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Table Statistics</h3>
            <div className="space-y-4">
              {tables.map((table, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold mb-1">{table.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {table.records.toLocaleString()} records
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-medium">{table.size}</p>
                      <p className="text-xs text-muted-foreground">Size</p>
                    </div>
                    <Badge
                      className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500"
                    >
                      {table.growth}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" data-testid="button-optimize">
              <Database className="h-4 w-4 mr-2" />
              Optimize Database
            </Button>
            <Button variant="outline" data-testid="button-vacuum">
              <Activity className="h-4 w-4 mr-2" />
              Run Vacuum
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
