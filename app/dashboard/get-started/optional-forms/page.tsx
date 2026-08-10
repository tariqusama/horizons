"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { getNextFormPath, getPrevFormPath } from "../formsHelper";

export default function OptionalFormsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const askParam = searchParams?.get('ask');
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [application, setApplication] = useState<any>(null);
    const [error, setError] = useState('');
    const [answer, setAnswer] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchApp = async () => {
            try {
                const appsRes = await api.get('/applications');
                const apps = appsRes.data || [];
                const latest = apps[0];
                if (!latest) {
                    router.push('/dashboard');
                    return;
                }
                setApplication(latest);
                
                // Set default if previously answered
                const fd = latest.form_data || {};
                if (askParam === 'g-1145') {
                    if (fd.wants_g1145 !== undefined && fd.wants_g1145 !== null && fd.wants_g1145 !== '') setAnswer(fd.wants_g1145 === true || fd.wants_g1145 === 'yes');
                } else if (askParam === 'i-765') {
                    if (fd.wants_ead !== undefined && fd.wants_ead !== null && fd.wants_ead !== '') setAnswer(fd.wants_ead === true || fd.wants_ead === 'yes');
                } else if (askParam === 'i-131') {
                    if (fd.wants_ap !== undefined && fd.wants_ap !== null && fd.wants_ap !== '') setAnswer(fd.wants_ap === true || fd.wants_ap === 'yes');
                } else if (askParam === 'i-864a') {
                    if (fd.wants_household_member !== undefined && fd.wants_household_member !== null && fd.wants_household_member !== '') setAnswer(fd.wants_household_member === true || fd.wants_household_member === 'yes');
                }
            } catch (err) {
                console.error(err);
                router.push('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };
        fetchApp();
    }, [router, askParam]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-[#5B6472] font-semibold">Loading...</p>
            </div>
        );
    }

    const handleSaveAndContinue = async () => {
        if (answer === null) {
            setError('Please select an option before continuing.');
            return;
        }

        setIsSaving(true);
        setError('');
        try {
            const formData = application.form_data || {};
            const updatedFormData = { ...formData };
            
            if (askParam === 'g-1145') {
                updatedFormData.wants_g1145 = answer;
                updatedFormData.fileG1145 = answer ? 'yes' : 'no';
            } else if (askParam === 'i-765') {
                updatedFormData.wants_ead = answer;
                updatedFormData.wants_i765 = answer ? 'yes' : 'no';
            } else if (askParam === 'i-131') {
                updatedFormData.wants_ap = answer;
                updatedFormData.wants_i131 = answer ? 'yes' : 'no';
            } else if (askParam === 'i-864a') {
                updatedFormData.wants_household_member = answer;
            }

            const updatedApp = { ...application, form_data: updatedFormData };

            await api.put(`/applications/${application.id}/save-progress`, {
                form_data: updatedFormData,
            });

            // Determine next path. The route path for this page includes the ?ask=param
            // so we need to pass that to getNextFormPath to find the correct index.
            const currentPathWithParam = `/dashboard/get-started/optional-forms?ask=${askParam}`;
            const nextPath = getNextFormPath(currentPathWithParam, updatedApp);
            
            if (nextPath.includes('document-upload')) {
                router.push(nextPath);
            } else if (nextPath.includes('optional-forms?ask=')) {
                router.push(nextPath);
            } else {
                const nextSlug = nextPath.split('/').pop();
                router.push(`/dashboard/get-started/overview?form=${nextSlug}`);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to save preferences. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleBack = () => {
        const currentPathWithParam = `/dashboard/get-started/optional-forms?ask=${askParam}`;
        const prevPath = getPrevFormPath(currentPathWithParam, application);
        
        if (prevPath === '/dashboard/get-started') {
            router.push(prevPath);
        } else if (prevPath.includes('optional-forms?ask=')) {
            router.push(prevPath);
        } else {
            const prevSlug = prevPath.split('/').pop();
            router.push(`/dashboard/get-started/overview?form=${prevSlug}`);
        }
    };

    // Render configuration based on askParam
    let title = '';
    let subtitle = '';
    
    if (askParam === 'g-1145') {
        title = 'Electronic Notifications (Form G-1145)';
        subtitle = 'Would you like to receive electronic notifications (text/email) when your application is accepted by USCIS?';
    } else if (askParam === 'i-765') {
        title = 'Work Permit (Form I-765)';
        subtitle = 'Would you like to apply for an Employment Authorization Document while your application is pending?';
    } else if (askParam === 'i-131') {
        title = 'Advance Parole (Form I-131)';
        subtitle = 'Would you like to apply for a travel document so you may travel internationally while your application is pending?';
    } else if (askParam === 'i-864a') {
        title = 'Financial Sponsorship (Form I-864A)';
        subtitle = 'Will you use income/assets from a Household Member to meet the financial sponsorship requirements?';
    } else {
        // Fallback or error state
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-red-500 font-semibold">Invalid question parameter.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[95vw] sm:max-w-[86vw] lg:max-w-[56rem] mx-auto p-4 sm:p-8 bg-white rounded-3xl shadow-sm border border-slate-100 my-8">
            <div className="mb-6 pb-6 border-b border-slate-200">
                <h1 className="text-2xl font-bold text-[#101F38] mb-2">{title}</h1>
                <p className="text-sm text-slate-500">Based on your answer below, we will dynamically add the necessary form to your package if needed.</p>
            </div>
            
            <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-sm text-slate-600 mb-4">{subtitle}</p>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="answer" 
                                checked={answer === true} 
                                onChange={() => setAnswer(true)} 
                                className="w-4 h-4 text-orange-600 focus:ring-orange-500" 
                            />
                            <span className="text-sm font-medium">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="answer" 
                                checked={answer === false} 
                                onChange={() => setAnswer(false)} 
                                className="w-4 h-4 text-orange-600 focus:ring-orange-500" 
                            />
                            <span className="text-sm font-medium">No</span>
                        </label>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between">
                <button
                    onClick={handleBack}
                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                    &larr; Previous
                </button>
                <button
                    onClick={handleSaveAndContinue}
                    disabled={isSaving}
                    className="px-8 py-3 rounded-xl bg-[#101F38] text-white font-semibold hover:bg-[#0a1526] transition shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save and Continue'}
                    {!isSaving && <span aria-hidden="true">&rarr;</span>}
                </button>
            </div>
        </div>
    );
}
