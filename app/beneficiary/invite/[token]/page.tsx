'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getBeneficiaryInvite, saveBeneficiaryInvite } from '@/lib/api/cases';

interface BeneficiaryInviteResponse {
  application: {
    id: number;
    title: string | null;
    package_name: string | null;
    subtitle: string | null;
    receipt_number: string | null;
  };
  invite: {
    email: string;
    message?: string;
    status?: string;
    invited_at?: string;
    completed_at?: string;
  };
}

export default function BeneficiaryInvitePage() {
  const params = useParams();
  const token = params?.token as string | undefined;

  const [inviteData, setInviteData] = useState<BeneficiaryInviteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [countryOfBirth, setCountryOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid invite link.');
      setLoading(false);
      return;
    }

    const loadInvite = async () => {
      try {
        setLoading(true);
        const response = await getBeneficiaryInvite(token);
        setInviteData(response);
      } catch (err: any) {
        const message = err?.response?.data?.message || 'Unable to load invite details. Please verify the link or contact your manager.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadInvite();
  }, [token]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inviteData) return;
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await saveBeneficiaryInvite(token!, {
        email: inviteData.invite.email,
        fullName: fullName.trim(),
        dob: dob.trim() || undefined,
        countryOfBirth: countryOfBirth.trim() || undefined,
        phone: phone.trim() || undefined,
        additionalInfo: additionalInfo.trim() || undefined,
      });
      setSuccess('Your beneficiary intake has been submitted successfully. Thank you!');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Unable to submit your intake at this time. Please try again later.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 px-6 py-8 sm:px-10">
            <h1 className="text-3xl font-black text-white">Beneficiary Intake Invitation</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300 max-w-2xl">
              Complete the beneficiary portion of your intake and submit it securely.
            </p>
          </div>

          <div className="px-6 py-8 sm:px-10">
            {loading && (
              <div className="rounded-3xl bg-slate-100 p-8 text-center text-slate-600">
                Loading invitation details...
              </div>
            )}

            {!loading && error && (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                <p className="font-semibold">Unable to load this invitation</p>
                <p className="mt-2">{error}</p>
              </div>
            )}

            {!loading && inviteData && (
              <div className="space-y-8">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Case Details</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-500">Case</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{inviteData.application.title || 'Untitled case'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Package</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{inviteData.application.package_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Subtitle</p>
                      <p className="mt-1 text-sm text-slate-900">{inviteData.application.subtitle || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Reference</p>
                      <p className="mt-1 text-sm text-slate-900">{inviteData.application.receipt_number || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Invited beneficiary</p>
                  <p className="mt-3 text-sm text-slate-900">You have been invited with the email address:</p>
                  <p className="mt-2 rounded-2xl bg-white border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900">{inviteData.invite.email}</p>
                  {inviteData.invite.message && (
                    <div className="mt-4 rounded-3xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                      <p className="font-semibold">Manager message</p>
                      <p className="mt-2 whitespace-pre-line">{inviteData.invite.message}</p>
                    </div>
                  )}
                </div>

                {success ? (
                  <div className="rounded-3xl border border-green-200 bg-green-50 p-6 text-sm text-green-800">
                    <p className="font-semibold">Submission complete</p>
                    <p className="mt-2">{success}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error ? (
                      <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                      </div>
                    ) : null}

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">Full Name</label>
                        <input
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          type="text"
                          placeholder="Enter your full name"
                          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">Date of Birth</label>
                        <input
                          value={dob}
                          onChange={e => setDob(e.target.value)}
                          type="date"
                          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">Country of Birth</label>
                        <input
                          value={countryOfBirth}
                          onChange={e => setCountryOfBirth(e.target.value)}
                          type="text"
                          placeholder="Country of birth"
                          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">Phone Number</label>
                        <input
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          type="tel"
                          placeholder="Phone number"
                          className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">Additional Information</label>
                      <textarea
                        value={additionalInfo}
                        onChange={e => setAdditionalInfo(e.target.value)}
                        rows={4}
                        placeholder="Any additional context you want the manager to know."
                        className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      />
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      <p className="font-semibold">Next step</p>
                      <p className="mt-2">After submitting, your manager will receive the completed beneficiary intake and can continue processing the case.</p>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {submitting ? 'Submitting...' : 'Submit Intake'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
