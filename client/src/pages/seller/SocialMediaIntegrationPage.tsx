
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Share2, CheckCircle } from "lucide-react";

export default function SocialMediaIntegrationPage() {
  const platforms = [
    {
      id: "facebook",
      name: "Facebook",
      description: "Share new listings to Facebook page",
      connected: true,
      autoPost: true,
    },
    {
      id: "instagram",
      name: "Instagram",
      description: "Post property photos to Instagram",
      connected: true,
      autoPost: false,
    },
    {
      id: "twitter",
      name: "Twitter/X",
      description: "Tweet property updates",
      connected: false,
      autoPost: false,
    },
  ];

  return (


      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Share2 className="h-8 w-8 text-primary" />
              Social Media Integration
            </h1>
            <p className="text-muted-foreground">
              Connect social accounts to promote your properties
            </p>
    

          <div className="space-y-4">
            {platforms.map((platform) => (
              <Card key={platform.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{platform.name}</h3>
                      {platform.connected ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not Connected</Badge>
                      )}
              
                    <p className="text-sm text-muted-foreground mb-4">
                      {platform.description}
                    </p>

                    {platform.connected && (
                      <div className="flex items-center gap-3">
                        <Switch
                          defaultChecked={platform.autoPost}
                          data-testid={`switch-autopost-${platform.id}`}
                        />
                        <span className="text-sm">Auto-post new listings</span>
                
                    )}
            

                  <div className="ml-4">
                    {platform.connected ? (
                      <Button
                        variant="outline"
                        data-testid={`button-disconnect-${platform.id}`}
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button data-testid={`button-connect-${platform.id}`}>
                        Connect
                      </Button>
                    )}
            
          
              </Card>
            ))}
    

          <Card className="p-6 mt-8 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
            <h3 className="font-semibold mb-2">Maximize Your Reach</h3>
            <p className="text-sm text-muted-foreground">
              Connected social accounts help you reach more potential buyers.
              Properties shared on social media get 3x more inquiries.
            </p>
          </Card>
  
      </main>
  );
}
