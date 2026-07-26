"use client";

import React, { useState } from 'react';
import { 
  Button, Badge, Card, Input, Select, Textarea, 
  Modal, Drawer, Skeleton, Spinner, Separator 
} from '@/components/ui';

export default function DesignSystemPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-warm-50 py-12 px-6 sm:px-12 md:px-24">
      <header className="mb-16">
        <h1 className="text-5xl font-serif text-forest-800 mb-4">LA FORÊT</h1>
        <p className="text-xl text-warm-400 font-sans">Design System & Primitive Components Preview</p>
      </header>

      <div className="space-y-16 max-w-5xl">
        {/* Colors */}
        <section>
          <h2 className="text-2xl font-serif text-charcoal-900 border-b border-warm-200 pb-2 mb-6">Colors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="h-24 rounded-2xl bg-forest-500 shadow-sm flex items-end p-4"><span className="text-white text-sm font-medium">Forest 500</span></div>
            <div className="h-24 rounded-2xl bg-forest-800 shadow-sm flex items-end p-4"><span className="text-white text-sm font-medium">Forest 800</span></div>
            <div className="h-24 rounded-2xl bg-gold-400 shadow-sm flex items-end p-4"><span className="text-charcoal-900 text-sm font-medium">Gold 400</span></div>
            <div className="h-24 rounded-2xl bg-charcoal-900 shadow-sm flex items-end p-4"><span className="text-white text-sm font-medium">Charcoal 900</span></div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-2xl font-serif text-charcoal-900 border-b border-warm-200 pb-2 mb-6">Typography</h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-warm-400 mb-1">Serif (Cormorant Garamond)</p>
              <h1 className="text-5xl font-serif text-forest-800">L&apos;Art de Vivre</h1>
            </div>
            <div>
              <p className="text-sm text-warm-400 mb-1">Sans (DM Sans)</p>
              <p className="text-lg text-charcoal-800 font-sans">Découvrez nos propriétés exclusives à travers l&apos;Algérie.</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-serif text-charcoal-900 border-b border-warm-200 pb-2 mb-6">Buttons</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="gold">Gold</Button>
            <Button variant="primary" isLoading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-2xl font-serif text-charcoal-900 border-b border-warm-200 pb-2 mb-6">Badges</h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="sale">À Vendre</Badge>
            <Badge variant="rent">À Louer</Badge>
            <Badge variant="sold">Vendu</Badge>
            <Badge variant="reserved">Réservé</Badge>
            <Badge variant="featured">Exclusivité</Badge>
            <Badge variant="draft">Brouillon</Badge>
          </div>
        </section>

        {/* Forms */}
        <section>
          <h2 className="text-2xl font-serif text-charcoal-900 border-b border-warm-200 pb-2 mb-6">Form Elements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="Full Name" placeholder="Jean Dupont" />
            <Input label="Email Address" placeholder="jean@example.com" error="Invalid email format" />
            <Select 
              label="Property Type" 
              options={[{ value: 'villa', label: 'Villa' }, { value: 'apartment', label: 'Appartement' }]} 
            />
            <div className="sm:col-span-2">
              <Textarea label="Description" placeholder="Enter property details..." />
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-serif text-charcoal-900 border-b border-warm-200 pb-2 mb-6">Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-serif text-forest-800 mb-2">Standard Card</h3>
              <p className="text-charcoal-800">This is a default card with a subtle shadow and warm border.</p>
            </Card>
            <Card variant="glass" className="p-6 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-gold-300 rounded-full blur-2xl opacity-50" />
              <h3 className="text-xl font-serif text-forest-800 mb-2 relative z-10">Glass Card</h3>
              <p className="text-charcoal-800 relative z-10">Used over images or busy backgrounds.</p>
            </Card>
          </div>
        </section>

        {/* Overlays */}
        <section>
          <h2 className="text-2xl font-serif text-charcoal-900 border-b border-warm-200 pb-2 mb-6">Overlays & Feedback</h2>
          <div className="flex flex-wrap gap-4 items-center mb-8">
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            <Button onClick={() => setIsDrawerOpen(true)} variant="secondary">Open Drawer</Button>
            <Spinner />
          </div>

          <h3 className="text-lg font-medium text-charcoal-900 mb-4">Skeletons</h3>
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center gap-4">
              <Skeleton variant="avatar" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="title" />
                <Skeleton variant="text" />
              </div>
            </div>
            <Skeleton variant="card" />
          </div>
        </section>

      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Contact Agent">
        <div className="space-y-4">
          <p className="text-charcoal-800">Please fill out the form below to contact our luxury agent.</p>
          <Input label="Your Name" />
          <Button className="w-full">Send Message</Button>
        </div>
      </Modal>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Filters" side="right">
        <div className="space-y-6">
          <Select label="Location" options={[{ value: 'alger', label: 'Alger' }]} />
          <Select label="Price Range" options={[{ value: 'high', label: 'High' }]} />
          <Button className="w-full mt-4">Apply Filters</Button>
        </div>
      </Drawer>

    </div>
  );
}
