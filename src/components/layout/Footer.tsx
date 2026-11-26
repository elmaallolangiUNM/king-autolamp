import Link from 'next/link';
import Image from 'next/image';
import { Instagram, MessageCircle, MapPin, Clock, ArrowRight } from 'lucide-react';
import { storeConfig } from '@/lib/config';

const footerLinks = {
  Navigation: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Categories', href: '/categories' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  Categories: [
    { label: 'BILED Projector', href: '/products?category=BILED+Projector' },
    { label: 'Mini Projector', href: '/products?category=Mini+Projector' },
    { label: 'Fog Lamp', href: '/products?category=Fog+Lamp' },
    { label: 'Accessories', href: '/products?category=Automotive+Accessories' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark-100 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4" aria-label="KING AUTOLAMP">
              <Image
                src="/images/kingautolamp-logo.png"
                alt="KING AUTOLAMP"
                width={685}
                height={150}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-silver text-sm leading-relaxed mb-5">
              {storeConfig.store_description}
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <a
                href={storeConfig.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-dark-300 border border-white/5 rounded-lg flex items-center justify-center text-silver hover:text-white hover:bg-primary transition-all"
                aria-label="Instagram KING AUTOLAMP"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${storeConfig.whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-dark-300 border border-white/5 rounded-lg flex items-center justify-center text-silver hover:text-white hover:bg-green-600 transition-all"
                aria-label="WhatsApp KING AUTOLAMP"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded"></span>
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-silver text-sm hover:text-white flex items-center gap-1 transition-colors group"
                    >
                      <ArrowRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded"></span>
              Hubungi Kami
            </h4>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-silver text-sm">{storeConfig.store_address}</span>
              </li>
              <li className="flex gap-3">
                <MessageCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <a
                    href={`https://wa.me/${storeConfig.whatsapp_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-silver text-sm hover:text-green-400 transition-colors"
                  >
                    +{storeConfig.whatsapp_number}
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-silver text-sm space-y-1">
                  <div>{storeConfig.store_hours_weekday}</div>
                  <div>{storeConfig.store_hours_weekend}</div>
                  <div>{storeConfig.store_hours_sunday}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-silver text-sm">
            © {year} KING AUTOLAMP. All rights reserved.
          </p>
          <p className="text-silver-dark text-xs tracking-wider uppercase">
            Dark Premium Automotive Lighting — Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
