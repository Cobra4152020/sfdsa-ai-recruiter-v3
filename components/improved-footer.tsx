import Link from "next/link"
import { Shield, Facebook, Twitter, Youtube, Instagram, Linkedin } from "lucide-react"

export interface ImprovedfooterProps {
  className?: string
}

export function ImprovedFooter({ className }: ImprovedfooterProps = {}) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`bg-[#0A3C1F] text-white border-t border-white/10 py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-[#FFD700] mr-2" aria-hidden="true" />
              <span className="font-bold">SF Deputy Sheriff</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Serving the City and County of San Francisco with honor, integrity, and commitment to public safety.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="text-white hover:text-[#FFD700] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Twitter"
                className="text-white hover:text-[#FFD700] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to our YouTube channel"
                className="text-white hover:text-[#FFD700] transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="text-white hover:text-[#FFD700] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with us on LinkedIn"
                className="text-white hover:text-[#FFD700] transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/awards" className="text-gray-300 hover:text-white transition-colors">
                  Top Recruit Awards
                </Link>
              </li>
              <li>
                <Link href="/badges" className="text-gray-300 hover:text-white transition-colors">
                  Badge Gallery
                </Link>
              </li>
              <li>
                <Link href="/gi-bill" className="text-gray-300 hover:text-white transition-colors">
                  G.I. Bill
                </Link>
              </li>
              <li>
                <Link href="/discounted-housing" className="text-gray-300 hover:text-white transition-colors">
                  Discounted Housing
                </Link>
              </li>
              <li>
                <Link href="/trivia" className="text-gray-300 hover:text-white transition-colors">
                  SF Trivia
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Contact Us</h3>
            <address className="not-italic text-sm text-gray-300 space-y-2">
              <p>San Francisco Sheriff's Department</p>
              <p>City Hall, Room 456</p>
              <p>1 Dr. Carlton B. Goodlett Place</p>
              <p>San Francisco, CA 94102</p>
              <p className="mt-2">
                <a href="tel:+14155547225" className="hover:text-white transition-colors">
                  Phone: (415) 554-7225
                </a>
              </p>
              <p>
                <a href="mailto:recruitment@sfgov.org" className="hover:text-white transition-colors">
                  Email: recruitment@sfgov.org
                </a>
              </p>
            </address>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-gray-300 hover:text-white transition-colors">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="text-gray-300 hover:text-white transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {currentYear} San Francisco Deputy Sheriff's Association. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
