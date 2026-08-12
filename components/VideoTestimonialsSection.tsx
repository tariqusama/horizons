'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, ChevronDown, Sparkles } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const getVideoUrl = (filename: string) => `${BACKEND_URL}/storage/testmonials/${encodeURIComponent(filename)}`;

interface Story {
  name: string;
  route: string;
  origin: string;
  badge: string;
  videoUrl: string;
  quote: string;
}

const mainAttorneyVideo = {
  name: 'Welcome to The Guided Path',
  route: 'A personal welcome and a look at how our attorney-reviewed process protects your case from day one.',
  origin: 'One of our immigration attorneys',
  videoUrl: 'Immigration Attorney.mp4'
};

const videoStories: Story[] = [
  {
    name: 'Mark Harrison',
    route: 'IR-5 Parent Visa',
    origin: 'United Kingdom',
    badge: 'Approved · United Kingdom',
    videoUrl: 'Mark_.mp4',
    quote: '"They made bringing me to America simpler, less stressful, and ultimately successful."',
  },
  {
    name: 'Rachael Thompson',
    route: 'IR-1 & IR-2 Family Visas',
    origin: 'Sierra Leone',
    badge: 'Petition Approved · Sierra Leone',
    videoUrl: 'Horizon Pathways Testimony Judith .MP4',
    quote: '"They made the process feel easier and more manageable every step of the way."',
  },
  {
    name: 'Emily & Michał',
    route: 'Adjustment of Status → Removal of Conditions',
    origin: 'New York',
    badge: 'Approved · New York',
    videoUrl: 'IMG_8409.MP4',
    quote: '"A long-term relationship built on trust, support, and guidance - smooth from ESTA to Green Card and beyond."',
  },
  {
    name: 'Boitumelo Refilwe',
    route: 'K-1 Fiancé Visa',
    origin: 'Botswana',
    badge: 'Approved · Botswana',
    videoUrl: 'HP_2.mp4',
    quote: '"Simpler, less stressful, and more affordable - filed entirely from my phone with attorney review included."',
  },
  {
    name: 'Wang Xinyi',
    route: 'F-1 → Adjustment of Status',
    origin: 'China',
    badge: 'Approved · China',
    videoUrl: 'IMG_1500.MP4',
    quote: '"A simpler, more affordable path from F-1 to Green Card - with Chinese document translation included."',
  },
  {
    name: 'Daniela Rodríguez',
    route: 'U.S. Naturalization',
    origin: 'U.S. Citizen',
    badge: 'Approved · U.S. Citizen',
    videoUrl: 'IMG_3241.MP4',
    quote: '"From dream to citizenship - guided through filing, documents, and interview prep every step of the way."',
  },
  {
    name: 'Abdelkader Benali',
    route: 'K-1 Fiancé Visa → Adjustment of Status',
    origin: 'Algeria',
    badge: 'Approved · Algeria',
    videoUrl: 'IMG_4779.MP4',
    quote: '"An affordable and trustworthy alternative to traditional immigration services - guided from USCIS to NVC to embassy approval, and now my Green Ca..."',
  },
  {
    name: 'Deepika Rao',
    route: 'Immigrant Visa (Embassy Interview)',
    origin: 'India',
    badge: 'Approved · India',
    videoUrl: 'Main_Video_1_.mp4',
    quote: '"From petition filing to interview preparation - supported every step so I felt confident and ready for my embassy interview."',
  },
];

export default function VideoTestimonialsSection() {
  const [isPlayingAttorney, setIsPlayingAttorney] = useState(false);
  const [playingCardIndex, setPlayingCardIndex] = useState<number | null>(null);
  const [showAllStories, setShowAllStories] = useState(false);

  const attorneyVideoRef = useRef<HTMLVideoElement>(null);
  const clientVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Stop attorney video when a client video plays
  useEffect(() => {
    if (playingCardIndex !== null && isPlayingAttorney) {
      setIsPlayingAttorney(false);
    }
  }, [playingCardIndex]);

  // Stop client video when attorney video plays
  useEffect(() => {
    if (isPlayingAttorney && playingCardIndex !== null) {
      setPlayingCardIndex(null);
    }
  }, [isPlayingAttorney]);

  const handlePlayAttorney = () => {
    setIsPlayingAttorney(true);
  };

  const handlePlayClient = (idx: number) => {
    setPlayingCardIndex(idx);
  };

  const getMimeType = (filename: string) => {
    if (filename.toLowerCase().endsWith('.mov')) return 'video/quicktime';
    return 'video/mp4';
  };

  const visibleStories = showAllStories ? videoStories : videoStories.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
      {/* Badge, Heading & Subtext */}
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E9D2C2] bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#E3623D] shadow-sm">
          <Play size={10} className="fill-[#E3623D] stroke-none" />
          <span>Watch Real Stories</span>
        </div>
        <h2 className="mb-4 text-3xl font-bold text-[#0A192F] md:text-5xl tracking-tight">
          Hear It From Our Attorney &amp; Clients
        </h2>
        <p className="text-base text-[#5A6579] md:text-lg leading-relaxed">
          Personal video introductions from one of our immigration attorneys and approved clients sharing their journey.
        </p>
      </div>

      {/* Main Attorney Welcome Card */}
      <div className="mb-14 md:mb-20">
        <div className="group relative overflow-hidden rounded-[24px] border border-[#E9D2C2] bg-white shadow-[0_12px_40px_rgba(27,58,100,0.04)]">
          <div className="grid gap-0 items-stretch md:grid-cols-2">
            {/* Left side: Video Player */}
            <div className="relative min-h-[320px] md:min-h-[460px] bg-black flex flex-col justify-center overflow-hidden">
              {isPlayingAttorney ? (
                <video
                  ref={attorneyVideoRef}
                  className="w-full h-full object-contain md:max-h-[460px]"
                  controls
                  autoPlay
                  preload="metadata"
                  playsInline
                >
                  <source src={getVideoUrl(mainAttorneyVideo.videoUrl)} type={getMimeType(mainAttorneyVideo.videoUrl)} />
                </video>
              ) : (
                <div
                  onClick={handlePlayAttorney}
                  className="relative w-full h-full cursor-pointer group/player flex items-center justify-center min-h-[320px] md:min-h-[460px]"
                >
                  {/* Blurred fill layer so there's never letterbox bars, but nothing gets cropped */}
                  <video
                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-40"
                    preload="metadata"
                    playsInline
                    muted
                    aria-hidden="true"
                    tabIndex={-1}
                  >
                    <source src={getVideoUrl(mainAttorneyVideo.videoUrl) + '#t=1.5'} type={getMimeType(mainAttorneyVideo.videoUrl)} />
                  </video>
                  {/* Foreground: full, uncropped frame */}
                  <video
                    className="relative z-[1] w-full h-full object-contain"
                    preload="metadata"
                    playsInline
                    muted
                  >
                    <source src={getVideoUrl(mainAttorneyVideo.videoUrl) + '#t=1.5'} type={getMimeType(mainAttorneyVideo.videoUrl)} />
                  </video>
                  {/* Dark overlay */}
                  <div className="absolute inset-0 z-[2] bg-black/10 group-hover/player:bg-black/20 transition-colors duration-300" />

                  {/* Play button */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#E3623D] shadow-2xl transition-transform duration-300 group-hover/player:scale-110">
                    <Play size={24} className="fill-[#E3623D] translate-x-[2px]" />
                  </div>
                </div>
              )}
            </div>

            {/* Right side: Welcome Info */}
            <div className="flex flex-col justify-center p-8 text-left md:p-12 bg-[#FCF6F2]/30">
              <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#FFF0E6] border border-[#F3C3A8]/45 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#E3623D]">
                <Sparkles size={12} className="fill-[#E3623D] stroke-none" />
                <span>Attorney Welcome</span>
              </div>
              <h3 className="mb-3 text-2xl font-extrabold text-[#0A192F] md:text-3xl tracking-tight leading-tight">
                One of our Immigration Attorneys
              </h3>
              <p className="mb-4 text-xs font-bold text-[#E3623D] uppercase tracking-wider">
                Licensed U.S. Immigration Attorney
              </p>
              <p className="mb-8 text-sm leading-relaxed text-[#5A6579] md:text-base">
                A personal welcome and a look at how our attorney-reviewed process protects your case from day one.
              </p>

              <button
                onClick={handlePlayAttorney}
                className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E3623D] to-[#1A2B4B] hover:scale-105 active:scale-98 text-white font-bold px-7 py-3.5 text-[14px] shadow-md shadow-[#E3623D]/10 transition-all duration-300 group/btn cursor-pointer"
              >
                <Play size={14} className="fill-white stroke-none" />
                <span>Watch Introduction</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Testimonials */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
        {visibleStories.map((story, index) => {
          const isPlaying = playingCardIndex === index;
          return (
            <div
              key={story.name}
              className="group flex flex-col overflow-hidden rounded-[24px] border border-[#E9D2C2] bg-white shadow-[0_8px_25px_rgba(27,58,100,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_35px_rgba(27,58,100,0.06)] hover:border-[#E3623D]"
            >
              {/* Top part: Video Player */}
              <div className="relative aspect-[4/5] sm:aspect-video w-full bg-black overflow-hidden flex flex-col justify-center">
                {isPlaying ? (
                  <video
                    ref={(el) => { clientVideoRefs.current[index] = el; }}
                    className="relative z-[1] w-full h-full object-contain"
                    controls
                    autoPlay
                    preload="metadata"
                    playsInline
                  >
                    <source src={getVideoUrl(story.videoUrl)} type={getMimeType(story.videoUrl)} />
                  </video>
                ) : (
                  <div
                    onClick={() => handlePlayClient(index)}
                    className="relative w-full h-full cursor-pointer group/player flex items-center justify-center"
                  >
                    {/* Blurred fill layer so there's never letterbox bars, but nothing gets cropped */}
                    <video
                      className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-40"
                      preload="metadata"
                      playsInline
                      muted
                      aria-hidden="true"
                      tabIndex={-1}
                    >
                      <source src={getVideoUrl(story.videoUrl) + '#t=1.5'} type={getMimeType(story.videoUrl)} />
                    </video>
                    {/* Foreground: full, uncropped frame */}
                    <video
                      className="relative z-[1] w-full h-full object-contain"
                      preload="metadata"
                      playsInline
                      muted
                    >
                      <source src={getVideoUrl(story.videoUrl) + '#t=1.5'} type={getMimeType(story.videoUrl)} />
                    </video>
                    {/* Dark overlay */}
                    <div className="absolute inset-0 z-[2] bg-black/10 group-hover/player:bg-black/20 transition-colors duration-300" />

                    {/* Play button overlay */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#E3623D] shadow-lg transition-transform duration-300 group-hover/player:scale-110">
                      <Play size={18} className="fill-[#E3623D] translate-x-[1px]" />
                    </div>

                    {/* Badge */}
                    <div className="absolute left-4 top-4 right-4 z-[3] flex justify-start pointer-events-none">
                      <div className="rounded-full bg-white/95 border border-[#F3C3A8]/30 px-3 py-1 text-[11px] font-bold text-[#E3623D] flex items-center gap-1 shadow-sm max-w-full pointer-events-auto">
                        <Sparkles size={10} className="fill-[#E3623D] stroke-none shrink-0" />
                        <span className="truncate">{story.badge}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom part: Card info */}
              <div className="p-6 flex-1 flex flex-col justify-between bg-[#FCF6F2]/30 border-t border-[#E9D2C2]/40">
                <div>
                  <h4 className="text-base font-bold text-[#0A192F] group-hover:text-[#E3623D] transition-colors duration-200">
                    {story.name}
                  </h4>
                  <p className="text-[11px] font-bold text-[#8A93A3] uppercase tracking-wider mt-0.5 mb-2">
                    {story.route}
                  </p>
                  <p className="text-xs leading-relaxed text-[#5A6579] font-normal">
                    {story.quote}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View More Button */}
      {!showAllStories && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowAllStories(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#E3623D] bg-white px-8 py-2.5 text-xs font-bold text-[#E3623D] shadow-sm transition-all duration-300 hover:scale-103 hover:bg-[#FFF7F2] active:scale-97 cursor-pointer"
          >
            <span>View 6 More Stories</span>
            <ChevronDown size={14} />
          </button>
        </div>
      )}
    </div>
  );
}