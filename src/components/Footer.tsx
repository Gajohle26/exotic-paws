import { Link } from 'react-router-dom';
import { Shield, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-secondary text-secondary-foreground">
      <div className="w-full max-w-[100rem] mx-auto px-8 lg:px-16 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <h3 className="font-heading text-3xl font-bold mb-4">
              Zafira Nero
            </h3>
            <p className="font-paragraph text-secondary-foreground/80 mb-6 max-w-md">
              A transparent and regulated exotic pet adoption platform ensuring legal compliance and ethical practices for every transaction.
            </p>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-paragraph">Verified & Regulated Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xl font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/pets" className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                  Browse Pets
                </Link>
              </li>
              <li>
                <Link to="/auctions" className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                  Live Auctions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-xl font-semibold mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <span className="font-paragraph text-secondary-foreground/80">
                  info@zafiranero.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="font-paragraph text-secondary-foreground/80">
                  Serving verified locations globally
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-secondary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-sm text-secondary-foreground/60">
              © {new Date().getFullYear()} Zafira Nero. All rights reserved.
            </p>
            <div className="flex gap-6">
              <button className="font-paragraph text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                Privacy Policy
              </button>
              <button className="font-paragraph text-sm text-secondary-foreground/60 hover:text-primary transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
