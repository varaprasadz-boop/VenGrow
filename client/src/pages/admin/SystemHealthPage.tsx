import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Database, Server, Wifi, CheckCircle, AlertTriangle } from "lucide-react";

export default function SystemHealthPage() {
  const services = [
    {
      name: "Web Server",
      status: "healthy",
      uptime: "99.98%",
      responseTime: "245ms",
      icon: Server,
    },
    {
      name: "Database",
      status: "healthy",
      uptime: "99.99%",
      responseTime: "12ms",
      icon: Database,
    },
    {
      name: "API Gateway",
      status: "healthy",
      uptime: "99.95%",
      responseTime: "156ms",
      icon: Wifi,
    },
    {
      name: "Payment Service",
      status: "degraded",
      uptime: "98.50%",
      responseTime: "890ms",
      icon: Activity,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Healthy
          </Badge>
        );
      case "degraded":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Degraded
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              System Health
            </h1>
            <p className="text-muted-foreground">
              Monitor all system services and infrastructure
            </p>
          </div>

          {/* Overall Status */}
          <Card className="p-8 mb-8 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/20">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <div>
                <h2 className="font-serif font-bold text-2xl mb-1">
                  All Systems Operational
                </h2>
                <p className="text-muted-foreground">
                  Platform is running smoothly with no major issues
                </p>
              </div>
            </div>
          </Card>

          {/* Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-muted">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      {getStatusBadge(service.status)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                    <p className="text-xl font-bold">{service.uptime}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">
                      Avg Response
                    </p>
                    <p className="text-xl font-bold">{service.responseTime}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
