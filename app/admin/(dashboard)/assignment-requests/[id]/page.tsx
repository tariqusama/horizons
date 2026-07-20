'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAssignmentRequest, AssignmentRequest } from '@/lib/api/cases';

export default function AssignmentRequestDetail({ params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);
    const router = useRouter();
    const [request, setRequest] = useState<AssignmentRequest | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getAssignmentRequest(id);
                setRequest(data);
            } catch (err) {
                console.error('Failed to load assignment request', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return (
        <div className="max-w-[1000px] mx-auto w-full py-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E3755D] mx-auto mb-4"></div>
            <p className="text-sm text-[#5B6472]">Loading request...</p>
        </div>
    );

    if (!request) return (
        <div className="max-w-[1000px] mx-auto w-full py-12 text-center">
            <p className="text-sm text-red-600">Assignment request not found.</p>
            <Link href="/admin/assignment-requests" className="text-sm text-[#E3755D] font-semibold">Back</Link>
        </div>
    );

    return (
        <div className="max-w-[1000px] mx-auto w-full pb-12">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-[#101F38]">Assignment Request #{request.id}</h1>
                    <p className="text-sm text-[#5B6472]">Requested for application {request.application?.receipt_number || request.application_id}</p>
                </div>
                <Link href="/admin/assignment-requests" className="text-sm text-[#E3755D] font-semibold">← Back to list</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-[#ECE9E2] bg-white p-6">
                    <h3 className="text-sm font-bold text-[#101F38] mb-2">Requester</h3>
                    <p className="text-sm text-[#5B6472]">{request.manager?.name || 'Unknown'}</p>
                    <p className="text-xs text-[#8A8F98] mt-1">{request.manager?.email}</p>
                </div>

                <div className="rounded-2xl border border-[#ECE9E2] bg-white p-6">
                    <h3 className="text-sm font-bold text-[#101F38] mb-2">Application</h3>
                    <p className="text-sm text-[#5B6472]">{request.application?.title || 'Application'}</p>
                    <p className="text-xs text-[#8A8F98] mt-1">{request.application?.user?.name}</p>
                </div>

                <div className="rounded-2xl border border-[#ECE9E2] bg-white p-6">
                    <h3 className="text-sm font-bold text-[#101F38] mb-2">Status</h3>
                    <p className="text-sm text-[#5B6472]">{request.status}</p>
                    <p className="text-xs text-[#8A8F98] mt-1">Created {new Date(request.created_at).toLocaleString()}</p>
                </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[#ECE9E2] bg-white p-6">
                <h3 className="text-sm font-bold text-[#101F38] mb-2">Notes</h3>
                <p className="text-sm text-[#5B6472]">{request.notes || 'No notes provided.'}</p>
            </div>
        </div>
    );
}
