import React from 'react';

export default function ResourcesGrid() {
  const resources = [
    {
      type: "Tool",
      title: "USCIS Case Status Checker",
      description: "Check the status of your immigration application or petition using your receipt number",
      category: "Tools",
      action: "Visit",
      icon: "build"
    },
    {
      type: "Tool",
      title: "USCIS Processing Times",
      description: "View current processing times for all USCIS forms and service centers nationwide",
      category: "Tools",
      action: "Visit",
      icon: "schedule"
    },
    {
      type: "Tool",
      title: "USCIS Office Locator",
      description: "Find your nearest USCIS office, Application Support Center, or field office",
      category: "Tools",
      action: "Visit",
      icon: "location_on"
    },
    {
      type: "Tool",
      title: "USCIS Fee Calculator",
      description: "Calculate filing fees for your immigration applications and petitions",
      category: "Tools",
      action: "Visit",
      icon: "calculate"
    },
    {
      type: "Tool",
      title: "USCIS InfoPass Appointment",
      description: "Schedule an appointment at your local USCIS office for case inquiries",
      category: "Tools",
      action: "Visit",
      icon: "event"
    },
    {
      type: "Official Resource",
      title: "USCIS Contact Center",
      description: "Get help from USCIS customer service representatives at 1-800-375-5283",
      category: "Tools",
      action: "Visit",
      icon: "contact_phone"
    },
    {
      type: "Official Resource",
      title: "Visa Bulletin",
      description: "Monthly Department of State Visa Bulletin showing priority dates for green card categories",
      category: "Tools",
      action: "Visit",
      icon: "article"
    },
    {
      type: "Official Resource",
      title: "USCIS Forms Library",
      description: "Download official USCIS forms and instructions in PDF format",
      category: "Tools",
      action: "Visit",
      icon: "library_books"
    },
    {
      type: "Official Resource",
      title: "USCIS Policy Manual",
      description: "Official guidance on immigration policies and procedures",
      category: "Tools",
      action: "Visit",
      icon: "menu_book"
    },
    {
      type: "Checklist",
      title: "Marriage Green Card Complete Checklist",
      description: "Comprehensive document checklist for I-130/I-485 concurrent filing including all required forms and supporting documents",
      category: "Family-Based",
      action: "View",
      icon: "checklist"
    },
    {
      type: "Form Guide",
      title: "I-130 Family Petition Official Form",
      description: "Official USCIS Form I-130 for Petition for Alien Relative with complete instructions",
      category: "Family-Based",
      action: "View",
      icon: "description"
    },
    {
      type: "Form Guide",
      title: "I-485 Adjustment of Status Official Form",
      description: "Official USCIS Form I-485 Application to Register Permanent Residence with instructions",
      category: "Family-Based",
      action: "View",
      icon: "description"
    },
    {
      type: "Form Guide",
      title: "N-400 Citizenship Application Official Form",
      description: "Official USCIS Form N-400 Application for Naturalization with complete instructions",
      category: "Citizenship",
      action: "View",
      icon: "description"
    },
    {
      type: "Tool",
      title: "Naturalization Eligibility Tool",
      description: "Check if you meet the requirements to apply for U.S. citizenship",
      category: "Citizenship",
      action: "Visit",
      icon: "verified"
    },
    {
      type: "Official Resource",
      title: "100 Civics Questions and Answers",
      description: "Complete list of 100 civics questions and answers with audio for the naturalization test",
      category: "Citizenship",
      action: "Visit",
      icon: "question_answer"
    },
    {
      type: "Video",
      title: "USCIS Official YouTube Channel",
      description: "Official videos from USCIS explaining immigration processes, forms, and citizenship",
      category: "Tools",
      action: "Watch",
      icon: "play_circle"
    }
  ];

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 py-32 bg-[#FDFBF9]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {resources.map((res, idx) => {
          return (
            <div key={idx} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_15px_30px_-10px_rgba(27,58,100,0.08)] hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(27,58,100,0.12)] transition-all duration-300 flex flex-col h-full group">
              <div className="flex items-center justify-between mb-8">
                <span className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider bg-[#FDFBF9] border border-gray-200/60 shadow-inner text-[#E3755D]`}>
                  <span className="material-icons text-[16px]">{res.icon}</span>
                  <span>{res.type}</span>
                </span>
                <span className="text-[#5A6579] text-[11px] font-bold uppercase tracking-wider bg-[#EAF1F8] px-3 py-1 rounded-md">
                  {res.category}
                </span>
              </div>
              
              <h3 className="text-[#1B3A64] font-bold text-[20px] mb-4 leading-snug group-hover:text-[#E3755D] transition-colors">
                {res.title}
              </h3>
              
              <p className="text-[#5A6579] text-[15px] leading-relaxed mb-8 flex-grow font-medium">
                {res.description}
              </p>
              
              <div className="pt-5 border-t border-gray-100 flex items-center justify-between mt-auto">
                <span className="text-[#1B3A64] font-bold text-[14px] uppercase hover:text-[#E3755D] transition-colors cursor-pointer flex items-center space-x-2">
                  <span>{res.action}</span>
                  <span className="material-icons text-[18px]">arrow_forward</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
