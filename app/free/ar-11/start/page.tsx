"use client";

import React, { useState } from 'react';
import {
  Gift, Clock, Shield, CircleAlert, FileText,
  CircleCheckBig, ArrowRight, Lock, BadgeCheck, Scale, ArrowLeft, Download, PenLine
} from 'lucide-react';
import jsPDF from 'jspdf';

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
  "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

const selectClass =
  "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

function AddressBlock({ prefix, streetPlaceholder, cityPlaceholder }: { prefix: string; streetPlaceholder: string; cityPlaceholder: string }) {
  const [unitType, setUnitType] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">Street Number and Name *</label>
        <input name={`${prefix}_street`} className={inputClass} placeholder={streetPlaceholder} required />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-6">
          <label className="text-sm font-semibold text-gray-700">Unit Type</label>
          <div className="flex gap-4">
            {["Apt.", "Ste.", "Flr."].map((t) => (
              <label key={t} className="flex items-center space-x-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  value={t}
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
            <input name={`${prefix}_unit_number`} className={inputClass} placeholder="4B" disabled={!unitType} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">City or Town *</label>
          <input name={`${prefix}_city`} className={inputClass} placeholder={cityPlaceholder} required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">State</label>
          <select name={`${prefix}_state`} className={selectClass}>
            <option value="">Select state</option>
            {US_STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">ZIP Code</label>
          <input name={`${prefix}_zip`} className={inputClass} placeholder="10001" />
        </div>
      </div>
    </div>
  );
}

export default function AR11Page() {
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState<'form' | 'review'>('form');
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(data.entries());
    setFormData(formValues);
    setStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF({ format: 'letter', unit: 'mm' });
    const pw = 215.9; // letter width
    const ph = 279.4; // letter height
    const m = 13.5; // margin
    
    let y = m + 5;
    
    // Header
    // Load Seal Image asynchronously
    const sealData = await new Promise<string | null>((resolve) => {
      const img = new window.Image();
      img.src = '/dhs_seal.png';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
    });

    if (sealData) {
      doc.addImage(sealData, 'PNG', m + 5, y - 2, 20, 20);
    } else {
      // Fallback
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.circle(m + 15, y + 8, 10, 'S');
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.text("DHS SEAL", m + 15, y + 9, { align: "center" });
    }

    // Title
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text("Alien's Change of Address Card", pw / 2, y + 4, { align: "center" });
    
    doc.setFontSize(11);
    doc.text("Department of Homeland Security", pw / 2, y + 11, { align: "center" });
    doc.setFont("times", "normal");
    doc.text("U.S. Citizenship and Immigration Services", pw / 2, y + 15.5, { align: "center" });
    
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text("USCIS", pw - m, y + 11, { align: "right" });
    doc.text("Form AR-11", pw - m, y + 15.5, { align: "right" });
    
    y += 18;
    doc.setLineWidth(2.0); // Thick line
    doc.line(m, y, pw - m, y);
    doc.setLineWidth(0.4); // Thin line
    doc.line(m, y + 1.2, pw - m, y + 1.2); 
    y += 6;
    
    doc.setFont("times", "bold");
    doc.setFontSize(9);
    doc.text("NOTE: An asterisk (*) indicates a mandatory field that must be completed.", m, y);
    y += 4;
    
    // Helper functions
    const drawSection = (title: string, currentY: number) => {
      doc.setFillColor(230, 230, 230);
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.rect(m, currentY, pw - 2 * m, 5.5, 'DF'); // Shorter height
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.text(title, m + 1.5, currentY + 4);
      return currentY + 9;
    };
    
    const drawField = (label: string, value: string, x: number, currentY: number, width: number, height: number = 5.5) => {
      doc.setFont("times", "normal");
      doc.setFontSize(8.5);
      doc.text(label, x, currentY);
      
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.rect(x, currentY + 1.2, width, height, 'S');
      
      if (value) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const splitValue = doc.splitTextToSize(value, width - 2);
        doc.text(splitValue, x + 1.5, currentY + 5);
      }
    };
    
    const drawCheckboxes = (label: string, options: string[], selectedValue: string, x: number, currentY: number) => {
      doc.setFont("times", "normal");
      doc.setFontSize(8.5);
      // Special formatting for Apt. Ste. Flr.
      if (label === "Apt. Ste. Flr.") {
        doc.text("Apt.", x, currentY);
        doc.text("Ste.", x + 6.5, currentY);
        doc.text("Flr.", x + 13, currentY);
        let currX = x;
        options.forEach((opt, idx) => {
          doc.setDrawColor(0);
          doc.setLineWidth(0.3);
          doc.rect(currX + (idx*0.5), currentY + 1.2, 4, 4, 'S');
          if (selectedValue === opt) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text("X", currX + 1 + (idx*0.5), currentY + 4.5);
          }
          currX += 6;
        });
      } else {
         doc.text(label, x, currentY);
      }
    };
    
    const drawLink = (text: string, x: number, currentY: number) => {
      doc.setFont("times", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(0, 0, 255);
      doc.text(text, x, currentY);
      const textWidth = doc.getTextWidth(text);
      doc.setDrawColor(0, 0, 255);
      doc.setLineWidth(0.1);
      doc.line(x, currentY + 0.5, x + textWidth, currentY + 0.5);
      doc.setTextColor(0, 0, 0); // reset
    };
    
    // --- Information About You ---
    y = drawSection("Information About You", y);
    
    drawField("*Family Name (Last Name)", formData.familyName || "", m, y, 73);
    drawField("*Given Name (First Name)", formData.givenName || "", m + 74, y, 60);
    drawField("Middle Name (if applicable)", formData.middleName || "", m + 135, y, pw - 2*m - 135);
    
    y += 10.5;
    
    drawField("*Date of Birth (mm/dd/yyyy)", formData.dob || "", m, y, 45);
    
    doc.setFont("times", "normal");
    doc.setFontSize(8.5);
    doc.text("Alien Registration Number (A-Number) (if any)", m + 47, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("► A-", m + 47, y + 5);
    // Draw 9 individual boxes for A-Number
    let aNumX = m + 55;
    const aNumStr = formData.aNumber ? formData.aNumber.padEnd(9, ' ') : "         ";
    for(let i=0; i<9; i++) {
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.rect(aNumX, y + 1.2, 5.5, 5.5, 'S');
      if (aNumStr[i] && aNumStr[i] !== ' ') {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(aNumStr[i], aNumX + 1.5, y + 5);
      }
      aNumX += 5.5;
    }
    
    y += 11;
    
    // --- Information About Your Address ---
    y = drawSection("Information About Your Address", y);
    
    doc.setFont("times", "bold");
    doc.setFontSize(9);
    doc.text("*Present Physical Address (No PO Boxes)", m, y);
    y += 5.5;
    
    drawField("*Street Number and Name", formData.pres_street || "", m, y, 122);
    drawCheckboxes("Apt. Ste. Flr.", ["Apt.", "Ste.", "Flr."], formData.pres_unit_type || "", m + 124, y);
    drawField("Number", formData.pres_unit_number || "", m + 145, y, pw - 2*m - 145);
    
    y += 10.5;
    
    drawField("*City or Town", formData.pres_city || "", m, y, 122);
    drawField("*State", formData.pres_state || "", m + 124, y, 19);
    drawField("*ZIP Code", formData.pres_zip || "", m + 145, y, pw - 2*m - 145);
    
    y += 9.5;
    drawLink("(USPS ZIP Code Lookup)", pw - m - 40, y);
    
    y += 4;
    
    doc.setFont("times", "bold");
    doc.setFontSize(9);
    doc.text("Previous Physical Address", m, y);
    y += 5.5;
    
    drawField("Street Number and Name", formData.prev_street || "", m, y, 122);
    drawCheckboxes("Apt. Ste. Flr.", ["Apt.", "Ste.", "Flr."], formData.prev_unit_type || "", m + 124, y);
    drawField("Number", formData.prev_unit_number || "", m + 145, y, pw - 2*m - 145);
    
    y += 10.5;
    
    drawField("City or Town", formData.prev_city || "", m, y, 122);
    drawField("State", formData.prev_state || "", m + 124, y, 19);
    drawField("ZIP Code", formData.prev_zip || "", m + 145, y, pw - 2*m - 145);
    
    y += 9.5;
    
    y += 4;
    
    doc.setFont("times", "bold");
    doc.setFontSize(9);
    doc.text("Mailing Address (optional)", m, y);
    y += 5.5;
    
    drawField("Street Number and Name", formData.mail_street || "", m, y, 122);
    drawCheckboxes("Apt. Ste. Flr.", ["Apt.", "Ste.", "Flr."], formData.mail_unit_type || "", m + 124, y);
    drawField("Number", formData.mail_unit_number || "", m + 145, y, pw - 2*m - 145);
    
    y += 10.5;
    
    drawField("City or Town", formData.mail_city || "", m, y, 122);
    drawField("State", formData.mail_state || "", m + 124, y, 19);
    drawField("ZIP Code", formData.mail_zip || "", m + 145, y, pw - 2*m - 145);
    
    y += 9.5;
    drawLink("(USPS ZIP Code Lookup)", pw - m - 40, y);
    
    y += 4;
    
    // --- Your Signature ---
    y = drawSection("Your Signature", y);
    
    const fullName = [formData.givenName, formData.middleName, formData.familyName].filter(Boolean).join(" ");
    drawField("*Your Signature", agreed ? `${fullName} (Digitally Signed)` : "", m, y, 145);
    const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    drawField("Date of Signature (mm/dd/yyyy)", today, m + 147, y, pw - 2*m - 147);
    
    y += 18;
    
    // Footer Page 1
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(m, ph - m - 5, pw - m, ph - m - 5);
    doc.setFont("times", "normal");
    doc.setFontSize(8);
    doc.text("Form AR-11   Edition 11/02/22", m, ph - m);
    doc.text("Page 1 of 2", pw - m, ph - m, { align: "right" });

    // --- PAGE 2 ---
    doc.addPage();
    y = m + 5;

    // Double line header
    doc.setLineWidth(1.5);
    doc.line(m, y, pw - m, y);
    doc.setLineWidth(0.3);
    doc.line(m, y + 1, pw - m, y + 1); 
    y += 5;

    y = drawSection("Address Change Information and Instructions", y);

    doc.setFont("times", "normal");
    doc.setFontSize(9);
    const instructions = "All aliens subject to registration requirements may use this form to report a change of address within 10 days of such change. For detailed instructions on how to update your address, please visit www.uscis.gov/addresschange. The collection of this information is required by Immigration and Nationality Act (INA) section 265 (8 U.S.C. 1305). U.S. Citizenship and Immigration Services (USCIS) uses the data collected on this form for statistical and record-keeping purposes, and may share this information with other Federal, state, local, and law enforcement officials. Failure to report a change of address is punishable by fine or imprisonment and/or removal from the United States.";
    const splitInst = doc.splitTextToSize(instructions, pw - 2 * m);
    doc.text(splitInst, m, y);

    y += 28;

    doc.setFont("times", "bold");
    doc.setFontSize(9);
    doc.text("NOTE: This form is not evidence of identity, age, or status claimed.", m, y);
    y += 5;

    const imp = "IMPORTANT: If you are in immigration proceedings, you must separately notify the Immigration Court of any address changes. Filing Form AR-11 with USCIS does not update your address with the Immigration Court.";
    const splitImp = doc.splitTextToSize(imp, pw - 2 * m);
    doc.text(splitImp, m, y);

    y += 12;

    y = drawSection("Instructions", y);
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.text("Complete all fields on this form, sign and date the form, and mail it to:", m, y);

    y += 5;

    // Draw address box
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    const boxW = 60;
    const boxX = (pw - boxW) / 2;
    doc.rect(boxX, y, boxW, 20, 'S');

    doc.setFont("times", "bold");
    doc.text("U.S. Department of Homeland Security", pw/2, y + 5, { align: "center" });
    doc.text("Citizenship and Immigration Services", pw/2, y + 9, { align: "center" });
    doc.text("Attn: Change of Address", pw/2, y + 13, { align: "center" });
    doc.text("1344 Pleasants Drive", pw/2, y + 17, { align: "center" });
    doc.text("Harrisonburg, VA 22801", pw/2, y + 21, { align: "center" }); 

    y += 26;

    y = drawSection("DHS Privacy Notice", y);
    doc.setFont("times", "bold");
    doc.text("AUTHORITIES:", m, y);
    doc.setFont("times", "normal");
    const authText = "The information requested on this form is collected under the Immigration and Nationality Act (INA) section 265.";
    doc.text(doc.splitTextToSize(authText, pw - 2*m - 25), m + 25, y);
    y += 6;

    doc.setFont("times", "bold");
    doc.text("PURPOSE:", m, y);
    doc.setFont("times", "normal");
    const purText = "The primary purpose for providing the requested information on this form is to report a change of address. Except for those exempted, all aliens in the U.S. are required to report any change of address or new address. DHS uses the information you provide to contact you about the immigration benefit you are seeking.";
    doc.text(doc.splitTextToSize(purText, pw - 2*m - 18), m + 18, y);
    y += 14;

    doc.setFont("times", "bold");
    doc.text("DISCLOSURE:", m, y);
    doc.setFont("times", "normal");
    const disText = "The information you provide is mandatory. Failure to report a change of address may result in a fine, imprisonment and/or removal (8 U.S.C. sections 1227(a)(3) and 1306). Failure to comply could also jeopardize your ability to obtain a future visa or other immigration benefits.";
    doc.text(doc.splitTextToSize(disText, pw - 2*m - 23), m + 23, y);
    y += 14;

    doc.setFont("times", "bold");
    doc.text("ROUTINE USES:", m, y);
    doc.setFont("times", "normal");
    const routineText = "DHS may share the information you provide on this form with other Federal, state, local, and foreign government agencies and authorized organizations. DHS follows approved routine uses described in the associated published system of records notices [DHS/USCIS-001 - Alien File, Index, and National File Tracking System and DHS/USCIS-007 - Benefits Information System] and the published privacy impact assessments [DHS/USCIS/PIA-018 Alien Change of Address Card (AR-11)] which you can find at www.dhs.gov/privacy. DHS may also share this information, as appropriate, for law enforcement purposes or in the interest of national security.";
    doc.text(doc.splitTextToSize(routineText, pw - 2*m - 27), m + 27, y);

    // Footer Page 2
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(m, ph - m - 5, pw - m, ph - m - 5);
    doc.setFont("times", "normal");
    doc.setFontSize(8);
    doc.text("Form AR-11   Edition 11/02/22", m, ph - m);
    doc.text("Page 2 of 2", pw - m, ph - m, { align: "right" });
    
    doc.save('AR-11-Form.pdf');
  };

  return (
    <main className="flex-grow bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12">

        {step === 'form' && (
          <>
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
                  Icon: Clock, title: "5-10 Minutes",
                  desc: "Quick and easy form completion",
                  gradient: "from-blue-500/10 via-background to-cyan-500/10",
                  iconGradient: "from-blue-500/20 to-cyan-500/20",
                  hoverOverlay: "from-blue-500/20 to-cyan-500/20",
                  textColor: "text-blue-500", delay: 0,
                },
                {
                  Icon: Download, title: "Instant PDF",
                  desc: "Get your filled AR-11 immediately",
                  gradient: "from-orange-500/10 via-background to-amber-500/10",
                  iconGradient: "from-orange-500/20 to-amber-500/20",
                  hoverOverlay: "from-orange-500/20 to-amber-500/20",
                  textColor: "text-orange-500", delay: 100,
                },
                {
                  Icon: Shield, title: "100% Free",
                  desc: "No hidden fees or charges",
                  gradient: "from-green-500/10 via-background to-emerald-500/10",
                  iconGradient: "from-green-500/20 to-emerald-500/20",
                  hoverOverlay: "from-green-500/20 to-emerald-500/20",
                  textColor: "text-green-500", delay: 200,
                },
              ].map(({ Icon, title, desc, gradient, iconGradient, hoverOverlay, textColor, delay }) => (
                <div
                  key={title}
                  className={`rounded-lg bg-card text-card-foreground relative overflow-hidden border-0 bg-gradient-to-br ${gradient} shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:scale-[1.02] animate-fade-in`}
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
            <div className="rounded-lg bg-card text-card-foreground mb-12 relative overflow-hidden border-0 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-background shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
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
                    <li key={item} className="flex items-start gap-3 p-3 rounded-lg bg-red-50">
                      <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      <span className="text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── What You'll Receive ── */}
            <div className="rounded-lg bg-card text-card-foreground mb-12 border-0 bg-gradient-to-br from-background via-background to-muted/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
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
            <div className="rounded-lg bg-card text-card-foreground mb-12 relative overflow-hidden border-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
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

              <form className="space-y-6" onSubmit={handleFormSubmit}>

                {/* ── Information About You ── */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-slate-100/80">
                    <div>
                      <h3 className="text-base font-bold text-[#1B3A64]">Information About You</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Provide your personal details as they appear on your immigration documents.</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    {/* Family Name | Given Name | Middle Name */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Family Name (Last Name) *</label>
                        <input name="familyName" className={inputClass} required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Given Name (First Name) *</label>
                        <input name="givenName" className={inputClass} required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Middle Name (if applicable)</label>
                        <input name="middleName" className={inputClass} />
                      </div>
                    </div>
                    {/* A-Number | Date of Birth */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Alien Registration Number (A-Number) (if any)</label>
                        <input name="aNumber" placeholder="A-" className={inputClass} />
                        <p className="text-xs text-gray-400">Your Alien Registration Number (9 digits, starting with A)</p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Date of Birth *</label>
                        <input type="date" name="dob" className={inputClass} required />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Present Physical Address ── */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-slate-100/80">
                    <div>
                      <h3 className="text-base font-bold text-[#1B3A64]">Present Physical Address (New Address)</h3>
                      <p className="text-xs text-gray-500 mt-0.5">No PO Boxes. Enter your current address after the change.</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <AddressBlock prefix="pres" streetPlaceholder="456 Oak Avenue" cityPlaceholder="Los Angeles" />
                  </div>
                </div>

                {/* ── Mailing Address ── */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-slate-100/80">
                    <div>
                      <h3 className="text-base font-bold text-[#1B3A64]">Mailing Address (Optional)</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Where USCIS should send your correspondence. Leave blank if same as present address.</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <AddressBlock prefix="mail" streetPlaceholder="123 Main Street" cityPlaceholder="New York" />
                  </div>
                </div>

                {/* ── Previous Physical Address ── */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-slate-100/80">
                    <div>
                      <h3 className="text-base font-bold text-[#1B3A64]">Previous Physical Address</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Enter your address before the change.</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <AddressBlock prefix="prev" streetPlaceholder="123 Main Street" cityPlaceholder="New York" />
                  </div>
                </div>

                {/* ── Signature & Attestation ── */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-100/80">
                    <h3 className="text-base font-bold text-[#1B3A64]">Signature &amp; Attestation</h3>
                  </div>
                  <div className="p-6 space-y-5">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-[#1B3A64] rounded border-gray-300"
                        required
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
                      type="submit"
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
          </>
        )}

        {/* ── Review Step ── */}
        {step === 'review' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <button
              onClick={() => setStep('form')}
              className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Edit Form
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Review Your Information</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Please double-check your details before generating your AR-11 PDF.
              </p>
            </div>

            {/* Review: Information About You */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-base font-bold text-[#1B3A64]">Information About You</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div><span className="text-sm text-gray-500 block">Family Name (Last)</span><span className="font-medium">{formData.familyName || '-'}</span></div>
                <div><span className="text-sm text-gray-500 block">Given Name (First)</span><span className="font-medium">{formData.givenName || '-'}</span></div>
                <div><span className="text-sm text-gray-500 block">Middle Name</span><span className="font-medium">{formData.middleName || '-'}</span></div>
                <div><span className="text-sm text-gray-500 block">A-Number</span><span className="font-medium">{formData.aNumber || '-'}</span></div>
                <div><span className="text-sm text-gray-500 block">Date of Birth</span><span className="font-medium">{formData.dob || '-'}</span></div>
              </div>
            </div>

            {/* Review: Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "Present Physical Address", prefix: "pres" },
                { label: "Mailing Address", prefix: "mail" },
                { label: "Previous Physical Address", prefix: "prev" },
              ].map(({ label, prefix }) => (
                <div key={prefix} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-base font-bold text-[#1B3A64]">{label}</h3>
                  </div>
                  <div className="p-6 space-y-1">
                    <p className="font-medium">{formData[`${prefix}_street`] || '-'}</p>
                    {formData[`${prefix}_unit_type`] && (
                      <p className="font-medium">{formData[`${prefix}_unit_type`]} {formData[`${prefix}_unit_number`]}</p>
                    )}
                    <p className="font-medium">
                      {[formData[`${prefix}_city`], formData[`${prefix}_state`], formData[`${prefix}_zip`]].filter(Boolean).join(', ') || '-'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => setStep('form')}
                className="inline-flex items-center justify-center rounded-xl border-2 border-gray-300 bg-white text-gray-700 h-12 px-8 text-base font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                <PenLine className="w-4 h-4 mr-2" />
                Edit Form
              </button>
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-12 px-10 text-base font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30"
              >
                <Download className="w-5 h-5 mr-3" />
                Download PDF
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
