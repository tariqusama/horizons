'use client';
import React from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const getVideoUrl = (filename: string) => `${BACKEND_URL}/storage/testmonials/${encodeURIComponent(filename)}`;

const files = [
  'Mark_.mp4',
  'Horizon Pathways Testimony Judith .MP4',
  'Main_Video_1_.mp4',
  'HP_2.mp4',
  'IMG_1500.MOV',
  'IMG_3241.MOV',
  'IMG_4779.MOV',
  'IMG_8409.MOV'
];

export default function TestVideosPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">Video Testimonials File Diagnostic</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {files.map((file) => (
          <div key={file} className="border border-slate-700 p-4 rounded-xl bg-slate-800">
            <p className="text-sm font-semibold mb-2 truncate">{file}</p>
            <video
              className="w-full aspect-video object-cover rounded bg-black"
              controls
              preload="metadata"
            >
              <source src={getVideoUrl(file)} />
            </video>
            <div className="mt-2 text-xs text-slate-400">
              <a href={getVideoUrl(file)} target="_blank" rel="noreferrer" className="text-blue-400 underline">
                Open video directly
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
