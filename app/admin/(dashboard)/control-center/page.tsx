"use client";

import React, { useEffect, useState } from 'react';
import { getServices, Service } from '../../../../lib/api/services';

export default function AdminControlCenterPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const [maintenance, setMaintenance] = useState(false);
    const [featureFlags, setFeatureFlags] = useState<{ [key: string]: boolean }>({
        guideEngine: true,
        analyticsExport: false,
    });

    useEffect(() => {
        const loadServices = async () => {
            try {
                const data = await getServices();
                setServices(data || []);
            } catch (err) {
                console.error('Failed to load services', err);
                setMessage('Failed to load services.');
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, []);

    const toggleMaintenance = async () => {
        const next = !maintenance;
        setMaintenance(next);
        setMessage('Updating maintenance mode...');

        try {
            await fetch('/api/admin/system/maintenance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled: next }),
            });
            setMessage(`Maintenance mode ${next ? 'enabled' : 'disabled'}`);
        } catch (err) {
            console.error(err);
            setMessage('Failed to update maintenance mode.');
            setMaintenance(!next);
        }
    };

    const toggleFlag = (key: string) => {
        setFeatureFlags((prev) => ({ ...prev, [key]: !prev[key] }));
        setMessage(`Toggled ${key}.`);
    };

    const runAction = async (action: string) => {
        setMessage(`${action} started...`);
        try {
            await fetch(`/api/admin/system/${action}`, { method: 'POST' });
            setMessage(`${action} completed.`);
        } catch (err) {
            console.error(err);
            setMessage(`${action} failed.`);
        }
    };

    return (
        <div className="max-w-[1100px] mx-auto w-full pb-12">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-[#101F38] mb-2">Control Center</h1>
                <p className="text-sm text-[#5B6472]">Operational controls for Horizon admin tasks: feature flags, maintenance mode, and quick system actions.</p>
            </div>

            {message && (
                <div className="mb-4 rounded-lg bg-[#F3F4F6] p-3 text-sm text-[#111827]">{message}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="rounded-2xl border border-[#ECE9E2] bg-white p-5">
                    <h3 className="font-bold mb-2">System status</h3>
                    <p className="text-xs text-[#5B6472] mb-3">Services catalog</p>
                    {loading ? (
                        <p className="text-sm text-[#5B6472]">Loading…</p>
                    ) : (
                        <p className="text-lg font-black text-[#101F38]">{services.length} services</p>
                    )}
                    <div className="mt-4 flex gap-2 flex-wrap">
                        <button onClick={() => runAction('clear-cache')} className="px-3 py-2 rounded-full bg-[#E3755D] text-white text-sm">Clear cache</button>
                        <button onClick={() => runAction('reindex')} className="px-3 py-2 rounded-full border border-[#ECE9E2] text-sm">Reindex</button>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#ECE9E2] bg-white p-5">
                    <h3 className="font-bold mb-2">Maintenance mode</h3>
                    <p className="text-xs text-[#5B6472] mb-3">Toggle site-wide maintenance mode for emergency operations.</p>
                    <div className="flex items-center gap-3">
                        <button onClick={toggleMaintenance} className={`px-4 py-2 rounded-full text-sm ${maintenance ? 'bg-red-600 text-white' : 'bg-white border border-[#ECE9E2]'}`}>
                            {maintenance ? 'Disable' : 'Enable'} maintenance
                        </button>
                        <span className="text-sm text-[#5B6472]">{maintenance ? 'Maintenance enabled' : 'Live'}</span>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#ECE9E2] bg-white p-5">
                    <h3 className="font-bold mb-2">Feature flags</h3>
                    <p className="text-xs text-[#5B6472] mb-3">Toggle experimental features for testing.</p>
                    <div className="space-y-2">
                        {Object.keys(featureFlags).map((key) => (
                            <div key={key} className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold">{key}</p>
                                    <p className="text-xs text-[#5B6472]">{featureFlags[key] ? 'Enabled' : 'Disabled'}</p>
                                </div>
                                <button onClick={() => toggleFlag(key)} className={`px-3 py-1 rounded-full text-sm ${featureFlags[key] ? 'bg-[#185FA5] text-white' : 'bg-white border border-[#ECE9E2]'}`}>
                                    {featureFlags[key] ? 'On' : 'Off'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-[#ECE9E2] bg-white p-6">
                <h3 className="font-bold mb-3">Quick actions</h3>
                <p className="text-xs text-[#5B6472] mb-4">Run housekeeping and operational tasks.</p>
                <div className="flex flex-wrap gap-3">
                    <button onClick={() => runAction('sync-services')} className="px-4 py-2 rounded-full bg-[#0C447C] text-white text-sm">Sync services</button>
                    <button onClick={() => runAction('export-analytics')} className="px-4 py-2 rounded-full border border-[#ECE9E2] text-sm">Export analytics</button>
                    <button onClick={() => runAction('prune-jobs')} className="px-4 py-2 rounded-full border border-[#ECE9E2] text-sm">Prune jobs</button>
                </div>
            </div>
        </div>
    );
}
