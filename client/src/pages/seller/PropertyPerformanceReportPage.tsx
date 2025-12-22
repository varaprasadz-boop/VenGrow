
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Eye, MessageCircle, Heart, Download } from "lucide-react";

export default function PropertyPerformanceReportPage() {
  const property = {
    title: "Luxury 3BHK Apartment",
    location: "Bandra West, Mumbai",
    listedDate: "Nov 1, 2025",
  };

  const metrics = [
    {
      label: "Total Views",
      value: "1,234",
      change: "+15%",
      icon: Eye,
      color: "blue",
    },
    {
      label: "Total Inquiries",
      value: "45",
      change: "+8%",
      icon: MessageCircle,
      color: "green",
    },
    {
      label: "Shortlisted",
      value: "67",
      change: "+12%",
      icon: Heart,
      color: "red",
    },
    {
      label: "Avg. Response Time",
      value: "2.4 hrs",
      change: "-10%",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  return (


      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Performance Report
              </h1>
              <p className="text-muted-foreground">
                {property.title} • Listed on {property.listedDate}
              </p>
      
            <Button variant="outline" data-testid="button-export">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
    

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/20`}>
                    <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
            
          
                <p className="text-3xl font-bold mb-2">{metric.value}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <span className={`text-sm ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </span>
          
              </Card>
            ))}
    

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Views Over Time</h3>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <span className="text-muted-foreground">Views Chart</span>
        
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Inquiry Sources</h3>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <span className="text-muted-foreground">Sources Chart</span>
        
            </Card>
    

          {/* Demographics */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Viewer Demographics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-4">Age Groups</h4>
                <div className="space-y-3">
                  {[
                    { label: "25-34 years", value: 45 },
                    { label: "35-44 years", value: 30 },
                    { label: "45+ years", value: 25 },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium">{item.value}%</span>
                
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${item.value}%` }}
                        />
                
              
                  ))}
          
        

              <div>
                <h4 className="font-medium mb-4">Locations</h4>
                <div className="space-y-3">
                  {[
                    { label: "Mumbai", value: 60 },
                    { label: "Pune", value: 25 },
                    { label: "Others", value: 15 },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium">{item.value}%</span>
                
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${item.value}%` }}
                        />
                
              
                  ))}
          
        

              <div>
                <h4 className="font-medium mb-4">Devices</h4>
                <div className="space-y-3">
                  {[
                    { label: "Mobile", value: 65 },
                    { label: "Desktop", value: 30 },
                    { label: "Tablet", value: 5 },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium">{item.value}%</span>
                
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${item.value}%` }}
                        />
                
              
                  ))}
          
        
      
          </Card>
  
      </main>
  );
}
