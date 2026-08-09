"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

function FormBuilderContent() {
    const searchParams = useSearchParams();
    const serviceId = searchParams.get('serviceId');
    const router = useRouter();

    const [form, setForm] = useState<any>(null);
    const [allForms, setAllForms] = useState<any[]>([]);
    const [serviceForms, setServiceForms] = useState<any[]>([]);
    const [activeFormId, setActiveFormId] = useState<number | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isCreating, setIsCreating] = useState(false);
    const [newFormName, setNewFormName] = useState('');
    const [newFormSlug, setNewFormSlug] = useState('');

    const [isConnecting, setIsConnecting] = useState(false);
    const [connectFormId, setConnectFormId] = useState('');

    // Modal States
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState('');

    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
    const [newQuestionText, setNewQuestionText] = useState('');
    const [newQuestionHelpText, setNewQuestionHelpText] = useState('');
    const [newQuestionImageBase64, setNewQuestionImageBase64] = useState('');
    const [newQuestionField, setNewQuestionField] = useState('');
    const [newQuestionType, setNewQuestionType] = useState('text');
    const [newQuestionOptions, setNewQuestionOptions] = useState([{ label: '', value: '' }]);
    const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);

    // Custom Dialog Modal State
    const [dialogState, setDialogState] = useState<{
        isOpen: boolean;
        type: 'alert' | 'confirm';
        title: string;
        message: string;
        onConfirm?: () => void;
    }>({
        isOpen: false,
        type: 'alert',
        title: '',
        message: ''
    });

    const showAlert = (title: string, message: string) => {
        setDialogState({ isOpen: true, type: 'alert', title, message });
    };

    const showConfirm = (title: string, message: string, onConfirm: () => void) => {
        setDialogState({ isOpen: true, type: 'confirm', title, message, onConfirm });
    };

    const closeDialog = () => {
        setDialogState(prev => ({ ...prev, isOpen: false }));
    };

    const loadAllForms = async () => {
        try {
            const res = await api.get('/admin/guide-engine/forms');
            setAllForms(res.data);
            
            const matchingForms = res.data.filter((f: any) => f.services?.some((s:any) => s.id === Number(serviceId)));
            setServiceForms(matchingForms);
            
            return matchingForms;
        } catch (err: any) {
            console.error(err);
            setError('Failed to load form data.');
            setLoading(false);
            return [];
        }
    };

    useEffect(() => {
        if (serviceId) {
            loadAllForms().then(matchingForms => {
                if (matchingForms.length > 0 && !activeFormId) {
                    setActiveFormId(matchingForms[0].id);
                } else if (matchingForms.length === 0) {
                    setForm(null);
                    setLoading(false);
                }
            });
        } else {
            setLoading(false);
            setError('No Service ID provided.');
        }
    }, [serviceId]);

    useEffect(() => {
        if (activeFormId) {
            api.get(`/admin/guide-engine/forms/${activeFormId}`)
                .then(res => {
                    setForm(res.data);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [activeFormId]);

    const handleCreateForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const newForm = await api.post('/admin/guide-engine/forms', {
                service_id: Number(serviceId),
                name: newFormName,
                slug: newFormSlug,
                description: 'Dynamic form generated from admin.'
            });
            setShowCreateForm(false);
            setNewFormName('');
            setNewFormSlug('');
            setActiveFormId(newForm.data.id);
            // activeFormId change will trigger single form load via useEffect
            loadAllForms();
        } catch (err: any) {
            console.error(err);
            showAlert('Error', 'Failed to create form.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleConnectForm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!connectFormId) return;
        setIsConnecting(true);
        try {
            await api.post(`/admin/guide-engine/forms/${connectFormId}/connect`, {
                service_id: Number(serviceId)
            });
            setShowCreateForm(false);
            setConnectFormId('');
            setActiveFormId(Number(connectFormId));
            loadAllForms(); // Reload to fetch the new links
        } catch (err: any) {
            console.error(err);
            showAlert('Error', 'Failed to connect form.');
        } finally {
            setIsConnecting(false);
        }
    };

    const handleUnlinkForm = (formId: number) => {
        showConfirm(
            "Unlink Form",
            "Are you sure you want to unlink this form from the current service? This will not delete the form itself.",
            async () => {
                try {
                    await api.post(`/admin/guide-engine/forms/${formId}/unlink`, {
                        service_id: Number(serviceId)
                    });
                    
                    const matchingForms = await loadAllForms();
                    if (activeFormId === formId) {
                        if (matchingForms.length > 0) {
                            setActiveFormId(matchingForms[0].id);
                        } else {
                            setActiveFormId(null);
                            setForm(null);
                        }
                    }
                } catch (err) {
                    console.error(err);
                    showAlert("Error", "Failed to unlink form.");
                }
            }
        );
    };

    const openSectionModal = () => {
        setNewSectionTitle('');
        setIsSectionModalOpen(true);
    };

    const handleAddSectionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(`/admin/guide-engine/forms/${form.id}/sections`, {
                title: newSectionTitle,
                order: form.sections?.length || 0
            });
            setIsSectionModalOpen(false);
            // Refresh single form
            api.get(`/admin/guide-engine/forms/${activeFormId}`).then(res => setForm(res.data));
        } catch (err) {
            console.error(err);
            showAlert("Error", "Failed to add section.");
        }
    };

    const handleDeleteSection = (sectionId: number) => {
        showConfirm(
            "Delete Section",
            "Are you sure you want to delete this section?",
            async () => {
                try {
                    await api.delete(`/admin/guide-engine/sections/${sectionId}`);
                    api.get(`/admin/guide-engine/forms/${activeFormId}`).then(res => setForm(res.data));
                } catch (err) {
                    console.error(err);
                    showAlert("Error", "Failed to delete section.");
                }
            }
        );
    };

    const openQuestionModal = (sectionId: number) => {
        setActiveSectionId(sectionId);
        setEditingQuestionId(null);
        setNewQuestionText('');
        setNewQuestionHelpText('');
        setNewQuestionImageBase64('');
        setNewQuestionField('');
        setNewQuestionType('text');
        setNewQuestionOptions([{ label: '', value: '' }]);
        setIsQuestionModalOpen(true);
    };

    const openEditQuestionModal = (sectionId: number, question: any) => {
        setActiveSectionId(sectionId);
        setEditingQuestionId(question.id);
        setNewQuestionText(question.question_text);
        
        let helpText = question.help_text || '';
        let image = '';
        if (helpText.includes('[IMAGE:')) {
            const parts = helpText.split('[IMAGE:');
            helpText = parts[0].trim();
            image = parts[1].replace(']', '');
        }
        setNewQuestionHelpText(helpText);
        setNewQuestionImageBase64(image);
        
        setNewQuestionField(question.field_name);
        setNewQuestionType(question.field_type);
        
        if (question.options && question.options.length > 0) {
            setNewQuestionOptions(question.options.map((opt: any) => ({
                label: opt.option_label,
                value: opt.option_value
            })));
        } else {
            setNewQuestionOptions([{ label: '', value: '' }]);
        }
        
        setIsQuestionModalOpen(true);
    };

    const handleAddQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeSectionId) return;

        try {
            let finalHelpText = newQuestionHelpText;
            if (newQuestionImageBase64) {
                finalHelpText = (finalHelpText + ` [IMAGE:${newQuestionImageBase64}]`).trim();
            }

            const payload: any = {
                question_text: newQuestionText,
                help_text: finalHelpText || null,
                field_name: newQuestionField,
                field_type: newQuestionType,
                is_required: true,
                order: 0
            };

            if (newQuestionType === 'radio' || newQuestionType === 'select') {
                payload.options = newQuestionOptions.filter(opt => opt.label && opt.value).map((opt, i) => ({
                    ...opt,
                    order: i
                }));
            }

            if (editingQuestionId) {
                await api.put(`/admin/guide-engine/questions/${editingQuestionId}`, payload);
            } else {
                await api.post(`/admin/guide-engine/sections/${activeSectionId}/questions`, payload);
            }
            
            setIsQuestionModalOpen(false);
            api.get(`/admin/guide-engine/forms/${activeFormId}`).then(res => setForm(res.data));
        } catch (err) {
            console.error(err);
            showAlert("Error", "Failed to add question.");
        }
    };

    const handleDeleteQuestion = (questionId: number) => {
        showConfirm(
            "Delete Question",
            "Are you sure you want to delete this question?",
            async () => {
                try {
                    await api.delete(`/admin/guide-engine/questions/${questionId}`);
                    api.get(`/admin/guide-engine/forms/${activeFormId}`).then(res => setForm(res.data));
                } catch (err) {
                    console.error(err);
                    showAlert("Error", "Failed to delete question.");
                }
            }
        );
    };

    if (loading) {
        return <div className="p-8 text-center text-[#5B6472]">Loading...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-500 font-bold">{error}</div>;
    }

    return (
        <div className="p-8 bg-[#F7F5F0] min-h-screen">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => router.back()} className="text-[#5B6472] hover:text-[#101F38]">
                    &larr; Back
                </button>
                <h1 className="text-2xl font-black text-[#101F38]">Form Builder</h1>
            </div>

            {!form && serviceForms.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Create New Form */}
                    <div className="bg-white p-6 rounded-2xl border border-[#ECE9E2]">
                        <h2 className="text-lg font-bold text-[#101F38] mb-4">Initialize Form</h2>
                        <p className="text-sm text-[#5B6472] mb-6">This service doesn't have a dynamic form attached yet. Let's create one.</p>
                        <form onSubmit={handleCreateForm} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#101F38] mb-1">Form Name</label>
                                <input required value={newFormName} onChange={e => setNewFormName(e.target.value)} placeholder="e.g., I-130 Petition" className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#101F38] mb-1">URL Slug</label>
                                <input required value={newFormSlug} onChange={e => setNewFormSlug(e.target.value)} placeholder="e.g., i-130" className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none" />
                            </div>
                            <button type="submit" disabled={isCreating} className="w-full py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                                {isCreating ? 'Creating...' : 'Create Form'}
                            </button>
                        </form>
                    </div>

                    {/* Connect Existing Form */}
                    <div className="bg-white p-6 rounded-2xl border border-[#ECE9E2]">
                        <h2 className="text-lg font-bold text-[#101F38] mb-4">Connect Existing Form</h2>
                        <p className="text-sm text-[#5B6472] mb-6">Or reuse a form that was created for another service.</p>
                        <form onSubmit={handleConnectForm} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#101F38] mb-1">Select Form</label>
                                <select required value={connectFormId} onChange={e => setConnectFormId(e.target.value)} className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none">
                                    <option value="" disabled>Select an existing form...</option>
                                    {allForms.filter(f => !serviceForms.find(sf => sf.id === f.id)).map(f => (
                                        <option key={f.id} value={f.id}>{f.name} (/{f.slug})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="pt-[62px]">
                                <button type="submit" disabled={isConnecting || !connectFormId} className="w-full py-2 bg-[#1b2559] text-white rounded-lg font-semibold hover:bg-[#101F38] transition-colors disabled:bg-gray-300">
                                    {isConnecting ? 'Connecting...' : 'Connect Form'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Multi-Form Tab Strip */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {serviceForms.map(f => (
                            <button 
                                key={f.id}
                                onClick={() => { setActiveFormId(f.id); setShowCreateForm(false); }}
                                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${activeFormId === f.id && !showCreateForm ? 'bg-[#101F38] text-white border-[#101F38]' : 'bg-white text-[#5B6472] border-[#ECE9E2] hover:bg-gray-50'}`}
                            >
                                {f.name}
                            </button>
                        ))}
                        <button 
                            onClick={() => setShowCreateForm(true)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold border border-dashed transition-colors ${showCreateForm ? 'bg-orange-50 text-orange-600 border-orange-500' : 'bg-transparent text-orange-500 border-orange-500 hover:bg-orange-50'}`}
                        >
                            + Add Another Form
                        </button>
                    </div>

                    {showCreateForm ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Create New Form */}
                            <div className="bg-white p-6 rounded-2xl border border-[#ECE9E2]">
                                <h2 className="text-lg font-bold text-[#101F38] mb-4">Create New Form</h2>
                                <p className="text-sm text-[#5B6472] mb-6">Create a brand new form for this service.</p>
                                <form onSubmit={handleCreateForm} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#101F38] mb-1">Form Name</label>
                                        <input required value={newFormName} onChange={e => setNewFormName(e.target.value)} placeholder="e.g., I-485 Green Card" className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#101F38] mb-1">URL Slug</label>
                                        <input required value={newFormSlug} onChange={e => setNewFormSlug(e.target.value)} placeholder="e.g., i-485" className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setShowCreateForm(false)} className="w-1/3 py-2 bg-gray-100 text-[#5B6472] rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={isCreating} className="w-2/3 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                                            {isCreating ? 'Creating...' : 'Create Form'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Connect Existing Form */}
                            <div className="bg-white p-6 rounded-2xl border border-[#ECE9E2]">
                                <h2 className="text-lg font-bold text-[#101F38] mb-4">Connect Existing Form</h2>
                                <p className="text-sm text-[#5B6472] mb-6">Reuse a form that was created for another service.</p>
                                <form onSubmit={handleConnectForm} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#101F38] mb-1">Select Form</label>
                                        <select required value={connectFormId} onChange={e => setConnectFormId(e.target.value)} className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none">
                                            <option value="" disabled>Select an existing form...</option>
                                            {allForms.filter(f => !serviceForms.find(sf => sf.id === f.id)).map(f => (
                                                <option key={f.id} value={f.id}>{f.name} (/{f.slug})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex gap-2 pt-[62px]">
                                        <button type="button" onClick={() => setShowCreateForm(false)} className="w-1/3 py-2 bg-gray-100 text-[#5B6472] rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={isConnecting || !connectFormId} className="w-2/3 py-2 bg-[#1b2559] text-white rounded-lg font-semibold hover:bg-[#101F38] transition-colors disabled:bg-gray-300">
                                            {isConnecting ? 'Connecting...' : 'Connect Form'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : form && (
                        <>
                            <div className="bg-white p-6 rounded-2xl border border-[#ECE9E2] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-[#101F38] flex items-center gap-2">
                                        {form.name}
                                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">Shared across {form.services?.length || 1} services</span>
                                    </h2>
                                    <p className="text-sm text-[#5B6472]">Slug: /{form.slug}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleUnlinkForm(form.id)} className="px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">
                                        Unlink Form
                                    </button>
                                    <button onClick={openSectionModal} className="px-4 py-2 bg-[#1b2559] text-white rounded-lg text-sm font-semibold hover:bg-[#101F38] transition-colors">
                                        + Add Section (Step)
                                    </button>
                                </div>
                            </div>

                    {(!form.sections || form.sections.length === 0) ? (
                        <div className="text-center p-8 text-[#5B6472] bg-white rounded-2xl border border-[#ECE9E2]">
                            <p>No sections added yet. Click "Add Section" to create your first step.</p>
                            {/* Debug info in case sections is undefined but shouldn't be */}
                            <pre className="mt-4 text-xs text-left bg-gray-100 p-4 rounded overflow-auto">
                                {JSON.stringify(form, null, 2)}
                            </pre>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {form.sections.map((section: any, index: number) => (
                                <div key={section.id} className="bg-white rounded-2xl border border-[#ECE9E2] overflow-hidden shadow-sm">
                                    <div className="bg-[#F8F9FA] px-6 py-4 border-b border-[#ECE9E2] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                        <h3 className="font-bold text-[#101F38]">Step {index + 1}: {section.title}</h3>
                                        <div className="flex gap-2">
                                            <button onClick={() => openQuestionModal(section.id)} className="px-3 py-1.5 bg-orange-500 text-white rounded-md text-xs font-semibold hover:bg-orange-600">
                                                + Add Question
                                            </button>
                                            <button onClick={() => handleDeleteSection(section.id)} className="px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-md text-xs font-semibold">
                                                Delete Section
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6">
                                        {section.questions?.length === 0 ? (
                                            <p className="text-sm text-[#5B6472] italic text-center py-4">No questions in this section yet.</p>
                                        ) : (
                                            <div className="space-y-4">
                                                {section.questions?.map((q: any) => (
                                                    <div key={q.id} className="border border-[#ECE9E2] rounded-xl p-4 hover:border-orange-500/30 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                                        <div>
                                                            <p className="font-bold text-[#101F38] mb-1">{q.question_text}</p>
                                                            <div className="flex flex-wrap gap-2 text-xs text-[#5B6472] mt-2">
                                                                <span className="bg-gray-100 px-2 py-0.5 rounded">Field: {q.field_name}</span>
                                                                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Type: {q.field_type}</span>
                                                                {q.is_required && <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded">Required</span>}
                                                            </div>
                                                            {q.options && q.options.length > 0 && (
                                                                <div className="mt-3 flex flex-wrap gap-2">
                                                                    {q.options.map((opt: any, idx: number) => (
                                                                        <span key={idx} className="bg-orange-50 text-orange-800 text-[11px] px-2 py-1 rounded border border-orange-100">
                                                                            <span className="font-semibold">{opt.option_label}</span> <span className="text-orange-400">({opt.option_value})</span>
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => openEditQuestionModal(section.id, q)} className="text-[#9CA3AF] hover:text-blue-500 transition-colors" title="Edit Question">
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                            </button>
                                                            <button onClick={() => handleDeleteQuestion(q.id)} className="text-[#9CA3AF] hover:text-red-500 transition-colors" title="Delete Question">
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    </>
                )}
                </div>
            )}

            {/* Section Modal */}
            {isSectionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101F38]/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-[#ECE9E2] flex justify-between items-center">
                            <h3 className="text-lg font-bold text-[#101F38]">Add New Section</h3>
                            <button onClick={() => setIsSectionModalOpen(false)} className="text-[#9CA3AF] hover:text-[#101F38]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddSectionSubmit} className="p-6">
                            <label className="block text-sm font-semibold text-[#101F38] mb-2">Section Title</label>
                            <input autoFocus required value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} placeholder="e.g. Personal Information" className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none mb-6" />
                            
                            <div className="flex gap-3 justify-end">
                                <button type="button" onClick={() => setIsSectionModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-[#5B6472] bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600">Save Section</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Question Modal */}
            {isQuestionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101F38]/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-[#ECE9E2] flex justify-between items-center shrink-0">
                            <h3 className="text-lg font-bold text-[#101F38]">{editingQuestionId ? 'Edit Question' : 'Add New Question'}</h3>
                            <button onClick={() => setIsQuestionModalOpen(false)} className="text-[#9CA3AF] hover:text-[#101F38]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <form id="question-form" onSubmit={handleAddQuestionSubmit} className="flex flex-col overflow-hidden min-h-[300px]">
                            <div className="p-6 overflow-y-auto overflow-x-hidden">
                                <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#101F38] mb-1">Question Text</label>
                                    <input autoFocus required value={newQuestionText} onChange={e => setNewQuestionText(e.target.value)} placeholder="e.g. What is your height?" className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#101F38] mb-1">Help Text (Optional)</label>
                                    <textarea value={newQuestionHelpText} onChange={e => setNewQuestionHelpText(e.target.value)} placeholder="e.g. Please enter your full legal name." className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none h-20 resize-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#101F38] mb-1">Helper Image (Optional)</label>
                                    {newQuestionImageBase64 && (
                                        <div className="mb-3 relative inline-block">
                                            <img src={newQuestionImageBase64} alt="Helper Preview" className="max-h-32 rounded-lg border border-[#ECE9E2]" />
                                            <button 
                                                type="button"
                                                onClick={() => setNewQuestionImageBase64('')}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                                                title="Remove Image"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                            </button>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setNewQuestionImageBase64(reader.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                        e.target.value = '';
                                    }} className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#101F38] mb-1">Field Name (Backend Key)</label>
                                    <input required value={newQuestionField} onChange={e => setNewQuestionField(e.target.value)} placeholder="e.g. heightValue" className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none font-mono" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#101F38] mb-1">Field Type</label>
                                    <select required value={newQuestionType} onChange={e => setNewQuestionType(e.target.value)} className="w-full border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none">
                                        <option value="text">Short Text</option>
                                        <option value="date">Date</option>
                                        <option value="radio">Radio Buttons (Single Choice)</option>
                                        <option value="select">Dropdown Menu</option>
                                    </select>
                                </div>

                                {(newQuestionType === 'radio' || newQuestionType === 'select') && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <label className="block text-sm font-semibold text-[#101F38] mb-2">Options</label>
                                        {newQuestionOptions.map((opt, i) => (
                                            <div key={i} className="flex flex-col sm:flex-row gap-2 mb-2 sm:items-center">
                                                <input required placeholder="Label (e.g. Male)" value={opt.label} onChange={(e) => {
                                                    const copy = [...newQuestionOptions];
                                                    copy[i].label = e.target.value;
                                                    setNewQuestionOptions(copy);
                                                }} className="flex-1 border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm outline-none" />
                                                <input required placeholder="Value (e.g. M)" value={opt.value} onChange={(e) => {
                                                    const copy = [...newQuestionOptions];
                                                    copy[i].value = e.target.value;
                                                    setNewQuestionOptions(copy);
                                                }} className="flex-1 border border-[#ECE9E2] rounded-lg px-3 py-2 text-sm outline-none font-mono" />
                                                <button type="button" onClick={() => setNewQuestionOptions(newQuestionOptions.filter((_, idx) => idx !== i))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setNewQuestionOptions([...newQuestionOptions, { label: '', value: '' }])} className="text-sm font-semibold text-orange-500 hover:underline mt-2">
                                            + Add Option
                                        </button>
                                    </div>
                                )}
                                </div>
                            </div>
                            <div className="p-6 border-t border-[#ECE9E2] bg-gray-50 flex gap-3 justify-end shrink-0">
                                <button type="button" onClick={() => setIsQuestionModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-[#5B6472] bg-white border border-[#ECE9E2] rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600">{editingQuestionId ? 'Update Question' : 'Save Question'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Dialog Modal */}
            {dialogState.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#101F38]/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden transform transition-all">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-[#101F38] mb-2">{dialogState.title}</h3>
                            <p className="text-[#5B6472] text-sm">{dialogState.message}</p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-[#ECE9E2] flex gap-3 justify-end">
                            {dialogState.type === 'confirm' && (
                                <button 
                                    onClick={closeDialog} 
                                    className="px-4 py-2 text-sm font-semibold text-[#5B6472] bg-white border border-[#ECE9E2] rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                            <button 
                                onClick={() => {
                                    if (dialogState.type === 'confirm' && dialogState.onConfirm) {
                                        dialogState.onConfirm();
                                    }
                                    closeDialog();
                                }} 
                                className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                {dialogState.type === 'confirm' ? 'Confirm' : 'OK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function FormBuilderPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-[#5B6472]">Loading builder...</div>}>
            <FormBuilderContent />
        </Suspense>
    );
}
