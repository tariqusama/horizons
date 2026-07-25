import React from 'react';
import Link from 'next/link';

const includedFeatures = [
  'Everything in Basic Plan',
  'Certified translation services',
  'Legal review by an immigration attorney',
  'Priority support with 24-hour response time',
  'Phone support for real-time assistance',
];

const additionalServices = [
  {
    name: 'Document Translation (per page)',
    description: 'Professional translation of additional document pages',
    price: '$25',
  },
  {
    name: 'Certified Copy & E-Notary',
    description: 'Certified copies of your documents, Electronic notary services',
    price: '$15',
  },
  {
    name: 'Expedited Form Preparation (48hrs)',
    description: 'Priority preparation of the full application packet',
    price: '$100',
  },
];

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed left-4 top-4 z-20">
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back
        </Link>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 pb-8 pt-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border-2 border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900">Your Order</h3>
                <p className="text-sm text-gray-600">Review your selected plan and services</p>
              </div>

              <div className="space-y-6 p-6">
                <div className="rounded-lg border border-orange-200 bg-orange-50/80 p-4">
                  <h3 className="mb-2 font-semibold text-orange-600">Account Information</h3>
                  <p className="text-sm text-gray-700">Shahryar Shafique</p>
                  <p className="text-sm text-gray-600">shahryarshafique04@gmail.com</p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Green Card Renewal</h3>
                      <div className="mt-2 inline-flex items-center rounded-full border border-transparent bg-orange-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                        Advanced Plan
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">$449.99</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">What&apos;s Included:</h4>
                    <ul className="space-y-2">
                      {includedFeatures.map((feature) => (
                        <li key={feature} className="flex items-start text-sm text-gray-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-3 mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500"
                          >
                            <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                            <path d="m9 11 3 3L22 4" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">Additional Services</h3>
                  <div className="space-y-3">
                    {additionalServices.map((service) => (
                      <div
                        key={service.name}
                        className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:bg-gray-50"
                      >
                        <div className="flex flex-1 items-start space-x-3">
                          <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 border-gray-300" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                            <div className="mt-1 text-xs text-gray-600">{service.description}</div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="font-semibold text-gray-900">{service.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Green Card Renewal</span>
                  <span className="font-medium text-gray-900">$449.99</span>
                </div>
              </div>
              <div className="mb-6 border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">$449.99</span>
                </div>
              </div>
              <button className="mb-4 inline-flex h-10 w-full items-center justify-center rounded-md bg-orange-500 px-4 py-6 text-lg font-semibold text-white transition-all duration-200 hover:bg-orange-600 active:scale-95 active:brightness-110">
                Continue Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
