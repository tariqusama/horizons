"use client";

import React, { useState, useEffect } from 'react';
import { getSignupGoals, createSignupGoal, updateSignupGoal, deleteSignupGoal, createSignupQuestion, updateSignupQuestion, deleteSignupQuestion, SignupGoal, SignupQuestion } from '../../../../lib/api/signup-setup';

const Icon = {
    target: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
    plus: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    edit: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>,
    trash: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    chevronDown: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="6 9 12 15 18 9"></polyline></svg>,
    chevronUp: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="18 15 12 9 6 15"></polyline></svg>,
};

function GoalModal({
    isOpen,
    onClose,
    onSave,
    goal = null
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<SignupGoal>) => Promise<void>;
    goal?: SignupGoal | null;
}) {
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [orderIndex, setOrderIndex] = useState(0);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (goal) {
            setTitle(goal.title);
            setImageUrl(goal.image_url || '');
            setOrderIndex(goal.order_index);
        } else {
            setTitle('');
            setImageUrl('');
            setOrderIndex(0);
        }
    }, [goal, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave({ title, image_url: imageUrl || null, order_index: orderIndex });
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to save.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900">{goal ? 'Edit Goal' : 'Add Goal'}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-900 mb-1">Title</label>
                        <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Become a U.S. Citizen" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-900 mb-1">Image URL (Optional)</label>
                        <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="/assets/images/goal.png" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-900 mb-1">Order Index</label>
                        <input required type="number" value={orderIndex} onChange={e => setOrderIndex(parseInt(e.target.value))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function QuestionModal({
    isOpen,
    onClose,
    onSave,
    question = null
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<SignupQuestion>) => Promise<void>;
    question?: SignupQuestion | null;
}) {
    const [questionText, setQuestionText] = useState('');
    const [optionsText, setOptionsText] = useState('');
    const [disqualifyingText, setDisqualifyingText] = useState('');
    const [skipToEndText, setSkipToEndText] = useState('');
    const [orderIndex, setOrderIndex] = useState(0);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (question) {
            setQuestionText(question.question_text);
            setOptionsText(question.options ? question.options.join(', ') : '');
            setDisqualifyingText(question.disqualifying_options ? question.disqualifying_options.join(', ') : '');
            setSkipToEndText(question.skip_to_end_options ? question.skip_to_end_options.join(', ') : '');
            setOrderIndex(question.order_index);
        } else {
            setQuestionText('');
            setOptionsText('');
            setDisqualifyingText('');
            setSkipToEndText('');
            setOrderIndex(0);
        }
    }, [question, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const options = optionsText.split(',').map(s => s.trim()).filter(Boolean);
            const disqualifying = disqualifyingText.split(',').map(s => s.trim()).filter(Boolean);
            const skipToEnd = skipToEndText.split(',').map(s => s.trim()).filter(Boolean);

            await onSave({
                question_text: questionText,
                options: options.length > 0 ? options : null,
                disqualifying_options: disqualifying.length > 0 ? disqualifying : null,
                skip_to_end_options: skipToEnd.length > 0 ? skipToEnd : null,
                order_index: orderIndex
            });
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to save.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900">{question ? 'Edit Question' : 'Add Question'}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label className="block text-xs font-semibold text-slate-900 mb-1">Question Text</label>
                        <input required value={questionText} onChange={e => setQuestionText(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Are you married?" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-900 mb-1">Options (Comma separated)</label>
                        <input value={optionsText} onChange={e => setOptionsText(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="Yes, No" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-900 mb-1">Disqualifying Options (Comma separated)</label>
                        <input value={disqualifyingText} onChange={e => setDisqualifyingText(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. No" />
                        <p className="text-xs text-slate-500 mt-1">If the user selects one of these, they will be disqualified.</p>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-900 mb-1">Skip-to-End Options (Comma separated)</label>
                        <input value={skipToEndText} onChange={e => setSkipToEndText(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Yes" />
                        <p className="text-xs text-slate-500 mt-1">If the user selects one of these, they will skip the rest of the questions.</p>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-900 mb-1">Order Index</label>
                        <input required type="number" value={orderIndex} onChange={e => setOrderIndex(parseInt(e.target.value))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function SignupSetupPage() {
    const [goals, setGoals] = useState<SignupGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedGoals, setExpandedGoals] = useState<Record<number, boolean>>({});

    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<SignupGoal | null>(null);

    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<SignupQuestion | null>(null);
    const [activeGoalId, setActiveGoalId] = useState<number | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<{
        type: 'goal' | 'question';
        id: number;
        message: string;
    } | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getSignupGoals();
            setGoals(data || []);

            // Auto expand all goals initially
            if (Object.keys(expandedGoals).length === 0 && data) {
                const initExpanded: any = {};
                data.forEach(g => { initExpanded[g.id] = true; });
                setExpandedGoals(initExpanded);
            }
        } catch (error) {
            console.error('Failed to load goals:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id: number) => {
        setExpandedGoals(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Goal Handlers
    const handleSaveGoal = async (data: Partial<SignupGoal>) => {
        if (editingGoal) {
            await updateSignupGoal(editingGoal.id, data);
        } else {
            await createSignupGoal(data);
        }
        await loadData();
    };

    const handleDeleteGoal = async (id: number) => {
        setDeleteTarget({
            type: 'goal',
            id,
            message: 'Are you sure you want to delete this goal and all its questions?',
        });
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            if (deleteTarget.type === 'goal') {
                await deleteSignupGoal(deleteTarget.id);
            } else {
                await deleteSignupQuestion(deleteTarget.id);
            }
            await loadData();
        } catch (error) {
            console.error('Delete failed:', error);
        } finally {
            setDeleteTarget(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteTarget(null);
    };

    // Question Handlers
    const handleSaveQuestion = async (data: Partial<SignupQuestion>) => {
        if (editingQuestion) {
            await updateSignupQuestion(editingQuestion.id, data);
        } else if (activeGoalId) {
            await createSignupQuestion(activeGoalId, data);
        }
        await loadData();
    };

    const handleDeleteQuestion = async (id: number) => {
        setDeleteTarget({
            type: 'question',
            id,
            message: 'Are you sure you want to delete this question?',
        });
    };

    const openAddQuestion = (goalId: number) => {
        setActiveGoalId(goalId);
        setEditingQuestion(null);
        setIsQuestionModalOpen(true);
    };

    return (
        <main className="flex-1 px-4 sm:px-6 pb-8 pt-2 bg-slate-50">
            <div className="mb-6 px-1 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-end">
                <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-slate-900">Signup Setup</h1>
                    <p className="text-sm text-slate-600 mt-1">Configure user goals and their specific qualifying questions</p>
                </div>
                <button
                    onClick={() => { setEditingGoal(null); setIsGoalModalOpen(true); }}
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                >
                    <Icon.plus className="h-4 w-4" />
                    Add Goal
                </button>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12 text-slate-500">Loading signup setup...</div>
                ) : goals.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-white rounded-lg border border-slate-200">
                        No goals found. Create one to get started.
                    </div>
                ) : (
                    goals.map(goal => (
                        <div key={goal.id} className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="flex flex-col gap-3 p-4 bg-slate-50 border-b border-slate-200 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={() => toggleExpand(goal.id)}>
                                    <button className="text-slate-400 hover:text-slate-600 shrink-0">
                                        {expandedGoals[goal.id] ? <Icon.chevronUp className="w-5 h-5" /> : <Icon.chevronDown className="w-5 h-5" />}
                                    </button>
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 shrink-0">
                                        <Icon.target className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-slate-900 break-words">{goal.title}</h3>
                                        <p className="text-xs text-slate-500">Order: {goal.order_index}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 sm:justify-end">
                                    <button onClick={() => openAddQuestion(goal.id)} className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors">
                                        Add Question
                                    </button>
                                    <button onClick={() => { setEditingGoal(goal); setIsGoalModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="Edit Goal">
                                        <Icon.edit className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDeleteGoal(goal.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Delete Goal">
                                        <Icon.trash className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {expandedGoals[goal.id] && (
                                <div className="p-4 bg-white">
                                    {goal.questions && goal.questions.length > 0 ? (
                                        <div className="space-y-3">
                                            {goal.questions.map(q => (
                                                <div key={q.id} className="flex flex-col gap-3 p-3 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors sm:flex-row sm:justify-between sm:items-start">
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-slate-800 mb-1 break-words">
                                                            <span className="text-slate-400 mr-2">#{q.order_index}</span>
                                                            {q.question_text}
                                                        </p>
                                                        <div className="flex flex-wrap gap-2 text-xs">
                                                            {q.options && q.options.length > 0 && (
                                                                <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Options: {q.options.join(', ')}</span>
                                                            )}
                                                            {q.disqualifying_options && q.disqualifying_options.length > 0 && (
                                                                <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded">Disqualifies: {q.disqualifying_options.join(', ')}</span>
                                                            )}
                                                            {q.skip_to_end_options && q.skip_to_end_options.length > 0 && (
                                                                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Skip on: {q.skip_to_end_options.join(', ')}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 self-end sm:self-auto">
                                                        <button onClick={() => { setEditingQuestion(q); setIsQuestionModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded">
                                                            <Icon.edit className="h-4 w-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteQuestion(q.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded">
                                                            <Icon.trash className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-500 italic py-2">No questions defined for this goal.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <GoalModal
                isOpen={isGoalModalOpen}
                onClose={() => setIsGoalModalOpen(false)}
                onSave={handleSaveGoal}
                goal={editingGoal}
            />

            <QuestionModal
                isOpen={isQuestionModalOpen}
                onClose={() => setIsQuestionModalOpen(false)}
                onSave={handleSaveQuestion}
                question={editingQuestion}
            />

            {deleteTarget && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_40px_120px_-40px_rgba(15,23,42,0.55)]">
                        <div className="relative overflow-hidden pb-10">
                            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500" />
                            <div className="relative px-6 pt-10 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg shadow-slate-900/10">
                                    <span className="text-3xl">⚠️</span>
                                </div>
                                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/85 mb-3">Confirm Delete</p>
                                <h2 className="text-3xl font-semibold text-white mb-2">Are you sure?</h2>
                                <p className="mx-auto max-w-xl text-sm leading-7 text-white/80">{deleteTarget.message}</p>
                            </div>
                        </div>
                        <div className="space-y-3 bg-slate-50 px-6 pb-6 pt-4 sm:flex sm:items-center sm:justify-end sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={handleCancelDelete}
                                className="w-full sm:w-auto rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:from-rose-600 hover:to-pink-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
