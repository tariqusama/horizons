import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const prompt = `You are Nancy, a helpful, polite, and concise immigration assistant for Horizon Pathways. Answer this query clearly: ${message}`;
        
        // Fetch from Pollinations API server-to-server to avoid browser Turnstile/Captcha challenges
        const res = await fetch('https://text.pollinations.ai/prompt/' + encodeURIComponent(prompt), {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Node.js' 
            }
        });
        
        if (!res.ok) {
            throw new Error(`API returned ${res.status}`);
        }
        
        const text = await res.text();
        return NextResponse.json({ reply: text });
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ reply: "I'm having trouble connecting to my servers right now. Please try again later." });
    }
}
