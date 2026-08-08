'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const defaultTimelineEstimates: Record<string, string> = {
  marriage: '12-18 months',
  fiance: '8-12 months',
  citizenship: '6-10 months',
};

const defaultCaseTypes = [
  { value: 'marriage', label: 'Marriage Green Card' },
  { value: 'fiance', label: 'K-1 Fiance Visa' },
  { value: 'citizenship', label: 'Citizenship & Naturalization' },
];

const getTimelineEstimate = (goal: string) => {
  const normalized = goal.toLowerCase();
  if (/citizenship|naturalization/.test(normalized)) return '6-10 months';
  if (/fianc|k-1/.test(normalized)) return '8-14 months';
  if (/spouse|marriage|green card|permanent resident/.test(normalized)) return '12-18 months';
  if (/sibling/.test(normalized)) return '10-15+ years';
  if (/parent|child|relative/.test(normalized)) return '12-24 months';
  if (/remove conditions|conditional lpr/.test(normalized)) return '10-14 months';
  if (/daca/.test(normalized)) return '6-10 months';
  if (/asylum|refugee/.test(normalized)) return '10-16 months';
  if (/visa/.test(normalized)) return '8-16 months';
  return 'Varies by case complexity';
};

export default function TimelineSection() {
  const [caseTypes, setCaseTypes] = useState<{ value: string; label: string }[]>(defaultCaseTypes);
  const [selectedType, setSelectedType] = useState('');
  const [calculatedTime, setCalculatedTime] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFetchingTime, setIsFetchingTime] = useState(false);

  useEffect(() => {
    api.get('/public/signup-pathways')
      .then((res) => {
        const goals = Array.isArray(res.data.goals) ? res.data.goals : [];
        if (goals.length > 0) {
          setCaseTypes(goals.map((goal: string) => ({ value: goal, label: goal })));
        }
      })
      .catch((err) => {
        console.error('Failed to load case types for timeline:', err);
      });

  }, []);

  const handleCalculate = async () => {
    if (!selectedType) {
      setErrorMessage('Please choose a case type to calculate your timeline.');
      setCalculatedTime(null);
      return;
    }

    setErrorMessage('');
    setIsFetchingTime(true);

    try {
      const response = await api.post('/public/signup-pricing', { goal: selectedType, answers: {} });
      const databaseTime = response.data.processing_time;
      setCalculatedTime(databaseTime || getTimelineEstimate(selectedType));
    } catch (error) {
      console.error('Failed to fetch timeline from database:', error);
      setCalculatedTime(getTimelineEstimate(selectedType));
    } finally {
      setIsFetchingTime(false);
    }
  };

  return (
    <section className="w-full py-10 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto bg-white text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-orange-500 text-[14px] font-bold tracking-[0.2em] uppercase">
          Estimate Your Timeline
        </span>

        <h2 className="text-3xl md:text-[38px] font-bold text-[#0A192F] mt-3 mb-3 tracking-tight">
          How Long Will Your Case Take?
        </h2>
        <p className="text-[#5A6579] font-medium mb-10 text-[15px] max-w-xl mx-auto leading-relaxed">
          Get accurate processing timelines for all Horizon Pathways
          immigration categories based on current USCIS data.
        </p>
      </motion.div>

      <motion.div
        className="bg-[#F5F7FA] rounded-2xl p-8 md:p-10 border border-[#E7EBF0] text-left max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <label className="block text-[#2F6FDB] font-bold text-[15px] mb-3">
          Select Your Immigration Case Type
        </label>

        <div className="relative mb-6">
          <select
            value={selectedType}
            onChange={(event) => {
              setSelectedType(event.target.value);
              setErrorMessage('');
              setCalculatedTime(null);
            }}
            className="w-full appearance-none bg-white border border-[#D8DEE6] text-[#5A6579] font-medium text-[14px] rounded-lg px-4 py-3.5 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all cursor-pointer"
          >
            <option value="" disabled>
              Choose from 40+ immigration case types...
            </option>
            {caseTypes.map((caseType) => (
              <option key={caseType.value} value={caseType.value}>
                {caseType.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-[#8A93A3]">
            <ChevronDown size={18} />
          </div>
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          className="w-full bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-[14px] rounded-lg py-3.5 flex items-center justify-center transition-all duration-300"
          disabled={isFetchingTime}
        >
          {isFetchingTime ? 'Fetching Timeline...' : 'Calculate Timeline'}
        </button>

        {errorMessage && (
          <p className="text-red-600 text-sm mt-4">{errorMessage}</p>
        )}

        {calculatedTime && (
          <div className="mt-8 rounded-3xl border border-[#FFE5D1] bg-[#FFF4EB] p-6 text-left">
            <p className="text-sm uppercase tracking-[0.2em] text-[#FF6B31] font-bold mb-2">
              Estimated Processing Time
            </p>
            <p className="text-[32px] md:text-[36px] font-extrabold text-[#1A2B4B] mb-2">
              {calculatedTime}
            </p>
            <p className="text-[#64748B] text-sm leading-relaxed">
              This estimate is based on current USCIS trends and varies by service center and case details.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#1A2B4B] px-5 py-3 text-white text-sm font-semibold transition hover:bg-[#162037]"
            >
              Get Started with Horizon
            </Link>
          </div>
        )}
      </motion.div>

      <motion.p
        className="text-[#8A93A3] text-[13px] leading-relaxed max-w-xl mx-auto mt-6 italic"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        * Processing times are based on current USCIS data and are updated
        regularly. Actual timelines may vary by service center and case
        complexity. Data source: USCIS Processing Times.
      </motion.p>
    </section>
  );
}