import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Send, Loader2, Settings } from "lucide-react";

interface SiteSetting {
  key: string;
  value: string | null;
}

interface StaticPage {
  id: string;
  slug: string;
  title: string;
  content: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: settings = [], isLoading: settingsLoading } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: pageContent, isLoading: pageLoading } = useQuery<StaticPage>({
    queryKey: ["/api/static-pages", "contact"],
    staleTime: 5 * 60 * 1000,
  });

  const getSettingValue = (key: string): string | null => {
    const setting = settings.find(s => s.key === key);
    return setting?.value || null;
  };

  const contactEmail = getSettingValue("contact_email");
  const contactPhone = getSettingValue("contact_phone");
  const contactAddress = getSettingValue("contact_address");
  const businessHours = getSettingValue("business_hours");
  const pageTitle = getSettingValue("contact_page_title") || pageContent?.title;
  const pageSubtitle = getSettingValue("contact_page_subtitle") || pageContent?.content;
  const formTitle = getSettingValue("contact_form_title");
  const formSubtitle = getSettingValue("contact_form_subtitle");

  const hasContactInfo = contactEmail || contactPhone || contactAddress || businessHours;

  const contactCards = [
    contactEmail ? {
      icon: Mail,
      title: getSettingValue("contact_email_title"),
      value: contactEmail,
      description: getSettingValue("contact_email_description"),
    } : null,
    contactPhone ? {
      icon: Phone,
      title: getSettingValue("contact_phone_title"),
      value: contactPhone,
      description: getSettingValue("contact_phone_description"),
    } : null,
    contactAddress ? {
      icon: MapPin,
      title: getSettingValue("contact_address_title"),
      value: contactAddress,
      description: getSettingValue("contact_address_description"),
    } : null,
    businessHours ? {
      icon: Clock,
      title: getSettingValue("contact_hours_title"),
      value: businessHours,
      description: getSettingValue("contact_hours_description"),
    } : null,
  ].filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log("Contact form submitted:", formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (settingsLoading || pageLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Skeleton className="h-8 w-32 mx-auto mb-4" />
              <Skeleton className="h-12 w-64 mx-auto mb-6" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
          </section>
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const hasContent = pageTitle || pageSubtitle || hasContactInfo;

  if (!hasContent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Badge className="mb-4">Contact</Badge>
              <Card className="p-8 text-center max-w-md mx-auto mt-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-semibold text-xl mb-2">Page Not Configured</h2>
                <p className="text-muted-foreground text-sm">
                  Configure Contact page settings and content in the Admin Panel.
                </p>
              </Card>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {(pageTitle || pageSubtitle) && (
          <section className="py-16 bg-gradient-to-b from-primary/5 to-background" data-testid="section-contact-hero">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Badge className="mb-4">Contact</Badge>
              {pageTitle && (
                <h1 className="font-serif font-bold text-4xl sm:text-5xl mb-6" data-testid="text-contact-title">
                  {pageTitle}
                </h1>
              )}
              {pageSubtitle && (
                <p className="text-lg text-muted-foreground">
                  {pageSubtitle}
                </p>
              )}
            </div>
          </section>
        )}

        <section className="py-16" data-testid="section-contact-info">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {contactCards.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16" data-testid="grid-contact-cards">
                {contactCards.map((info, index) => {
                  if (!info) return null;
                  const Icon = info.icon;
                  return (
                    <Card key={index} className="p-6 text-center" data-testid={`card-contact-${index}`}>
                      <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      {info.title && <h3 className="font-semibold mb-1">{info.title}</h3>}
                      <p className="font-medium text-sm mb-1" data-testid={`text-contact-value-${index}`}>
                        {info.value}
                      </p>
                      {info.description && (
                        <p className="text-xs text-muted-foreground">
                          {info.description}
                        </p>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" data-testid="section-contact-form">
              <div>
                {(formTitle || formSubtitle) && (
                  <>
                    {formTitle && <h2 className="font-serif font-bold text-3xl mb-4">{formTitle}</h2>}
                    {formSubtitle && <p className="text-muted-foreground mb-8">{formSubtitle}</p>}
                  </>
                )}

                <Card className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{getSettingValue("contact_form_name_label") || "Name"}</Label>
                      <Input
                        id="name"
                        placeholder={getSettingValue("contact_form_name_placeholder") || ""}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        data-testid="input-name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{getSettingValue("contact_form_email_label") || "Email"}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={getSettingValue("contact_form_email_placeholder") || ""}
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        data-testid="input-email"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{getSettingValue("contact_form_phone_label") || "Phone"}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={getSettingValue("contact_form_phone_placeholder") || ""}
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        data-testid="input-phone"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">{getSettingValue("contact_form_subject_label") || "Subject"}</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) =>
                          setFormData({ ...formData, subject: value })
                        }
                      >
                        <SelectTrigger id="subject" data-testid="select-subject">
                          <SelectValue placeholder={getSettingValue("contact_form_subject_placeholder") || ""} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="sales">Sales & Packages</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{getSettingValue("contact_form_message_label") || "Message"}</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        placeholder={getSettingValue("contact_form_message_placeholder") || ""}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        data-testid="textarea-message"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                      data-testid="button-submit"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      {getSettingValue("contact_form_submit_label") || "Submit"}
                    </Button>
                  </form>
                </Card>
              </div>

              <div>
                <Card className="p-0 overflow-hidden">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Map</p>
                    </div>
                  </div>
                </Card>

                {contactAddress && (
                  <div className="mt-6 space-y-4">
                    <Card className="p-4" data-testid="card-office-address">
                      {getSettingValue("contact_office_label") && (
                        <h3 className="font-semibold mb-2">{getSettingValue("contact_office_label")}</h3>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {contactAddress}
                      </p>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
