"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AlertContextType {
    showAlert: (message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");

    const showAlert = (msg: string) => {
        setMessage(msg);
        setIsOpen(true);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.alert = (msg: string) => {
                showAlert(msg);
            };
        }
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {isOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 99999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(3px)'
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '16px', padding: '32px',
                        maxWidth: '420px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        textAlign: 'center', animation: 'fadeIn 0.2s ease-out'
                    }}>
                        <div style={{ 
                            backgroundColor: '#F3F4F6', color: '#4B5563', 
                            width: '64px', height: '64px', borderRadius: '50%', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            margin: '0 auto 20px auto' 
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                        </div>
                        <h3 style={{ margin: '0 0 12px 0', color: '#111827', fontSize: '1.25rem', fontWeight: 600 }}>Message</h3>
                        <p style={{ color: '#4B5563', margin: '0 0 24px 0', lineHeight: 1.5, fontSize: '0.95rem' }}>
                            {message}
                        </p>
                        <button 
                            onClick={() => setIsOpen(false)}
                            style={{
                                backgroundColor: '#1E40AF', color: 'white', border: 'none',
                                borderRadius: '8px', padding: '12px 24px', fontWeight: 500,
                                cursor: 'pointer', width: '100%', fontSize: '1rem',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1E40AF'}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};
