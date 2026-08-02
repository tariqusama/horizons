import Link from 'next/link';

const tools = [
    {
        title: 'USCIS Case Status Checker',
        description: 'Check your application status with your receipt number.',
        url: 'https://egov.uscis.gov/casestatus/landing.do',
    },
    {
        title: 'USCIS Processing Times',
        description: 'View current processing times for USCIS forms and service centers.',
        url: 'https://egov.uscis.gov/processing-times/',
    },
    {
        title: 'USCIS Office Locator',
        description: 'Find your local USCIS office, ASC, or field office.',
        url: 'https://egov.uscis.gov/office-locator/#/',
    },
    {
        title: 'USCIS Fee Calculator',
        description: 'Calculate current USCIS filing fees for your application.',
        url: 'https://www.uscis.gov/feecalculator',
    },
    {
        title: 'USCIS Forms Library',
        description: 'Download official USCIS forms and instructions.',
        url: 'https://www.uscis.gov/forms/all-forms',
    },
    {
        title: 'Contact USCIS',
        description: 'Reach USCIS customer service for case or filing questions.',
        url: 'https://www.uscis.gov/contactcenter',
    },
];

export default function ResourcesToolsSection() {
    return (
        <section className="w-full bg-white py-20 border-t border-gray-100">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16">
                <div className="mb-10 text-center">
                    <p className="text-orange-500 font-semibold text-sm uppercase tracking-[0.35em] mb-4">
                        Official USCIS Tools & Resources
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0A192F]">
                        The most important USCIS links in one place
                    </h2>
                    <p className="text-[#5A6579] text-base md:text-lg mt-4 max-w-2xl mx-auto">
                        Quickly access official USCIS case tracking, processing times, office locations, fee calculators, forms, and support.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {tools.map((tool) => (
                        <Link
                            key={tool.title}
                            href={tool.url}
                            target="_blank"
                            className="group block rounded-[24px] border border-[#E8EDF4] bg-[#F8FAFC] p-6 text-left shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(27,58,100,0.2)]"
                        >
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-white border border-[#E8EDF4] flex items-center justify-center text-orange-500 shadow-sm">
                                    <span className="material-icons text-2xl">open_in_new</span>
                                </div>
                                <span className="inline-flex rounded-full bg-[#EAF1F8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#1B3A64]">
                                    Official
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-[#0A192F] mb-3 group-hover:text-orange-500 transition-colors">
                                {tool.title}
                            </h3>
                            <p className="text-sm text-[#54667A] leading-relaxed">
                                {tool.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
