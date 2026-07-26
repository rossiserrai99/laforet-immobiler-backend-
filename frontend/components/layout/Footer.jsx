import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Input, Button, Separator, Logo } from '@/components/ui';

export function Footer() {
  return (
    <footer className="bg-charcoal-900 text-warm-200 pt-20 pb-8 mt-auto">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand & Contact */}
          <div className="space-y-6">
            <Logo 
              variant="light"
              className="h-14 w-auto object-contain drop-shadow-md" 
            />
            <p className="text-sm text-warm-400 max-w-xs leading-relaxed">
              L&apos;agence immobilière de référence pour les biens de prestige et l&apos;immobilier de luxe en Algérie.
            </p>
            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gold-500 mt-0.5 shrink-0" />
                <span className="text-sm">62 Boulevard 5<br />Alger, Algérie</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gold-500 shrink-0" />
                <span className="text-sm">+213 550 19 88 33</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gold-500 shrink-0" />
                <span className="text-sm">Belaid.laforet@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-xl text-white mb-6">Navigation</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-sm hover:text-gold-400 transition-colors">Accueil</Link></li>
              <li><Link href="/properties" className="text-sm hover:text-gold-400 transition-colors">Propriétés Exclusives</Link></li>
              <li><Link href="/#services" className="text-sm hover:text-gold-400 transition-colors">Nos Services</Link></li>
              <li><Link href="/#agence" className="text-sm hover:text-gold-400 transition-colors">L&apos;Agence</Link></li>
              <li><Link href="/estimation" className="text-sm hover:text-gold-400 transition-colors">Estimer mon bien</Link></li>
            </ul>
          </div>

          {/* Legal & Categories */}
          <div>
            <h3 className="font-serif text-xl text-white mb-6">Informations</h3>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-sm hover:text-gold-400 transition-colors">Questions Fréquentes</Link></li>
              <li><Link href="/mentions-legales" className="text-sm hover:text-gold-400 transition-colors">Mentions Légales</Link></li>
              <li><Link href="/confidentialite" className="text-sm hover:text-gold-400 transition-colors">Politique de Confidentialité</Link></li>
              <li><Link href="/#contact" className="text-sm hover:text-gold-400 transition-colors">Contactez-nous</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif text-xl text-white mb-6">Newsletter</h3>
            <p className="text-sm text-warm-400 mb-4">
              Abonnez-vous pour recevoir nos dernières propriétés de prestige en exclusivité.
            </p>
            <form className="flex flex-col gap-3" action="">
              <Input 
                placeholder="Votre adresse email" 
                className="bg-charcoal-800 border-charcoal-700 text-white placeholder:text-warm-400"
              />
              <Button variant="gold" className="w-full">S&apos;inscrire</Button>
            </form>
            <div className="flex gap-4 mt-8">
              <a href="#" className="text-warm-400 hover:text-white transition-colors" aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-warm-400 hover:text-white transition-colors" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-warm-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <Separator className="bg-charcoal-800" />
        
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-warm-400">
          <p>© {new Date().getFullYear()} LA FORÊT - Agence Immobilière. Tous droits réservés.</p>
          <p>Créé avec passion en Algérie.</p>
        </div>
      </div>
    </footer>
  );
}
