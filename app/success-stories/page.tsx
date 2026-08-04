const featuredStories = [
    {
        name: 'Mark Harrison',
        route: 'IR-5 Parent Visa',
        origin: 'United Kingdom',
        quote: '"They made bringing me to America simpler, less stressful, and ultimately successful."',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    },
    {
        name: 'Rachael Thompson',
        route: 'IR-1 & IR-2 Family Visas',
        origin: 'Sierra Leone',
        quote: '"They made the process feel easier and more manageable every step of the way."',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    },
    {
        name: 'Emily & Michał',
        route: 'Adjustment of Status → Removal of Conditions',
        origin: 'New York',
        quote: '"A long-term relationship built on trust, support, and guidance—smooth from ESTA to Green Card and beyond."',
        image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80',
    },
];

const reviewCards = [
    {
        name: 'Huck Gransden',
        date: 'April 15, 2025',
        review:
            '"My fiancée from Haiti was recently approved for her K-1 visa, and I honestly can’t thank Horizon Pathways enough for the support we received during the process. At first, we were overwhelmed by all the paperwork and requirements, but their team made everything much easier to understand."',
    },
    {
        name: 'Beau Walker',
        date: 'April 6, 2026',
        review:
            '"I’m very grateful to Horizon Pathways for helping my mother through her IR-5 immigrant visa process from the Philippines. At first, my family and I were overwhelmed by all the paperwork and requirements, but their team made everything much easier to understand."',
    },
    {
        name: 'Madison Cooper',
        date: 'May 5, 2026',
        review:
            '"I’m originally from Romania, and when I started my Adjustment of Status process from an F-1 student visa to a Green Card, I felt very overwhelmed by all the paperwork and immigration requirements. Horizon Pathways made the process much easier for me."',
    },
    {
        name: 'Abdoul Amadou',
        date: 'August 18, 2025',
        review:
            '"Choosing Horizon Pathways for my wife’s visa was a great decision. Visa rules and paperwork are very confusing and stressful. However, their team, especially Augustine, was very organized and got all our proof ready early."',
    },
    {
        name: 'Robert Mugisha',
        date: 'October 31, 2025',
        review:
            '"I recommend Horizon Pathways. They helped us file for an SB-1 Returning Resident visa for my child who overstayed in Congo due to unexpected circumstances. Immigration law is complex, but the team’s deep understanding of USCIS and consular processes put us at ease."',
    },
    {
        name: 'Caleb Thornton',
        date: 'May 12, 2026',
        review:
            '"I am a U.S. citizen and filed a K-1 visa for my fiancée in South Africa and a K-2 visa for her 4-year-old son. From preparing our initial USCIS petition all the way to the embassy interview in Johannesburg, Horizon Pathways guided and supported us through every step."',
    },
];

export default function SuccessStoriesPage() {
    return (
        <main className="min-h-screen bg-white text-[#0A192F]">
            <section className="relative overflow-hidden pt-24 pb-14 md:pt-32 md:pb-20">
                <div className="absolute top-0 right-0 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#FDE8D9] to-[#F2F8FF] blur-3xl" />
                <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-gradient-to-tr from-[#FCECE6] to-[#EEF4FF] blur-3xl" />

                <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-6 lg:px-8">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F2B89A] bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#E3623D] backdrop-blur-sm">
                        <span className="text-base">✦</span>
                        <span>Real People · Real Approvals</span>
                    </div>

                    <h1 className="mb-5 text-4xl font-bold leading-tight md:text-6xl">
                        Success Stories &amp;{' '}
                        <span className="bg-gradient-to-r from-[#E3623D] to-[#2F6FDB] bg-clip-text text-transparent">
                            Client Reviews
                        </span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#5A6579] md:text-xl">
                        Meet one of our immigration attorneys and hear directly from clients whose applications we’ve helped approve — in their own words.
                    </p>
                </div>
            </section>

            <section className="relative overflow-hidden bg-[#FFF8F4] py-20 md:py-28">
                <div className="absolute top-0 right-0 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-[#F8E0D2] to-[#FFF4EE] blur-3xl" />
                <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-gradient-to-tr from-[#F8E0D2] to-[#EEF5FF] blur-3xl" />

                <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E9D2C2] bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#E3623D]">
                            <span className="text-base">▶</span>
                            <span>Watch Real Stories</span>
                        </div>
                        <h2 className="mb-4 text-3xl font-bold md:text-5xl">Hear It From Our Attorney &amp; Clients</h2>
                        <p className="text-base text-[#5A6579] md:text-lg">
                            Personal video introductions from one of our immigration attorneys and approved clients sharing their journey.
                        </p>
                    </div>

                    <div className="mb-14 md:mb-20">
                        <div className="group relative overflow-hidden rounded-[28px] border border-[#F3C3A8] bg-gradient-to-br from-[#FDF5EE] to-[#FDFDFF] shadow-[0_18px_50px_rgba(27,58,100,0.08)]">
                            <div className="grid items-stretch md:grid-cols-2">
                                <div className="relative min-h-[280px] overflow-hidden bg-slate-100 md:min-h-[420px]">
                                    <img
                                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                                        alt="Immigration attorney introduction"
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-[#E3623D] shadow-2xl transition-transform duration-300 group-hover:scale-110 md:h-24 md:w-24">
                                            <span className="ml-1 text-2xl">▶</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center p-8 text-left md:p-12">
                                    <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#FBE8DD] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#E3623D]">
                                        <span>✦</span>
                                        <span>Attorney Welcome</span>
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold md:text-3xl">One of our Immigration Attorneys</h3>
                                    <p className="mb-4 text-sm font-semibold text-[#E3623D]">Licensed U.S. Immigration Attorney</p>
                                    <p className="mb-6 text-base leading-relaxed text-[#5A6579] md:text-lg">
                                        A personal welcome and a look at how our attorney-reviewed process protects your case from day one.
                                    </p>
                                    <button className="inline-flex w-fit items-center justify-center rounded-md bg-gradient-to-r from-[#E3623D] to-[#2F6FDB] px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105">
                                        <span className="mr-2 text-base">▶</span>
                                        Watch Introduction
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
                        {featuredStories.map((story, index) => (
                            <div
                                key={story.name}
                                className="group overflow-hidden rounded-[28px] border border-[#F1D7C7] bg-white shadow-[0_12px_35px_rgba(27,58,100,0.06)] transition-all duration-500 hover:-translate-y-1 hover:border-[#E3623D]"
                            >
                                <div className="relative aspect-video overflow-hidden bg-slate-100">
                                    <img
                                        src={story.image}
                                        alt={story.name}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-[#E3623D] shadow-2xl transition-transform duration-300 group-hover:scale-110 md:h-20 md:w-20">
                                            <span className="ml-1 text-xl">▶</span>
                                        </div>
                                    </div>
                                    <div className="absolute left-4 top-4 rounded-full border border-[#E4B89E] bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#E3623D]">
                                        Approved · {story.origin}
                                    </div>
                                </div>

                                <div className="p-5 md:p-6">
                                    <div className="mb-2 text-lg font-bold text-[#0A192F] group-hover:text-[#E3623D]">{story.name}</div>
                                    <div className="mb-3 text-sm text-[#5A6579]">{story.route}</div>
                                    <p className="text-sm leading-relaxed text-[#5A6579]">{story.quote}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 flex justify-center">
                        <button className="inline-flex items-center gap-2 rounded-full border border-[#E3623D]/30 bg-white px-8 py-3 text-sm font-semibold text-[#E3623D] transition-all duration-300 hover:scale-[1.02] hover:border-[#E3623D] hover:bg-[#FFF7F2]">
                            <span>View 5 More Stories</span>
                            <span>⌄</span>
                        </button>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden bg-[#F8FBFF] py-16 md:py-24">
                <div className="absolute inset-0 opacity-5" aria-hidden="true">
                    <div className="h-full w-full bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:28px_28px]" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                    <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
                        <h2 className="mb-4 px-4 text-3xl font-bold md:text-5xl">Success Stories from Our Clients</h2>
                        <p className="mb-6 px-4 text-base text-[#5A6579] md:text-lg">Real, verified reviews from clients on Trustpilot and Google</p>
                        <div className="inline-flex items-center gap-1 rounded-full border border-[#D6DCE7] bg-white p-1 shadow-sm">
                            <a
                                href="https://www.trustpilot.com/review/horizonpathways.us"
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-[#00b67a] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#00a56b]"
                            >
                                Trustpilot
                            </a>
                            <a
                                href="https://maps.app.goo.gl/bdsBtS4HTrg6g1PX6?g_st=iw"
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full px-4 py-2 text-sm font-semibold text-[#0A192F] transition-colors hover:bg-[#F4F7FB]"
                            >
                                Google
                            </a>
                        </div>
                    </div>

                    <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                        {reviewCards.map((review, index) => (
                            <div
                                key={review.name}
                                className="flex min-h-[300px] flex-col rounded-[20px] border border-[#DDE5F1] bg-white p-6 shadow-[0_10px_30px_rgba(27,58,100,0.05)] transition-all duration-500 hover:border-[#E3623D] hover:-translate-y-1"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, starIndex) => (
                                            <span key={starIndex} className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-[#00b67a] text-[10px] text-white">
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-xs text-[#5A6579]">{review.date}</span>
                                </div>

                                <p className="mb-4 flex-1 text-sm leading-relaxed text-[#5A6579] md:text-base">{review.review}</p>
                                <button className="mb-4 self-start text-xs font-semibold text-[#E3623D] hover:underline">Read more</button>

                                <div className="flex items-center justify-between border-t border-[#EDEFF3] pt-4">
                                    <div>
                                        <div className="font-bold text-[#0A192F]">{review.name}</div>
                                        <div className="text-xs text-[#5A6579]">US</div>
                                    </div>
                                    <a
                                        href="https://www.trustpilot.com/review/horizonpathways.us"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#00b67a] hover:underline"
                                    >
                                        <span>✓</span>
                                        <span>Verified</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <a
                            href="https://www.trustpilot.com/review/horizonpathways.us"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#E3623D] hover:underline"
                        >
                            <span>See all reviews on Trustpilot</span>
                            <span>↗</span>
                        </a>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden py-20 md:py-24">
                <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
                    <div className="rounded-[32px] border border-[#F3C3A8] bg-gradient-to-br from-[#FDF5EE] via-white to-[#F6F9FF] p-8 text-center shadow-[0_18px_50px_rgba(27,58,100,0.08)] md:p-14">
                        <div className="mb-5 inline-flex gap-1 text-[#00b67a]">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className="text-2xl">★</span>
                            ))}
                        </div>

                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">Want to read more reviews?</h2>
                        <p className="mx-auto mb-8 max-w-2xl text-base text-[#5A6579] md:text-lg">
                            See hundreds of verified, independent reviews from clients on Trustpilot and Google.
                        </p>

                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <a
                                href="https://www.trustpilot.com/review/horizonpathways.us"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[#E3623D] to-[#2F6FDB] px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105"
                            >
                                <span>Read on Trustpilot</span>
                                <span className="ml-2">↗</span>
                            </a>
                            <a
                                href="https://maps.app.goo.gl/bdsBtS4HTrg6g1PX6?g_st=iw"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-md border-2 border-[#E3623D]/30 bg-white px-8 py-3 text-sm font-semibold text-[#E3623D] transition-all duration-300 hover:scale-105 hover:border-[#E3623D] hover:bg-[#FFF7F2]"
                            >
                                <span>Read on Google</span>
                                <span className="ml-2">↗</span>
                            </a>
                        </div>

                        <div className="mt-10 border-t border-[#E9D2C2] pt-8">
                            <p className="mb-4 text-sm text-[#5A6579]">Ready to start your own immigration journey?</p>
                            <a href="/signup" className="inline-flex items-center gap-2 text-sm font-semibold text-[#E3623D] hover:underline">
                                <span>Get Started Today</span>
                                <span>→</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
