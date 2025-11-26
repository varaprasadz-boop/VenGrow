import { Link } from "wouter";
import { Building2, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-serif font-bold text-xl">VenGrow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              India's trusted verified property marketplace. Find your dream property with verified sellers and transparent pricing.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover-elevate active-elevate-2 p-2 rounded-md" data-testid="link-facebook">
                <Facebook className="h-5 w-5 text-muted-foreground" />
              </a>
              <a href="#" className="hover-elevate active-elevate-2 p-2 rounded-md" data-testid="link-twitter">
                <Twitter className="h-5 w-5 text-muted-foreground" />
              </a>
              <a href="#" className="hover-elevate active-elevate-2 p-2 rounded-md" data-testid="link-instagram">
                <Instagram className="h-5 w-5 text-muted-foreground" />
              </a>
              <a href="#" className="hover-elevate active-elevate-2 p-2 rounded-md" data-testid="link-linkedin">
                <Linkedin className="h-5 w-5 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-about">
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/how-it-works">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-how-it-works">
                    How It Works
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-pricing">
                    Pricing
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-faq">
                    FAQ
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="font-semibold mb-4">For Sellers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/seller/register">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-seller-register">
                    Become a Seller
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/packages">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-packages">
                    View Packages
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/seller/guide">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-seller-guide">
                    Seller Guide
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-contact-support">
                    Contact Support
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>support@vengrow.in</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>+91 1800-123-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} VenGrow. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy">
              <a className="hover:text-foreground transition-colors" data-testid="link-privacy">
                Privacy Policy
              </a>
            </Link>
            <Link href="/terms">
              <a className="hover:text-foreground transition-colors" data-testid="link-terms">
                Terms of Service
              </a>
            </Link>
            <Link href="/refund">
              <a className="hover:text-foreground transition-colors" data-testid="link-refund">
                Refund Policy
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
