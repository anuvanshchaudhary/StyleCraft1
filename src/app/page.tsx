"use client";
import { useState } from 'react';
import { triggerAlert } from '@/lib/alert-system';
import { useVoice } from '@/hooks/use-voice';
import MedicineScanner from '@/components/MedicineScanner';

export default function Home() {
  const [scannedMeds, setScannedMeds] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("Ready to scan.");
  const { announce } = useVoice();

  const handleCapture = async (imageSrc: string) => {
    setMessage("Processing image...");
    announce("Processing image...", 'low');

    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageSrc }),
      });

      const data = await response.json();

      if (data.success) {
        // Handle Simulation Mode warning
        if (data.isSimulated) {
          const simMsg = `[SIMULATED] Detected: ${data.drugName}`;
          setMessage(simMsg);
          announce(`Simulated detection of ${data.drugName}. Gemini API Key is missing.`, 'medium');
          await new Promise(r => setTimeout(r, 2000));
        }

        // Handle Gemini confidence and identification logic
        if (data.isMedicine === false || data.drugName === 'Unknown') {
          const msg = "No medication detected. Please point the camera at the label.";
          setMessage(msg);
          announce(msg, 'medium');
        } else if (data.confidence < 80) {
          const msg = `Not sure. I think it's ${data.drugName}, but please re-center the package and hold steady.`;
          setMessage(msg);
          announce(msg, 'medium');
        } else {
          // High confidence detection
          const displayName = (data.genericName && data.genericName !== data.drugName && data.genericName !== "Unknown")
            ? `${data.drugName} (${data.genericName})`
            : data.drugName;

          addMedication(displayName);
        }

      } else {
        const errorMsg = "No medication detected. Please point the camera at the label.";
        setMessage(errorMsg);
        announce(errorMsg, 'medium');
      }
    } catch (e) {
      console.error("OCR Request failed", e);
      const errorMsg = "Error connecting to vision service. Please try again.";
      setMessage(errorMsg);
      announce(errorMsg, 'medium');
    }
  };

  const addMedication = (newDrug: string) => {
    setScannedMeds(prev => {
      const updatedList = [...prev, newDrug];

      const countMsg = `Added ${newDrug}. Total ${updatedList.length} medicines in list. Scanning for conflicts...`;
      setMessage(countMsg);
      announce(countMsg, 'medium');

      // Check for conflicts between the NEW drug and ALL existing drugs
      checkGlobalConflicts(newDrug, prev);

      return updatedList;
    });
  };

  const checkGlobalConflicts = async (newDrug: string, existingDrugs: string[]) => {
    for (const existingDrug of existingDrugs) {
      // Double check against each previous drug
      checkConflict(existingDrug, newDrug);
    }
  };

  const checkConflict = async (drugA: string, drugB: string) => {
    console.log(`Checking conflict between ${drugA} and ${drugB}...`);

    try {
      const response = await fetch('/api/check-conflict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drugA, drugB }),
      });

      if (!response.ok) throw new Error("Failed to check interactions");

      const data = await response.json();

      if (data.hasInteraction && data.severity === 'high') {
        const alertMsg = `DANGER! ${drugA} and ${drugB} have a SEVERE interaction. Do not take them together!`;
        setMessage(alertMsg);

        if (typeof navigator !== 'undefined' && "vibrate" in navigator) {
          navigator.vibrate([500, 200, 500, 200, 1000]);
        }

        announce(alertMsg, 'high');
      } else {
        // Safe / No interaction found
        if (data.description === "AI Analysis unavailable.") {
          const errorMsg = "Could not verify interactions (AI Unavailable).";
          setMessage(errorMsg);
          announce(errorMsg, 'low');
        } else {
          const safeMsg = `Safe. No known interactions between ${drugA} and ${drugB}.`;
          setMessage(safeMsg);
          // Optional: Don't announce "Safe" every time to avoid spam, or announce it briefly. 
          // The user asked "otherwise it should return no risk".
          announce("No risk detected.", 'low');
        }
      }

    } catch (e) {
      console.error(e);
      // Silent error for background checks to avoid spamming user
    }
  };

  const clearList = () => {
    setScannedMeds([]);
    setMessage("List cleared.");
    announce("List cleared. Ready for new patient.", 'low');
  };

  return (
    <main className="flex h-[100dvh] flex-col items-center justify-between bg-slate-900 text-white overflow-hidden relative">
      <header className="w-full p-4 bg-slate-900/80 backdrop-blur-md z-10 flex justify-center border-b border-slate-800">
        <h1 className="text-xl font-bold text-blue-400">Vision-Voice Pharmacy</h1>
      </header>

      {/* Camera Section - Grows to fill available space */}
      <div className="flex-1 w-full bg-black relative flex items-center justify-center overflow-hidden">
        <MedicineScanner onCapture={handleCapture} />
      </div>

      {/* Controls & Feedback Section */}
      <div className="w-full bg-slate-900 p-4 flex flex-col gap-3 z-10 border-t border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">

        {/* Status Message */}
        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 w-full text-center min-h-[60px] flex items-center justify-center">
          <p className="text-sm md:text-lg font-mono text-yellow-300">{message}</p>
        </div>

        {/* Action Buttons */}
        <button
          className="w-full bg-red-600/90 active:bg-red-700 text-white py-4 rounded-xl font-bold uppercase tracking-wider transition-colors touch-manipulation"
          onClick={clearList}
        >
          Clear List (Start Over)
        </button>

        {/* Collapsable/Scrollable List Drawer Suggestion or just a list below? 
              For now, let's put the list in a scrollable area if there are items, 
              but since space is tight, maybe an overlay or just a small list?
              Actually, let's make the list an overlay drawer or a scrollable section 
              that appears above the bottom sheet if there are meds.
              
              Simpler approach for hackathon: 
              If meds exist, show a "XX Medications Scanned" summary button that opens a modal?
              Or just put the list IN the bottom sheet, scrollable max-height.
           */}

        {scannedMeds.length > 0 && (
          <div className="w-full max-h-[150px] overflow-y-auto bg-slate-800/50 rounded-lg p-2 mt-1 space-y-2 border border-slate-700">
            <h3 className="text-xs font-semibold text-gray-400 sticky top-0 bg-slate-900/90 p-1">Scanned Meds ({scannedMeds.length}):</h3>
            <ul className="space-y-1">
              {scannedMeds.map((drug, i) => (
                <li key={i} className="flex justify-between items-center text-sm p-1 border-b border-slate-700/50 last:border-0">
                  <span className="text-emerald-400 font-bold truncate pr-2">{drug}</span>
                  <span className="text-gray-500 text-xs">#{i + 1}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Accessible Live Region */}
      <div role="alert" aria-live="assertive" className="sr-only">
        {message}
      </div>
    </main>
  );
}
