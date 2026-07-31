"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Gift, Clock, Download, Shield, CircleAlert, FileText,
  CircleCheckBig, ArrowRight, User, Phone, MapPin, Mail, Lock, BadgeCheck, Scale
} from 'lucide-react';

const US_STATES = [
  { value: "AL", label: "Alabama" }, { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" }, { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" }, { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" }, { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" }, { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" }, { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" }, { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" }, { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" }, { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" }, { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" }, { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" }, { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" }, { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" }, { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" }, { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" }, { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" }, { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" }, { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" }, { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" }, { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" }, { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" }, { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" }, { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" }, { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" }, { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" }, { value: "AS", label: "American Samoa" },
  { value: "GU", label: "Guam" }, { value: "MP", label: "Northern Mariana Islands" },
  { value: "PR", label: "Puerto Rico" }, { value: "VI", label: "U.S. Virgin Islands" },
];

const inputClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

function AddressBlock({ prefix, streetPlaceholder, cityPlaceholder }: { prefix: string; streetPlaceholder: string; cityPlaceholder: string }) {
  const [unitType, setUnitType] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">Street Number and Name *</label>
        <input className={inputClass} placeholder={streetPlaceholder} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-6">
          <label className="text-sm font-semibold text-gray-700">Unit Type</label>
          <div className="flex gap-4">
            {["Apt.", "Ste.", "Flr."].map((t) => (
              <label key={t} className="flex items-center space-x-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name={`${prefix}_unit_type`}
                  className="accent-[#1B3A64]"
                  onChange={() => setUnitType(t)}
                />
                <span className="text-gray-600">{t}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Unit Number</label>
            <input className={inputClass} placeholder="4B" disabled={!unitType} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">City or Town *</label>
          <input className={inputClass} placeholder={cityPlaceholder} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">State</label>
          <select className={selectClass}>
            <option value="">Select state</option>
            {US_STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">ZIP Code</label>
          <input className={inputClass} placeholder="10001" />
        </div>
      </div>
    </div>
  );
}

export default function AR11Page() {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [receiptNumbers, setReceiptNumbers] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);

  const addReceiptNumber = () => {
    if (receiptNumber.trim()) {
      setReceiptNumbers([...receiptNumbers, receiptNumber.trim()]);
      setReceiptNumber('');
    }
  };

  return (
    <main className="flex-grow bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12">

        {/* ── Hero ── */}
        <div className="text-center space-y-6 mb-12 animate-fade-in">
          <div className="flex justify-center">
            <div className="inline-flex items-center rounded-full border font-semibold bg-secondary text-secondary-foreground mb-4 px-6 py-2 text-base bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-orange-500/20 hover:scale-105 transition-transform">
              <Gift className="w-5 h-5 mr-2 text-orange-500" />
              Free Immigration Tool
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
            AR-11 Change of Address
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Notify USCIS of your address change with an official AR-11 form. Required by law for all immigrants.
          </p>
        </div>

        {/* ── Feature cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              Icon: Clock, color: "blue", title: "5-10 Minutes",
              desc: "Quick and easy form completion",
              gradient: "from-blue-500/10 via-background to-cyan-500/10",
              iconGradient: "from-blue-500/20 to-cyan-500/20",
              hoverOverlay: "from-blue-500/20 to-cyan-500/20",
              textColor: "text-blue-500",
              delay: 0,
            },
            {
              Icon: Download, color: "orange", title: "Instant PDF",
              desc: "Get your filled AR-11 immediately",
              gradient: "from-orange-500/10 via-background to-amber-500/10",
              iconGradient: "from-orange-500/20 to-amber-500/20",
              hoverOverlay: "from-orange-500/20 to-amber-500/20",
              textColor: "text-orange-500",
              delay: 100,
            },
            {
              Icon: Shield, color: "green", title: "100% Free",
              desc: "No hidden fees or charges",
              gradient: "from-green-500/10 via-background to-emerald-500/10",
              iconGradient: "from-green-500/20 to-emerald-500/20",
              hoverOverlay: "from-green-500/20 to-emerald-500/20",
              textColor: "text-green-500",
              delay: 200,
            },
          ].map(({ Icon, title, desc, gradient, iconGradient, hoverOverlay, textColor, delay }) => (
            <div
              key={title}
              className={`rounded-lg bg-card text-card-foreground relative overflow-hidden border-0 bg-gradient-to-br ${gradient} shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:scale-[1.02] animate-fade-in`}
              style={{ animationDelay: `${delay}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${hoverOverlay} opacity-0 hover:opacity-100 transition-opacity duration-300`} />
              <div className="flex flex-col space-y-1.5 p-6 relative text-center pb-4">
                <div className={`mx-auto w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${iconGradient} backdrop-blur-sm flex items-center justify-center`}>
                  <Icon className={`w-8 h-8 ${textColor}`} />
                </div>
                <h3 className="font-semibold tracking-tight text-2xl">{title}</h3>
              </div>
              <div className="p-6 pt-0 relative text-center">
                <p className="text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Legal Warning ── */}
        <div className="rounded-lg bg-card text-card-foreground mb-12 relative overflow-hidden border-0 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-background shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="flex flex-col space-y-1.5 p-6 relative">
            <h3 className="font-semibold tracking-tight flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-xl bg-orange-500/20">
                <CircleAlert className="w-6 h-6 text-orange-500" />
              </div>
              Important Legal Requirement
            </h3>
          </div>
          <div className="p-6 pt-0 relative">
            <p className="mb-6 text-base leading-relaxed">
              All immigrants (including permanent residents) must notify USCIS of any address change within 10 days of moving. Failure to do so may result in:
            </p>
            <ul className="space-y-3">
              {["Missed important USCIS notices", "Delays in case processing", "Potential immigration consequences"].map((item) => (
                <li key={item} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5">
                  <span className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                  <span className="text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── What You'll Receive ── */}
        <div className="rounded-lg bg-card text-card-foreground mb-12 border-0 bg-gradient-to-br from-background via-background to-muted/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold tracking-tight flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-xl bg-primary/20">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              What You&apos;ll Receive
            </h3>
            <p className="text-muted-foreground text-base mt-2">Everything you need to complete your address change notification</p>
          </div>
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                ["Pre-filled AR-11 PDF", "Official USCIS form with your information already filled in"],
                ["Filing Instructions", "Step-by-step guide on how to submit your form"],
                ["Mailing Addresses", "Correct USCIS addresses for your location"],
                ["Record Keeping Tips", "How to maintain proof of your notification"],
              ].map(([title, desc]) => (
                <div key={title} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-background to-muted/30 hover:shadow-md transition-all duration-200">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <CircleCheckBig className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-lg">{title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── What to Expect ── */}
        <div className="rounded-lg bg-card text-card-foreground mb-12 relative overflow-hidden border-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          <div className="absolute top-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="flex flex-col space-y-1.5 p-6 relative">
            <h3 className="font-semibold tracking-tight flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-xl bg-primary/20">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              What to Expect
            </h3>
          </div>
          <div className="p-6 pt-0 relative">
            <div className="space-y-6">
              {[
                ["Fill in your information", "Complete the form with your details"],
                ["Review your information", "Double-check all details before downloading"],
                ["Download your PDF", "Instant download with filing instructions (optional: sign in to save progress)"],
              ].map(([title, desc], i) => (
                <div key={i} className="flex items-start gap-6 p-6 rounded-2xl bg-gradient-to-r from-background to-muted/40 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-lg">
                    {i + 1}
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">{title}</p>
                    <p className="text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── The Form ── */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground mb-2">
              <FileText className="w-4 h-4 mr-2" />
              Free Immigration Tool
            </div>
            <h2 className="text-3xl font-bold">AR-11 Change of Address</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Required for all immigrants when changing address. Complete this form to notify USCIS of your new address.
            </p>
          </div>

          <form className="space-y-6">
            {/* Personal Information */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1B3A64]">Personal Information</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Provide your personal details as they appear on your immigration documents.</p>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[["First Name *", "firstName"], ["Middle Name", "middleName"], ["Last Name *", "lastName"]].map(([label, name]) => (
                    <div key={name} className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">{label}</label>
                      <input name={name} className={inputClass} />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">A-Number (if available)</label>
                    <input name="aNumber" placeholder="A-" className={inputClass} />
                    <p className="text-xs text-gray-400">Your Alien Registration Number (9 digits, starting with A)</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Date of Birth *</label>
                    <input type="date" className={inputClass} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Country of Birth *</label>
                  <input name="countryOfBirth" placeholder="United States" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-[#1B3A64]">Contact Information</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                    <input type="email" name="email" placeholder="john@example.com" className={inputClass} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
                    <input type="tel" name="phone" placeholder="(555) 123-4567" className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* Previous Address */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1B3A64]">Previous Address</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Enter your address before the change.</p>
                </div>
              </div>
              <div className="p-6">
                <AddressBlock prefix="prev" streetPlaceholder="123 Main Street" cityPlaceholder="New York" />
              </div>
            </div>

            {/* Present Address */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1B3A64]">Present Address (New Address)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Enter your current address after the change.</p>
                </div>
              </div>
              <div className="p-6">
                <AddressBlock prefix="pres" streetPlaceholder="456 Oak Avenue" cityPlaceholder="Los Angeles" />
              </div>
            </div>

            {/* Mailing Address */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1B3A64]">Mailing Address (Optional)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Where USCIS should send your correspondence. Leave blank if same as present address.</p>
                </div>
              </div>
              <div className="p-6">
                <AddressBlock prefix="mail" streetPlaceholder="123 Main Street" cityPlaceholder="New York" />
              </div>
            </div>

            {/* Pending USCIS Cases */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1B3A64]">Pending USCIS Cases (Optional)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">If you have pending applications with USCIS, include their receipt numbers.</p>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    placeholder="MSC1234567890"
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={addReceiptNumber}
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 h-10 text-sm font-semibold text-[#1B3A64] hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    + Add Receipt Number
                  </button>
                </div>
                {receiptNumbers.length > 0 && (
                  <ul className="space-y-1">
                    {receiptNumbers.map((r, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm p-2 rounded-md bg-gray-50">
                        <CircleCheckBig className="w-4 h-4 text-blue-600" /> {r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Signature & Attestation */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-base font-bold text-[#1B3A64]">Signature &amp; Attestation</h3>
              </div>
              <div className="p-6 space-y-5">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#1B3A64] rounded border-gray-300"
                  />
                  <div>
                    <span className="block font-semibold text-sm text-[#1B3A64] mb-1">I certify that the information provided is true and correct *</span>
                    <span className="block text-xs text-gray-500 leading-relaxed">
                      By checking this box, you are electronically signing this form and attesting to the accuracy of all information provided.
                    </span>
                  </div>
                </label>

                <p className="text-sm text-gray-500">
                  Date: {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                </p>

                <button
                  type="button"
                  disabled={!agreed}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white h-12 px-6 text-base font-bold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-500/20"
                >
                  Continue to Review
                </button>

                <p className="text-xs text-center text-gray-400 leading-relaxed">
                  By submitting this form, you agree to our{' '}
                  <span className="underline cursor-pointer">Terms of Service</span> and{' '}
                  <span className="underline cursor-pointer">Privacy Policy</span>. We protect your personal information and only use it to process your AR-11 form.
                </p>

                <div className="flex flex-wrap justify-center items-center gap-6 pt-5 border-t border-gray-100">
                  {[
                    [Lock, "text-green-600", "SSL Encrypted"],
                    [BadgeCheck, "text-blue-600", "USCIS Compliant"],
                    [Scale, "text-purple-600", "Attorney Reviewed"],
                  ].map(([Icon, color, label]) => (
                    <div key={label as string} className="flex items-center text-gray-500 text-sm font-medium gap-1.5">
                      {React.createElement(Icon as React.ElementType, { className: `w-4 h-4 ${color}` })}
                      {label as string}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
