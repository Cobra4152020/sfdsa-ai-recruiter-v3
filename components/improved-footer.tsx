import Link from "next/link"
import Image from "next/image"
import { Shield, Facebook, Twitter, Youtube, Instagram, Linkedin, Heart } from "lucide-react"

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
                href="https://www.facebook.com/SanFranciscoDeputySheriffsAssociation"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="text-white hover:text-[#FFD700] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/sanfranciscodsa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Twitter"
                className="text-white hover:text-[#FFD700] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCgyW7q86c-Mua4bS1a9wBWA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to our YouTube channel"
                className="text-white hover:text-[#FFD700] transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/sfdeputysheriffsassociation/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="text-white hover:text-[#FFD700] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/san-francisco-deputy-sheriffs%E2%80%99-association/"
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
              <li>
                <Link href="/donor-recognition" className="text-gray-300 hover:text-white transition-colors">
                  Donor Recognition
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Contact Us</h3>
            <address className="not-italic text-sm text-gray-300 space-y-4">
              <div className="flex items-center">
                <a
                  href="https://sanfranciscodsa.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-white transition-colors group"
                >
                  <div className="w-12 h-12 mr-3 flex-shrink-0">
                    <Image
                      src="/sfdsa-logo.png"
                      alt="San Francisco Deputy Sheriffs' Association Logo"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <span className="group-hover:text-white transition-colors">
                    San Francisco Deputy Sheriffs' Association 501(c)5
                  </span>
                </a>
              </div>

              <div className="flex items-center mt-6">
                <a
                  href="https://protectingsanfrancisco.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-white transition-colors group"
                >
                  <div className="w-12 h-12 mr-3 flex-shrink-0">
                    <Image
                      src="/protecting-sf-logo.png"
                      alt="Protecting San Francisco Logo"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <span className="group-hover:text-white transition-colors">Protecting San Francisco 501(c)3</span>
                </a>
              </div>

              <div className="mt-4">
                <Link
                  href="/donate"
                  className="inline-flex items-center px-4 py-2 bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] font-bold rounded-md transition-colors shadow-md"
                >
                  <Heart className="h-4 w-4 mr-2" aria-hidden="true" />
                  <span>Support Our Mission</span>
                </Link>
              </div>

              <p className="mt-4">35 Gilbert Street</p>
              <p>San Francisco, CA 94103</p>
              <p>
                <a href="tel:+14156962428" className="hover:text-white transition-colors">
                  Phone: (415) 696-2428
                </a>
              </p>
              <p>
                <a href="mailto:email@protectingsanfrancisco.com" className="hover:text-white transition-colors">
                  Email: email@protectingsanfrancisco.com
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
          <div className="col-span-1">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/volunteer-login" className="text-gray-300 hover:text-white transition-colors">
                    Volunteer Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {currentYear} San Francisco Deputy Sheriffs' Association 501(c)5 & Protecting San Francisco 501(c)3. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
