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
        { pageLanguage: "en", layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
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
        }
        /* Style the select dropdown */
        .goog-te-gadget .goog-te-combo {
            color: #1B3A64 !important;
            margin: 0 !important;
            padding: 6px 8px !important;
            border-radius: 6px !important;
            border: 1px solid #E5E7EB !important;
            outline: none !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            background-color: white !important;
            cursor: pointer;
        }
        /* Hide hover tooltips over translated text */
        #goog-gt-tt, .goog-te-balloon-frame {
            display: none !important;
        }
        .goog-text-highlight {
            background-color: transparent !important;
            box-shadow: none !important;
        }
      `}} />
      <div 
        id="google_translate_element" 
        className="inline-block [&>div]:!inline-block [&>div>div]:!inline-block h-[38px] overflow-hidden"
      ></div>
    </>
  );
}
