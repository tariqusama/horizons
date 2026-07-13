import React from 'react';
import ServicesHero from '@/components/ServicesHero';
import ServicesCategory from '@/components/ServicesCategory';
import ServicesCTA from '@/components/ServicesCTA';

export default function ServicesPage() {
  const adjustmentOfStatusCards = [
    {
      title: "Marriage Green Card inside the U.S. – Concurrent Filing",
      subtitle: "I-130 and I-485 concurrent filing for marriage-based green card",
      startingPrice: "$629.99",
      isPopular: true,
      packages: [
        { name: "Basic Package", price: "$629.99" },
        { name: "Advanced Package", price: "$949.99" },
        { name: "Premium Package", price: "$1249.99" }
      ],
      processingTime: "12-18 months",
      requirements: [
        "Married to U.S. citizen or permanent resident",
        "Lawful entry to the United States",
        "No disqualifying criminal history"
      ]
    },
    {
      title: "Parent Adjustment of Status inside the U.S. – Concurrent Filing",
      subtitle: "I-130 and I-485 concurrent filing for parent adjustment",
      startingPrice: "$599.99",
      packages: [
        { name: "Basic Package", price: "$599.99" },
        { name: "Advanced Package", price: "$949.99" },
        { name: "Premium Package", price: "$1249.99" }
      ],
      processingTime: "10-16 months",
      requirements: [
        "Valid parent-child relationship",
        "Currently in the United States",
        "Financial sponsorship available"
      ]
    },
    {
      title: "Child Adjustment of Status inside the U.S. – Concurrent Filing",
      subtitle: "I-130 and I-485 concurrent filing for child adjustment",
      startingPrice: "$599.99",
      packages: [
        { name: "Basic Package", price: "$599.99" },
        { name: "Advanced Package", price: "$949.99" },
        { name: "Premium Package", price: "$1249.99" }
      ],
      processingTime: "10-16 months",
      requirements: [
        "Valid parent-child relationship",
        "Currently in the United States",
        "Financial sponsorship available"
      ]
    }
  ];

  const familyPetitionsCards = [
    {
      title: "Petition for a Spouse outside the U.S. – USCIS Petition only",
      subtitle: "I-130 petition for spouse outside the United States",
      startingPrice: "$549.99",
      packages: [
        { name: "Basic Package", price: "$549.99" },
        { name: "Advanced Package", price: "$789.99" },
        { name: "Premium Package", price: "$999.99" }
      ],
      processingTime: "12-33 months",
      requirements: [
        "Legal marriage to U.S. citizen/resident",
        "Marriage validity in place of occurrence",
        "Financial sponsorship capability"
      ]
    },
    {
      title: "Petition for a Child outside the U.S. – USCIS Petition only",
      subtitle: "I-130 petition for child outside the United States",
      startingPrice: "$549.99",
      packages: [
        { name: "Basic Package", price: "$549.99" },
        { name: "Advanced Package", price: "$789.99" },
        { name: "Premium Package", price: "$999.99" }
      ],
      processingTime: "12-20 months",
      requirements: [
        "Valid parent-child relationship",
        "Currently outside United States",
        "No criminal or immigration bars"
      ]
    },
    {
      title: "Petition for a Parent outside the U.S. – USCIS Petition only",
      subtitle: "I-130 petition for parent outside the United States",
      startingPrice: "$549.99",
      packages: [
        { name: "Basic Package", price: "$549.99" },
        { name: "Advanced Package", price: "$789.99" },
        { name: "Premium Package", price: "$999.99" }
      ],
      processingTime: "12-20 months",
      requirements: [
        "Valid parent-child relationship",
        "Currently outside United States",
        "No criminal or immigration bars"
      ]
    }
  ];

  const renewalsCards = [
    {
      title: "Petition to Remove Conditions on Conditional Residence",
      subtitle: "I-751 petition to remove conditions (joint filing)",
      startingPrice: "$399.99",
      packages: [
        { name: "Basic Package", price: "$399.99" },
        { name: "Advanced Package", price: "$499.99" },
        { name: "Premium Package", price: "$699.99" }
      ],
      processingTime: "12-18 months",
      requirements: [
        "Conditional green card holder",
        "Still married to U.S. spouse",
        "Good moral character maintained"
      ]
    },
    {
      title: "Renew or Replace Permanent Resident Card",
      subtitle: "I-90 application to renew or replace green card",
      startingPrice: "$349.99",
      packages: [
        { name: "Basic Package", price: "$349.99" },
        { name: "Advanced Package", price: "$449.99" },
        { name: "Premium Package", price: "$599.99" }
      ],
      processingTime: "8-12 months",
      requirements: [
        "Current permanent resident",
        "Card expiring or lost/damaged",
        "Maintained residence requirements"
      ]
    }
  ];

  const otherServicesCards = [
    {
      title: "DACA Renewal (Deferred Action for Childhood Arrivals)",
      subtitle: "I-821D DACA renewal application",
      startingPrice: "$299.99",
      packages: [
        { name: "Basic Package", price: "$299.99" },
        { name: "Advanced Package", price: "$399.99" },
        { name: "Premium Package", price: "$539.99" }
      ],
      processingTime: "2-4 months",
      requirements: [
        "Current or recent DACA recipient",
        "Continuous U.S. residence",
        "No disqualifying criminal record"
      ]
    },
    {
      title: "Application for U.S. Citizenship",
      subtitle: "N-400 application for naturalization",
      startingPrice: "$349.99",
      packages: [
        { name: "Basic Package", price: "$349.99" },
        { name: "Advanced Package", price: "$449.99" },
        { name: "Premium Package", price: "$649.99" }
      ],
      processingTime: "6-12 months",
      requirements: [
        "Permanent resident 3-5 years",
        "Continuous residence maintained",
        "Basic English proficiency"
      ]
    }
  ];

  return (
    <main className="flex flex-col w-full bg-[#FDFBF9]">
      <ServicesHero />

      {/* Tabs */}
      <div className="w-full flex justify-center py-16 px-4">
        <div className="bg-white p-2 rounded-full inline-flex border border-gray-200/60 shadow-sm w-full max-w-[480px]">
          <button className="bg-[#1B3A64] text-white w-1/2 py-4 rounded-full font-bold text-[16px] shadow-sm transition-all duration-300">
            Browse Services
          </button>
          <button className="text-[#5A6579] hover:text-[#1B3A64] w-1/2 py-4 rounded-full font-bold text-[16px] transition-all duration-300">
            Pricing Plans
          </button>
        </div>
      </div>

      <div className="space-y-16 pb-32">
        <ServicesCategory
          title="Adjustment of Status"
          subtitle="Apply for permanent residence while staying in the United States"
          pillText="Adjustment of Status (Inside U.S.)"
          cards={adjustmentOfStatusCards}
        />

        <ServicesCategory
          title="Family Petitions"
          subtitle="Petition for family members currently living outside the United States"
          pillText="Family Petitions (Outside U.S.)"
          cards={familyPetitionsCards}
        />

        <ServicesCategory
          title="Renewals & Conditions"
          subtitle="Renew or update your existing immigration status"
          pillText="Renewals & Conditions"
          cards={renewalsCards}
        />

        <ServicesCategory
          title="Other Immigration Services"
          subtitle="Additional immigration services including citizenship and DACA"
          pillText="Other Immigration Services"
          cards={otherServicesCards}
        />
      </div>

      <ServicesCTA />
    </main>
  );
}
