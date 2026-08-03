import {
    BadgeCheck,
    BellRing,
    CheckCircle2,
    ChevronDown,
    Clock,
    CreditCard,
    FileText,
    Headphones,
    Landmark,
    Lock,
    MailCheck,
    MapPin,
    Scale,
    Shield,
    Star,
    TrendingUp,
    Users,
} from 'lucide-react';

export const heroContent = {
    badge: 'Immigration Application Assistance',
    title: ['Your Path to U.S.', 'Immigration Success', 'Starts', 'Here'],
    highlight: 'Immigration Success',
    subtitle:
        'Professional document preparation services to help you navigate your immigration journey with confidence. We simplify complexity so you can focus on your future.',
    primaryCta: {
        label: 'Get Started Today',
        href: '/signup',
    },
    secondaryCta: {
        label: 'Learn More',
        href: '/how-it-works',
    },
    backgroundImage: '/hero-bg-2.png',
};

export const trustBadges = [
    {
        title: 'Legally Registered',
        subtitle: 'Fully Compliant',
        icon: Shield,
        color: '#2F6FDB',
    },
    {
        title: 'SSL Secured',
        subtitle: 'Data Protected',
        icon: Lock,
        color: '#E3755D',
    },
    {
        title: 'DOJ Accredited',
        subtitle: 'Certified Attorneys',
        icon: BadgeCheck,
        color: '#7C5CBF',
    },
    {
        title: 'USCIS-Experienced',
        subtitle: 'Filing Specialists',
        icon: Landmark,
        color: '#2F6FDB',
    },
];

export const impactStats = [
    {
        value: '98%',
        label: 'Success Rate',
        icon: TrendingUp,
        iconColor: '#1FA971',
        bg: '#E6F7EF',
    },
    {
        value: '3,021+',
        label: 'Cases Handled',
        icon: Users,
        iconColor: '#3E63DD',
        bg: '#EAEFFC',
    },
    {
        value: '24/7',
        label: 'Support Available',
        icon: Headphones,
        iconColor: '#E5484D',
        bg: '#FCEBEC',
    },
    {
        value: '4.9/5',
        label: 'Client Rating',
        icon: Star,
        iconColor: '#F5A623',
        bg: '#FDF1DD',
    },
];

export const features = [
    {
        title: "Forms That Don't Fight You",
        description: 'Guided questions in plain English — no legal jargon, no guesswork.',
        icon: FileText,
        iconColor: '#E3755D',
        iconBg: '#FDF1EA',
    },
    {
        title: 'A Real Attorney Reviews It',
        description: 'Before anything goes to USCIS, a certified immigration attorney looks it over.',
        icon: Scale,
        iconColor: '#E3755D',
        iconBg: '#FDF1EA',
    },
    {
        title: 'Always Know Where You Stand',
        description: "Track your case in real time so you're never left wondering what's next.",
        icon: MapPin,
        iconColor: '#E3755D',
        iconBg: '#FDF1EA',
    },
    {
        title: 'Pay Without the Headache',
        description: 'Secure checkout, simple membership — cancel or change it whenever.',
        icon: CreditCard,
        iconColor: '#E3755D',
        iconBg: '#FDF1EA',
    },
];

export const services = [
    {
        category: 'adjustment',
        sub: 'marriage',
        title: 'Marriage Green Card inside the U.S. — Concurrent Filing',
        description: 'I-130 and I-485 concurrent filing for marriage-based green card.',
        time: '12-18 months',
        tag: 'Popular',
        requirements: [
            'Married to U.S. citizen or resident',
            'Lawful entry to the United States',
        ],
    },
    {
        category: 'adjustment',
        sub: 'parent',
        title: 'Parent Adjustment of Status inside the U.S. — Concurrent Filing',
        description: 'I-130 and I-485 concurrent filing for parent adjustment.',
        time: '10-16 months',
        tag: null,
        requirements: [
            'Valid parent-child relationship',
            'Currently in the United States',
        ],
    },
    {
        category: 'adjustment',
        sub: 'child',
        title: 'Child Adjustment of Status inside the U.S. — Concurrent Filing',
        description: 'I-130 and I-485 concurrent filing for child adjustment.',
        time: '10-16 months',
        tag: null,
        requirements: [
            'Valid parent-child relationship',
            'Currently in the United States',
        ],
    },
    // Consular Processing (Outside U.S.)
    {
        category: 'consular',
        sub: 'spouse',
        title: 'Spouse Consular Processing – Immigrant Visa (Spouse Abroad)',
        description: 'Consular processing for spouse residing outside the United States.',
        time: '8-14 months',
        tag: null,
        requirements: ['Valid marriage recognized by USCIS', 'Consular interview at U.S. Embassy/Consulate'],
    },
    {
        category: 'consular',
        sub: 'parent',
        title: 'Parent Consular Processing – Immigrant Visa (Parent Abroad)',
        description: 'Consular processing for a parent living abroad.',
        time: '10-20 months',
        tag: null,
        requirements: ['Valid parent-child relationship', 'Consular interview and medical exam'],
    },
    {
        category: 'consular',
        sub: 'child',
        title: 'Child Consular Processing – Immigrant Visa (Child Abroad)',
        description: 'Consular immigrant visa processing for children outside the U.S.',
        time: '8-16 months',
        tag: null,
        requirements: ['Valid parent-child relationship', 'Consular processing documentation'],
    },
    {
        category: 'consular',
        sub: 'sibling',
        title: 'Sibling Immigrant Visa (Family Preference)',
        description: 'Family preference processing for siblings of U.S. citizens.',
        time: '5-12 years',
        tag: null,
        requirements: ['Proof of sibling relationship', 'Petition by U.S. citizen petitioner'],
    },
    {
        category: 'consular',
        sub: 'fiance',
        title: 'K-1 Fiancé(e) Visa (Fiancé Abroad)',
        description: 'K-1 visa processing for a U.S. petitioner and foreign fiancé(e).',
        time: '6-9 months',
        tag: null,
        requirements: ['Valid intent to marry within 90 days of entry', 'Proof of bona fide relationship'],
    },
    // Other Immigration Services
    {
        category: 'other',
        sub: 'naturalization',
        title: 'Naturalization (N-400) – U.S. Citizenship',
        description: 'Assistance with N-400 naturalization applications and interview preparation.',
        time: '6-12 months',
        tag: null,
        requirements: ['Meet residency and eligibility requirements', 'English and civics testing'],
    },
    {
        category: 'other',
        sub: 'i751',
        title: 'Removal of Conditions (I-751)',
        description: 'Filing I-751 to remove conditions on permanent residence for conditional green card holders.',
        time: '10-16 months',
        tag: null,
        requirements: ['Conditional permanent residency', 'Evidence of bona fide marriage (if applicable)'],
    },
    {
        category: 'other',
        sub: 'i90',
        title: 'Green Card Renewal/Replacement (I-90)',
        description: 'Assistance with Form I-90 for renewing or replacing a green card.',
        time: '6-12 months',
        tag: null,
        requirements: ['Existing permanent resident status', 'Proof of identity'],
    },
    {
        category: 'other',
        sub: 'daca',
        title: 'DACA Renewal',
        description: 'Guided support for DACA renewal application and supporting documentation.',
        time: '4-8 months',
        tag: null,
        requirements: ['Prior DACA approval', 'Proof of continuous residence'],
    },
];

export const freeTools = [
    {
        title: 'AR-11 Change of Address',
        description:
            'Required notification for all immigrants when changing address. Get a pre-filled PDF instantly.',
        tag: 'Most Popular',
        tagColor: '#E3623D',
        tagBg: '#FDF1EA',
        buttonText: 'Start Free AR-11',
        buttonClass:
            'bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white',
        icon: MailCheck,
        iconColor: '#E3623D',
        iconBg: '#FDF1EA',
    },
    {
        title: 'I-912 Fee Waiver',
        description:
            'Check eligibility and generate your USCIS fee waiver request form quickly and easily.',
        tag: 'Popular',
        tagColor: '#5A6579',
        tagBg: '#F0F2F5',
        buttonText: 'Start Free I-912',
        buttonClass: 'bg-[#0A192F] hover:bg-[#122846] text-white',
        icon: FileText,
        iconColor: '#5A6579',
        iconBg: '#F0F2F5',
    },
    {
        title: 'G-1145 E-Notification',
        description:
            'Get email and text updates for your USCIS applications. Add to any filing packet.',
        tag: 'Essential',
        tagColor: '#5A6579',
        tagBg: '#F0F2F5',
        buttonText: 'Start Free G-1145',
        buttonClass:
            'bg-white hover:bg-gray-50 text-[#0A192F] border border-[#D8DEE6]',
        icon: BellRing,
        iconColor: '#5A6579',
        iconBg: '#F0F2F5',
    },
];

export const timelineOptions = [
    { value: 'marriage', label: 'Marriage Green Card' },
    { value: 'fiance', label: 'K-1 Fiance Visa' },
    { value: 'citizenship', label: 'Citizenship & Naturalization' },
];

export const howItWorksSteps = [
    {
        num: '1',
        title: 'Create Your Profile',
        description:
            'Sign up and set up your secure personal dashboard. This is your central hub for all case activities and documents.',
        color: '#0A192F',
    },
    {
        num: '2',
        title: 'Complete Your Immigration Application',
        description:
            'Answer clear, guided questions to fill every required form accurately. Our system validates your entries as you go.',
        color: '#E3623D',
    },
    {
        num: '3',
        title: 'Upload & Review Documents',
        description:
            'Safely upload evidence; a Case Manager checks completeness and ensures all required supporting materials are present.',
        color: '#0A192F',
    },
    {
        num: '4',
        title: 'Legal & Quality Review',
        description:
            'An experienced immigration attorney reviews and finalizes your package to ensure legal compliance and accuracy.',
        color: '#B58A5C',
    },
    {
        num: '5',
        title: 'Print, Ship & Track',
        description:
            'We print, assemble, and mail your USCIS-ready packet, with real-time status updates delivered directly to your dashboard.',
        color: '#1E8A5F',
    },
];

export const successStories = [
    {
        text: '"My fiancé from Haiti was recently approved for her K-1 visa, and I honestly can\'t thank Horizon Pathways enough for the support we received. At first, we were overwhelmed by the paperwork..."',
        name: 'Huck Gransden',
        initials: 'HG',
        color: '#E3623D',
    },
    {
        text: '"I am very grateful for help in filing my mother through her IR-5 immigrant visa. At first, my family and I were overwhelmed. But the team\'s deep understanding of USCIS made it easier..."',
        name: 'Beau Walker',
        initials: 'BW',
        color: '#2F6FDB',
    },
    {
        text: '"From an F-1 student visa to a Green Card, I will very overwhelmed by the paperwork and requirements. Horizon Pathways guided me step-by-step and made everything easy..."',
        name: 'Madison Cooper',
        initials: 'MC',
        color: '#7C5CBF',
    },
];

export const faqItems = [
    'How long does the DACA renewal process take?',
    "What's the difference between Basic, Advanced, and Premium plans?",
    'Can I track my application status after submission?',
    'What documents do I need for a Green Card renewal?',
    'Do you offer refunds if my application is denied?',
    'How secure is my personal information?',
    'Can you help with family-based immigration for relatives abroad?',
];

export const helpCta = {
    eyebrow: 'Expert Support Available',
    title: 'Need help choosing the right service?',
    titleAccent: 'help',
    description:
        'Our experts are here to guide you through the process and help you select the best immigration service for your needs.',
    primaryCta: {
        label: 'See All Services',
        href: '/services',
    },
    secondaryCta: {
        label: 'Get Expert Consultation',
        href: '/contact',
    },
};
