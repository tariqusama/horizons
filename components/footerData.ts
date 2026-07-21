export type FooterLinkItem = {
    href: string;
    label: string;
};

export type FooterContactItem = {
    type: 'address' | 'email' | 'phone' | 'hours';
    label: string;
    value: string;
    href?: string;
};

export type FooterSocialLink = {
    href: string;
    label: string;
    icon: 'facebook' | 'instagram' | 'youtube' | 'twitter';
};

export const footerBrand = {
    logoSrc: '/horizonlogo footer.png',
    logoAlt: 'Horizon Pathways',
    description:
        'Your trusted partner in navigating the complex world of U.S. immigration. We provide comprehensive legal services to help you achieve your American dream.',
    socialLinks: [
        { href: '#', label: 'Facebook', icon: 'facebook' },
        { href: '#', label: 'Instagram', icon: 'instagram' },
        { href: '#', label: 'Youtube', icon: 'youtube' },
        { href: '#', label: 'Twitter', icon: 'twitter' },
    ] as FooterSocialLink[],
};

export const footerNewsletter = {
    title: 'Stay Updated',
    description: 'Get the latest immigration news and updates delivered to your inbox.',
    placeholder: 'Enter your email',
    buttonText: 'Subscribe',
};

export const footerSections = [
    {
        title: 'Quick Links',
        items: [
            { href: '/', label: 'Home' },
            { href: '/how-it-works', label: 'How It Works' },
            { href: '/about', label: 'About Us' },
            { href: '/success-stories', label: 'Success Stories' },
            { href: '/contact', label: 'Contact' },
        ] as FooterLinkItem[],
    },
    {
        title: 'Services',
        items: [
            { href: '/services', label: 'All Services' },
            { href: '/free-tools', label: 'Free Tools' },
            { href: '/faq', label: 'FAQ' },
            { href: '/signup', label: 'Get Started' },
        ] as FooterLinkItem[],
    },
    {
        title: 'Legal',
        items: [
            { href: '/terms', label: 'Terms & Conditions' },
            { href: '/privacy', label: 'Privacy Policy' },
        ] as FooterLinkItem[],
    },
];

export const footerContactItems: FooterContactItem[] = [
    {
        type: 'address',
        label: 'Address',
        value: '7375 Executive Pl, Ste 400 #1062, Lanham, MD 20706',
    },
    {
        type: 'email',
        label: 'Email',
        value: 'support@horizonpathways.us',
        href: 'mailto:support@horizonpathways.us',
    },
    {
        type: 'phone',
        label: 'Phone',
        value: '+1 (800) 795 7153',
        href: 'tel:+18007957153',
    },
    {
        type: 'hours',
        label: 'Hours',
        value: 'Mon–Fri | 9:00 AM – 5:00 PM (EST)',
    },
];

export const footerBottom = {
    copyright: '© 2026 Horizon Pathways LLC. All rights reserved.',
    poweredBy: 'Powered by Innovation',
};
