const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const getVideoUrl = (filename: string) => `${BACKEND_URL}/storage/testmonials/${encodeURIComponent(filename)}`;

const videoStories = [
    {
        name: 'Mark Harrison',
        route: 'IR-5 Parent Visa',
        origin: 'United Kingdom',
        videoUrl: 'Mark_.mp4',
    },
    {
        name: 'Judith',
        route: 'Client Testimony',
        origin: 'Approved',
        videoUrl: 'Horizon Pathways Testimony Judith .MP4',
    },
    {
        name: 'Client Story 1',
        route: 'Client Testimony',
        origin: 'Approved',
        videoUrl: 'Main_Video_1_.mp4',
    },
    {
        name: 'Client Story 2',
        route: 'Client Testimony',
        origin: 'Approved',
        videoUrl: 'HP_2.mp4',
    },
    {
        name: 'Client Story 3',
        route: 'Client Testimony',
        origin: 'Approved',
        videoUrl: 'IMG_1500.MOV',
    },
    {
        name: 'Client Story 4',
        route: 'Client Testimony',
        origin: 'Approved',
        videoUrl: 'IMG_3241.MOV',
    },
    {
        name: 'Client Story 5',
        route: 'Client Testimony',
        origin: 'Approved',
        videoUrl: 'IMG_4779.MOV',
    },
    {
        name: 'Client Story 6',
        route: 'Client Testimony',
        origin: 'Approved',
        videoUrl: 'IMG_8409.MOV',
    }
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

export default function TestimonialsPage() {
    return (
        <main className="min-h-screen bg-white text-[#0A192F]">
            <section className="relative overflow-hidden bg-[#06132a] pt-24 pb-16 md:pt-32 md:pb-24">
                <div className="absolute left-[-80px] top-12 h-[320px] w-[320px] rounded-full bg-[#ff743b]/20 blur-3xl" />
                <div className="absolute right-[-80px] top-28 h-[300px] w-[300px] rounded-full bg-[#3b82f6]/20 blur-3xl" />
                <div className="absolute inset-x-0 bottom-0 h-[220px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_60%)]" />

                <div className="relative z-10 mx-auto max-w-6xl px-4 text-center md:px-6 lg:px-8">
                    <div className="mb-4 inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
                        <span className="text-base">✦</span>
                        <span>Client Reviews</span>
                    </div>

                    <h1 className="mb-6 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
                        Success Stories &amp; Client Reviews
                    </h1>

                    <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                        Meet one of our immigration attorneys and hear directly from clients whose applications we’ve helped approve — in their own words.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                        <a href="#watch" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#E3623D] to-[#2F6FDB] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#E3623D]/25 transition hover:shadow-[#E3623D]/40">
                            Watch Real Stories
                        </a>
                        <a href="#reviews" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                            Read Written Reviews
                        </a>
                    </div>

                    <div className="mt-16 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 text-left backdrop-blur-sm">
                            <p className="text-3xl font-black text-white">3,000+</p>
                            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-300">Approvals</p>
                        </div>
                        <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 text-left backdrop-blur-sm">
                            <p className="text-3xl font-black text-white">98%</p>
                            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-300">Success Rate</p>
                        </div>
                        <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 text-left backdrop-blur-sm">
                            <p className="text-3xl font-black text-white">4.9/5</p>
                            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-300">Average Rating</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="watch" className="relative overflow-hidden bg-[#FFF8F4] py-20 md:py-28">
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
                        <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-[2fr_1fr]">
                            <div className="group relative overflow-hidden rounded-[30px] border border-[#E9EDF4] bg-white shadow-[0_18px_50px_rgba(27,58,100,0.08)]">
                                <div className="relative min-h-[320px] sm:min-h-[360px] md:min-h-[420px] bg-black flex flex-col justify-center">
                                    <video
                                        src={getVideoUrl("Immigration Attorney.mp4")}
                                        className="w-full max-h-[420px] object-contain"
                                        controls
                                        preload="metadata"
                                    />
                                    <div className="absolute left-6 top-6 rounded-full bg-white/95 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0A192F] shadow-sm pointer-events-none z-10">
                                        One of our immigration attorneys
                                    </div>
                                </div>
                                <div className="bg-[#0A192F] px-6 py-6 text-white md:px-8 md:py-8">
                                    <p className="mb-2 text-xs uppercase tracking-[0.24em] text-white/70">Welcome to The Guided Path</p>
                                    <h3 className="text-2xl font-bold md:text-3xl">A personal welcome and a look at how our attorney-reviewed process protects your case from day one.</h3>
                                </div>
                            </div>

                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {videoStories.map((story) => (
                                    <div key={story.name} className="flex flex-col overflow-hidden rounded-[24px] border border-[#E9EDF4] bg-white shadow-sm transition hover:shadow-md md:flex-row">
                                        <div className="relative h-48 w-full overflow-hidden md:h-24 md:w-32 bg-black flex-shrink-0">
                                            <video
                                                src={getVideoUrl(story.videoUrl)}
                                                className="h-full w-full object-cover"
                                                controls
                                                preload="metadata"
                                            />
                                        </div>
                                        <div className="flex-1 p-4">
                                            <div className="text-sm font-semibold text-[#0A192F]">{story.name}</div>
                                            <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[#5A6579]">Approved · {story.origin}</div>
                                            <div className="mt-3 text-sm text-[#5A6579]">{story.route}</div>
                                        </div>
                                    </div>
                                ))}

                                <div className="mt-2 text-center">
                                    <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A192F] transition hover:text-[#E3623D]">
                                        <span>View More Stories</span>
                                        <span>→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
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
                        {reviewCards.map((review) => (
                            <div
                                key={review.name}
                                className="flex min-h-[300px] flex-col rounded-[24px] border border-[#E7ECF5] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1"
                            >
                                <div className="mb-5 flex gap-1 text-amber-400">
                                    {Array.from({ length: 5 }).map((_, starIndex) => (
                                        <span key={starIndex} className="text-lg">★</span>
                                    ))}
                                </div>

                                <p className="mb-6 flex-1 text-base leading-relaxed text-[#334155]">{review.review}</p>

                                <div className="flex items-center gap-3 border-t border-[#F1F5F9] pt-5">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E2E8F0] text-sm font-bold text-[#0F172A]">
                                        {review.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-[#0A192F]">{review.name}</div>
                                        <div className="text-xs uppercase tracking-[0.24em] text-[#475569]">Verified Client</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <a
                            href="https://www.trustpilot.com/review/horizonpathways.us"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A192F] hover:text-[#E3623D]"
                        >
                            <span>See all reviews on Trustpilot</span>
                            <span>↗</span>
                        </a>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden bg-[#07122d] py-20 md:py-24">
                <div className="mx-auto max-w-4xl px-4 text-center md:px-6 lg:px-8">
                    <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                        Ready to start your own immigration journey?
                    </h2>
                    <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                        Take the next step with Horizon Pathways and get expert guidance for your application.
                    </p>
                    <a
                        href="/signup"
                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-orange-500 to-orange-600 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(236,72,153,0.18)] transition duration-300 hover:from-orange-600 hover:to-orange-700"
                    >
                        Get Started Today
                    </a>
                </div>
            </section>
        </main>
    );
}