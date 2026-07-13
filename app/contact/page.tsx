import React from 'react';
import ContactHero from '@/components/ContactHero';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <main className="flex flex-col w-full bg-[#FDFBF9]">
      <ContactHero />
      <ContactForm />
    </main>
  );
}
