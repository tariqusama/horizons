"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        "google_translate_element"
      );
    };

    if (!document.querySelector('script[src*="translate_a/element.js"]')) {
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* Hide the top translation banner */
        .goog-te-banner-frame.skiptranslate, .goog-te-banner-frame {
            display: none !important;
        }
        body {
            top: 0px !important; 
        }
        /* Hide the Google logo and "Powered by" text */
        .goog-logo-link {
            display: none !important;
        }
        .goog-te-gadget {
            color: transparent !important;
            font-size: 0px !important; /* Hides "Powered by" and "Translate" text */
        }
        .goog-te-gadget > span {
            display: none !important; /* Hides the "Translate" text wrapper if it exists */
        }
        .goog-te-gadget > div {
            display: inline-block !important; /* Ensures the dropdown container remains visible */
        }
        .goog-te-gadget img {
            display: none !important; /* Hides the Google logo image */
        }
        /* Style the select dropdown */
        .goog-te-gadget .goog-te-combo {
            color: #1B3A64 !important;
            margin: 0 !important;
            padding: 8px 12px !important;
            border-radius: 8px !important;
            border: 1px solid #E2E8F0 !important;
            outline: none !important;
            font-size: 14px !important;
            font-family: inherit !important;
            font-weight: 600 !important;
            background-color: #F8FAFC !important;
            cursor: pointer;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
            transition: all 0.2s ease-in-out !important;
            appearance: none; /* Removes default browser styling for select */
            -webkit-appearance: none;
            -moz-appearance: none;
            /* Add a custom dropdown arrow */
            background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231B3A64%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") !important;
            background-repeat: no-repeat !important;
            background-position: right 10px top 50% !important;
            background-size: 10px auto !important;
            padding-right: 30px !important; /* Make room for the arrow */
        }
        .goog-te-gadget .goog-te-combo:hover {
            border-color: #CBD5E1 !important;
            background-color: #FFFFFF !important;
        }
        .goog-te-gadget .goog-te-combo:focus {
            border-color: #FF6B35 !important;
            box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2) !important;
        }
        /* Hide hover tooltips over translated text */
        #goog-gt-tt, .goog-te-balloon-frame {
            display: none !important;
        }
        .goog-text-highlight {
            background-color: transparent !important;
            box-shadow: none !important;
        }
        /* Force hide any auto-generated Google Translate iframes */
        iframe.skiptranslate, iframe.VIpgJd-ZVi9od-ORHb-OEVmcd {
            display: none !important;
            visibility: hidden !important;
        }
      `}} />
      <div 
        id="google_translate_element" 
        className="flex items-center justify-center min-h-[40px] [&>div]:!inline-block [&>div>div]:!inline-block overflow-hidden"
      ></div>
    </>
  );
}
