import React from 'react';
import Link from 'next/link';

export default function EditProfilePage() {
  return (
    <div className="w-full max-w-[1000px] mx-auto pb-24">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/dashboard/profile" className="text-[#E3755D] hover:underline font-bold text-sm mb-2 inline-block">
            &larr; Back to Profile
          </Link>
          <h1 className="text-3xl font-black text-[#1B3A64] mb-2">Edit Profile Settings</h1>
          <p className="text-gray-500 font-medium text-[15px]">
            Manage your personal information, security preferences, and notification settings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Navigation / Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Avatar Card */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#1B3A64] to-[#3B66A5] text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-inner relative group cursor-pointer overflow-hidden">
              AK
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
            </div>
            <h3 className="font-bold text-[#1B3A64] text-lg">Amina Khalid</h3>
            <p className="text-gray-500 text-sm font-medium mb-4">amina.khalid@example.com</p>
            <div className="inline-flex items-center space-x-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span>Identity Verified</span>
            </div>
          </div>

          {/* Settings Nav */}
          <div className="bg-white rounded-[24px] p-2 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
            <nav className="flex flex-col space-y-1">
              <button className="flex items-center space-x-3 px-4 py-3 bg-gray-50 text-[#1B3A64] rounded-xl font-bold text-sm transition-colors text-left">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E3755D]">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Personal Information</span>
              </button>
              <button className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-[#1B3A64] rounded-xl font-bold text-sm transition-colors text-left">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Security & Password</span>
              </button>
              <button className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-[#1B3A64] rounded-xl font-bold text-sm transition-colors text-left">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span>Notifications</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
            <h2 className="text-xl font-black text-[#1B3A64] mb-6 border-b border-gray-100 pb-4">
              Personal Information
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1B3A64]">First Name</label>
                  <input 
                    type="text" 
                    defaultValue="Amina"
                    className="w-full bg-gray-50 border border-gray-200 text-[#1B3A64] font-bold text-[15px] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1B3A64]">Last Name</label>
                  <input 
                    type="text" 
                    defaultValue="Khalid"
                    className="w-full bg-gray-50 border border-gray-200 text-[#1B3A64] font-bold text-[15px] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1B3A64]">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    defaultValue="amina.khalid@example.com"
                    className="w-full bg-gray-50 border border-gray-200 text-[#1B3A64] font-bold text-[15px] rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] transition-colors"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1B3A64]">Phone Number</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    defaultValue="+1 (800) 795-7153"
                    className="w-full bg-gray-50 border border-gray-200 text-[#1B3A64] font-bold text-[15px] rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] transition-colors"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1B3A64]">Language Preference</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-gray-50 border border-gray-200 text-[#1B3A64] font-bold text-[15px] rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] transition-colors">
                    <option value="en" selected>English</option>
                    <option value="ur">Urdu</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1B3A64]">Current Address</label>
                <textarea 
                  rows={3}
                  defaultValue="123 Immigration Blvd, Suite 400&#10;San Francisco, CA 94107&#10;United States"
                  className="w-full bg-gray-50 border border-gray-200 text-[#1B3A64] font-bold text-[15px] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] transition-colors resize-none"
                />
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center justify-end space-x-4">
                <Link href="/dashboard/profile" className="px-6 py-3 text-[#5A6579] font-bold text-sm hover:text-[#1B3A64] transition-colors">
                  Cancel
                </Link>
                <button type="button" className="bg-[#E3755D] hover:bg-[#C8634D] text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
