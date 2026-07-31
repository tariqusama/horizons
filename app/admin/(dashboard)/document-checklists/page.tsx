"use client";

import React, { useState, useEffect } from 'react';
import { getAdminChecklists, createAdminChecklist, updateAdminChecklist, deleteAdminChecklist, Checklist } from '../../../../lib/api/admin-checklists';

const Icon = {
    fileText: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>,
    plus: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    edit: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>,
    trash: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    refresh: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path></svg>,
};

function ChecklistModal({
    isOpen,
    onClose,
    onSave,
    checklist = null
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Checklist>) => Promise<void>;
    checklist?: Checklist | null;
}) {
    const [key, setKey] = useState('');
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [formsText, setFormsText] = useState('');
    const [sections, setSections] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (checklist) {
            setKey(checklist.key);
            setTitle(checklist.title);
            setSubtitle(checklist.subtitle || '');
            setDescription(checklist.description || '');
            setFormsText(checklist.forms ? checklist.forms.join(', ') : '');
            setSections(checklist.sections || []);
        } else {
            setKey('');
            setTitle('');
            setSubtitle('');
            setDescription('');
            setFormsText('');
            setSections([]);
        }
    }, [checklist, isOpen]);

    if (!isOpen) return null;

    const handleAddSection = () => {
        setSections([...sections, { title: 'New Section', documents: [] }]);
    };

    const handleAddDocument = (sectionIdx: number) => {
        const newSections = [...sections];
        newSections[sectionIdx].documents.push({
            id: `doc-${Date.now()}`,
            name: 'New Document',
            description: '',
            required: true,
            status: 'pending'
        });
        setSections(newSections);
    };

    const handleUpdateSectionTitle = (idx: number, title: string) => {
        const newSections = [...sections];
        newSections[idx].title = title;
        setSections(newSections);
    };

    const handleUpdateDocument = (sIdx: number, dIdx: number, field: string, value: any) => {
        const newSections = [...sections];
        newSections[sIdx].documents[dIdx][field] = value;
        setSections(newSections);
    };

    const handleRemoveSection = (idx: number) => {
        const newSections = [...sections];
        newSections.splice(idx, 1);
        setSections(newSections);
    };

    const handleRemoveDocument = (sIdx: number, dIdx: number) => {
        const newSections = [...sections];
        newSections[sIdx].documents.splice(dIdx, 1);
        setSections(newSections);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const forms = formsText.split(',').map(s => s.trim()).filter(Boolean);
            let total_documents = 0;
            sections.forEach(s => { total_documents += s.documents.length; });

            await onSave({
                key, title, subtitle, description, forms, sections, total_documents
            });
            onClose();
        } catch (err: any) {
            console.error(err);
            alert("Failed to save: " + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-900">{checklist ? 'Edit Checklist' : 'Create Checklist'}</h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <form id="checklist-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-900 mb-1">Key Identifier (Unique)</label>
                            <input required value={key} onChange={e => setKey(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="e.g. spouse_abroad" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-900 mb-1">Title</label>
                            <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="e.g. Spouse Visa Checklist" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-900 mb-1">Subtitle (Optional)</label>
                            <input value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-900 mb-1">Forms (Comma separated)</label>
                            <input value={formsText} onChange={e => setFormsText(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="e.g. I-130, I-485" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-900 mb-1">Description (Optional)</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500" rows={2} />
                    </div>

                    <div className="border-t border-slate-200 pt-6 mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-slate-900">Checklist Sections & Documents</h3>
                            <button type="button" onClick={handleAddSection} className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1">
                                <Icon.plus className="w-4 h-4" /> Add Section
                            </button>
                        </div>

                        <div className="space-y-4">
                            {sections.map((section, sIdx) => (
                                <div key={sIdx} className="border border-slate-200 rounded-lg bg-slate-50 p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <input 
                                            value={section.title} 
                                            onChange={e => handleUpdateSectionTitle(sIdx, e.target.value)}
                                            className="font-semibold text-slate-900 bg-transparent border-b border-transparent focus:border-orange-500 focus:outline-none px-1 py-0.5"
                                        />
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => handleAddDocument(sIdx)} className="text-xs font-medium text-blue-600 hover:text-blue-700 px-2 py-1 rounded bg-blue-50">Add Document</button>
                                            <button type="button" onClick={() => handleRemoveSection(sIdx)} className="text-xs text-red-600 hover:text-red-700 px-2 py-1"><Icon.trash className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        {section.documents.map((doc: any, dIdx: number) => (
                                            <div key={dIdx} className="flex flex-wrap md:flex-nowrap gap-3 items-start bg-white p-3 rounded border border-slate-200 shadow-sm">
                                                <div className="flex-1 min-w-[200px]">
                                                    <input 
                                                        value={doc.name} 
                                                        onChange={e => handleUpdateDocument(sIdx, dIdx, 'name', e.target.value)}
                                                        className="w-full text-sm font-medium text-slate-900 border-none p-0 focus:ring-0 mb-1"
                                                        placeholder="Document Name"
                                                    />
                                                    <input 
                                                        value={doc.description || ''} 
                                                        onChange={e => handleUpdateDocument(sIdx, dIdx, 'description', e.target.value)}
                                                        className="w-full text-xs text-slate-500 border-none p-0 focus:ring-0"
                                                        placeholder="Description (Optional)"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-4 mt-2 md:mt-0">
                                                    <label className="flex items-center gap-2 text-sm text-slate-700">
                                                        <input type="checkbox" checked={doc.required} onChange={e => handleUpdateDocument(sIdx, dIdx, 'required', e.target.checked)} className="rounded text-orange-500 focus:ring-orange-500" />
                                                        Required
                                                    </label>
                                                    <button type="button" onClick={() => handleRemoveDocument(sIdx, dIdx)} className="text-red-500 hover:text-red-600"><Icon.trash className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        ))}
                                        {section.documents.length === 0 && (
                                            <div className="text-xs text-slate-500 text-center py-2 italic">No documents in this section</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                    <button type="submit" form="checklist-form" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg disabled:opacity-50 flex items-center gap-2">
                        {saving ? 'Saving...' : 'Save Checklist'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function DocumentChecklistsPage() {
    const [checklists, setChecklists] = useState<Checklist[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChecklist, setEditingChecklist] = useState<Checklist | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getAdminChecklists();
            setChecklists(data || []);
        } catch (error) {
            console.error('Failed to load checklists:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveChecklist = async (data: Partial<Checklist>) => {
        if (editingChecklist) {
            await updateAdminChecklist(editingChecklist.id, data);
        } else {
            await createAdminChecklist(data);
        }
        await loadData();
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this checklist?")) {
            await deleteAdminChecklist(id);
            await loadData();
        }
    };

    return (
        <main className="flex-1 px-4 sm:px-6 pb-8 pt-2 bg-slate-50">
            <div className="mb-6 px-1 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Document Checklists</h1>
                    <p className="text-sm text-slate-600 mt-1">Manage required documents for different services</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">All Checklists</h2>
                    <div className="flex gap-3">
                        <button onClick={loadData} className="text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 p-2">
                            <Icon.refresh className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => { setEditingChecklist(null); setIsModalOpen(true); }}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-orange-600 rounded-lg px-4 py-2 hover:bg-orange-700 transition-colors"
                        >
                            <Icon.plus className="h-4 w-4" />
                            Create Checklist
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                        <div className="col-span-2 text-center py-12 text-slate-500">Loading checklists...</div>
                    ) : checklists.length === 0 ? (
                        <div className="col-span-2 text-center py-12 text-slate-500 bg-white rounded-lg border border-slate-200">
                            No checklists found. Create one to get started.
                        </div>
                    ) : (
                        checklists.map((cl) => (
                            <div key={cl.id} className="rounded-lg border border-slate-200 bg-white shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                            <Icon.fileText className="h-5 w-5 text-orange-500" />
                                            {cl.title}
                                        </h3>
                                        <div className="flex gap-1">
                                            <button onClick={() => { setEditingChecklist(cl); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded" title="Edit">
                                                <Icon.edit className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(cl.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Delete">
                                                <Icon.trash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {cl.subtitle && <p className="text-sm font-medium text-slate-700 mb-1">{cl.subtitle}</p>}
                                    {cl.description && <p className="text-sm text-slate-500 line-clamp-2">{cl.description}</p>}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">Key: {cl.key}</span>
                                        <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-800">{cl.total_documents} Documents</span>
                                        {cl.forms && cl.forms.length > 0 && (
                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-800">Forms: {cl.forms.join(', ')}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <ChecklistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveChecklist}
                checklist={editingChecklist}
            />
        </main>
    );
}
