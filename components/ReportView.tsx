import React, { useRef, useState } from 'react';
import { CompareResponse, Property } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReportViewProps {
  result: CompareResponse;
  property: Property;
  onClose: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ result, property, onClose }) => {
  const totalIssues = result.summary.totalIssuesFound;
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'all_clear': return 'text-green-600';
      case 'minor_issues': return 'text-yellow-600';
      case 'major_concerns': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'all_clear': return 'All Clear';
      case 'minor_issues': return 'Minor Issues';
      case 'major_concerns': return 'Major Concerns';
      default: return status;
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // Capture the report as canvas with high quality
      const canvas = await html2canvas(reportRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: reportRef.current.scrollWidth,
        windowHeight: reportRef.current.scrollHeight,
      });

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      // Calculate scaling to fit content on one page with margins
      const margin = 10; // 10mm margin
      const availableWidth = pdfWidth - (2 * margin);
      const availableHeight = pdfHeight - (2 * margin);
      
      // Get canvas dimensions in mm
      const canvasWidthMM = canvas.width * 0.264583; // Convert pixels to mm (96 DPI)
      const canvasHeightMM = canvas.height * 0.264583;
      
      // Calculate scale to fit both width and height
      const scaleX = availableWidth / canvasWidthMM;
      const scaleY = availableHeight / canvasHeightMM;
      const scale = Math.min(scaleX, scaleY); // Use smaller scale to ensure everything fits
      
      // Calculate final dimensions
      const finalWidth = canvasWidthMM * scale;
      const finalHeight = canvasHeightMM * scale;
      
      // Center the content
      const xOffset = margin + (availableWidth - finalWidth) / 2;
      const yOffset = margin;
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add image centered and scaled to fit
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        xOffset,
        yOffset,
        finalWidth,
        finalHeight,
        undefined,
        'FAST'
      );

      // Generate filename
      const fileName = `GuestyGuard_Report_${property.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Download
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Final Report</h2>
        <button onClick={onClose} className="text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* PDF-like header */}
      <div ref={reportRef} className="bg-white border-2 border-slate-100 p-5 rounded-2xl space-y-4 shadow-xl max-w-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#54A18A] to-[#007A67] rounded-lg flex items-center justify-center font-bold text-white text-xl">G</div>
            <div>
              <p className="text-xs font-bold text-slate-800">Guesty Guard</p>
              <p className="text-[9px] text-slate-400 uppercase">Damage Assessment Report</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-800">#{property.pendingCheckout?.reservationId}</p>
            <p className="text-[9px] text-slate-400">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm bg-slate-50 p-3 rounded-lg">
          <div>
            <p className="text-slate-400 text-[9px] font-bold uppercase mb-1">Property</p>
            <p className="font-bold text-slate-800 text-xs">{property.name}</p>
          </div>
          <div>
            <p className="text-slate-400 text-[9px] font-bold uppercase mb-1">Guest</p>
            <p className="font-bold text-slate-800 text-xs">{property.pendingCheckout?.guestName}</p>
          </div>
        </div>

        {/* Overall Status */}
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-slate-400 text-[9px] font-bold uppercase">Overall Status</h4>
            <span className={`font-bold text-xs uppercase ${getStatusColor(result.summary.overallStatus)}`}>
              {getStatusLabel(result.summary.overallStatus)}
            </span>
          </div>
          <p className="text-slate-700 text-xs leading-snug">{result.summary.summary}</p>
        </div>

        {/* Items to Check */}
        {result.summary.itemsToCheck.length > 0 && (
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <h4 className="text-amber-800 text-[9px] font-bold uppercase mb-2">Items Requiring Attention ({totalIssues})</h4>
            <div className="space-y-1.5">
              {result.summary.itemsToCheck.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-amber-700 flex-1">{item.item}</span>
                  <span className="font-medium text-amber-800 text-[10px] ml-2">{item.room}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Room Assessments Summary */}
        <div className="bg-slate-50 p-3 rounded-lg">
          <h4 className="text-slate-400 text-[9px] font-bold uppercase mb-2">Room-by-Room Summary</h4>
          <div className="space-y-1">
            {result.roomAssessments.map((room, i) => (
              <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-slate-700 font-medium">{room.room}</span>
                <span className={`font-bold text-[10px] ${room.damageDetected ? 'text-red-600' : 'text-green-600'}`}>
                  {room.damageDetected ? `${room.items.length} issue(s)` : 'Clear'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download Button - Outside PDF capture area */}
      <button 
        onClick={downloadPDF}
        disabled={isGeneratingPDF}
        className="w-full bg-gradient-to-r from-[#54A18A] to-[#007A67] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGeneratingPDF ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Generating PDF...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            📄 Download Evidence PDF
          </>
        )}
      </button>

      <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 rounded-r-xl">
        <p className="text-yellow-800 font-bold text-sm mb-1">Evidence Saved</p>
        <p className="text-yellow-700 text-xs leading-relaxed">
          High-resolution comparison photos and AI assessment logs have been securely archived for any potential guest disputes.
        </p>
      </div>

      <button 
        onClick={onClose}
        className="w-full text-slate-400 font-bold py-4 hover:text-slate-600 transition-colors"
      >
        Done - Back to Dashboard
      </button>
    </div>
  );
};

export default ReportView;
