import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  Upload,
  Sparkles,
  ArrowRight,
  Check,
  RefreshCw,
  AlertCircle,
  Scissors,
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface ConsultationResult {
  isClearSalonPhoto: boolean;
  detectedProblemTitle: string;
  problemObservation: string;
  recommendedServiceOption: string;
  recommendedServiceName: string;
  estimatedPrice: string;
  whyItSolvesIt: string;
  stylistTips: string[];
}

interface AIConsultantSectionProps {
  onBookRecommendation: (serviceOption: string, serviceDisplayName: string) => void;
}

const FOCUS_OPTIONS = [
  'Complete Look',
  'Hair & Colour',
  'Skin & Glow',
] as const;

function compressImageFile(file: File): Promise<{ base64: string; mimeType: string; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onerror = () => reject(new Error('Unsupported or corrupted image file.'));
      img.onload = () => {
        const maxDim = 768;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ base64: dataUrl, mimeType: file.type || 'image/jpeg', previewUrl: dataUrl });
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.78);
        resolve({
          base64: compressedDataUrl,
          mimeType: 'image/jpeg',
          previewUrl: compressedDataUrl,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export default function AIConsultantSection({ onBookRecommendation }: AIConsultantSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imagePayload, setImagePayload] = useState<{ base64: string; mimeType: string } | null>(null);
  const [focusArea, setFocusArea] = useState<string>('Complete Look');
  const [concern, setConcern] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConsultationResult | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file (JPG, PNG, or WebP).');
      return;
    }

    setError(null);
    setResult(null);
    try {
      const processed = await compressImageFile(file);
      setPreviewUrl(processed.previewUrl);
      setImagePayload({ base64: processed.base64, mimeType: processed.mimeType });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to process this image.');
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePayload) {
      setError('Please upload a photo first so our AI consultant can analyze your look.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          imageBase64: imagePayload.base64,
          mimeType: imagePayload.mimeType,
          focusArea,
          concern,
        }),
      });

      const rawText = await response.text();
      let data: (ConsultationResult & { error?: string }) | null = null;

      if (rawText.trim()) {
        try {
          data = JSON.parse(rawText);
        } catch {
          if (!response.ok) {
            throw new Error(`Consultation service returned an unexpected error (${response.status}). Please try again.`);
          }
          throw new Error('Received a malformed response from the AI consultant. Please try again.');
        }
      }

      if (!response.ok) {
        throw new Error(data?.error || `Could not complete analysis (HTTP ${response.status}). Please try again.`);
      }

      if (!data || typeof data.detectedProblemTitle !== 'string' || typeof data.recommendedServiceOption !== 'string') {
        throw new Error('The AI consultant returned an empty or incomplete analysis. Please try again.');
      }

      setResult(data);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Analysis timed out due to a slow connection. Please try again.');
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong while analyzing your photo.');
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setImagePayload(null);
    setConcern('');
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section id="consultant" className="py-32 bg-luxury-black border-b border-luxury-champagne/15 relative">
      <div className="section-container">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-luxury-gold/40 bg-luxury-gold/10 mb-6">
            <Sparkles className="w-3 h-3 text-luxury-gold" />
            <span className="text-[10px] uppercase tracking-[2px] font-bold text-luxury-gold">
              AI Photo Style &amp; Care Consultant
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-luxury-white mb-6">
            Upload Your Photo. <span className="text-luxury-gold italic">Get Instant Advice.</span>
          </h2>
          <p className="text-luxury-champagne text-base md:text-lg font-light leading-relaxed">
            Share a well-lit photo of your hair or skin. Our AI consultant identifies what your look needs and matches you with the ideal Floraison service.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Upload & Prompt Panel */}
          <form
            onSubmit={handleAnalyze}
            className="lg:col-span-5 glass-card border-luxury-champagne/20 space-y-6"
          >
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-luxury-champagne mb-3">
                1. Upload Your Photo
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              {previewUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-luxury-champagne/25 bg-luxury-black">
                  <img
                    src={previewUrl}
                    alt="Uploaded photo preview"
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-luxury-black via-luxury-black/80 to-transparent flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-full bg-luxury-ivory text-luxury-black text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gold transition-colors flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" /> Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2 rounded-full border border-luxury-champagne/30 text-luxury-ivory text-[10px] font-bold uppercase tracking-widest hover:border-luxury-gold hover:text-luxury-gold transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFile(e.dataTransfer.files?.[0]);
                  }}
                  className={cn(
                    'rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all',
                    isDragging
                      ? 'border-luxury-gold bg-luxury-gold/10'
                      : 'border-luxury-champagne/25 bg-luxury-ivory/[0.03] hover:border-luxury-gold/60'
                  )}
                >
                  <div className="w-14 h-14 rounded-full bg-luxury-gold/15 border border-luxury-gold/30 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6 text-luxury-gold" />
                  </div>
                  <p className="font-serif text-lg text-luxury-ivory mb-1">
                    Click to upload or drag a photo
                  </p>
                  <p className="text-xs text-luxury-champagne/70">
                    Clear selfie or hair photo • JPG, PNG, or WebP
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-luxury-champagne mb-3">
                2. Focus Area
              </label>
              <div className="grid grid-cols-3 gap-2">
                {FOCUS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFocusArea(option)}
                    className={cn(
                      'px-3 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider border transition-all',
                      focusArea === option
                        ? 'bg-luxury-gold text-luxury-black border-luxury-gold'
                        : 'bg-luxury-ivory/[0.04] text-luxury-champagne border-luxury-champagne/20 hover:border-luxury-gold/50'
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-luxury-champagne mb-3">
                3. Specific Concern (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g., frizzy ends, want a face-framing cut, dull skin before an event, grey coverage..."
                className="w-full bg-luxury-ivory/[0.06] border border-luxury-champagne/20 rounded-xl px-4 py-3 text-sm text-luxury-white placeholder:text-luxury-champagne/45 focus:border-luxury-gold outline-none transition-all resize-none"
                value={concern}
                onChange={(e) => setConcern(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-400/30 px-4 py-3 flex items-start gap-3 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-300" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs md:text-sm bg-luxury-gold text-luxury-black hover:bg-[#F9DF6F] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-black/20"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Your Look...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Analyze Photo &amp; Recommend
                </>
              )}
            </button>
          </form>

          {/* Diagnosis & Recommendation Panel */}
          <div className="lg:col-span-7">
            {isAnalyzing ? (
              <div className="glass-card border-luxury-champagne/20 p-10 md:p-14 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-luxury-gold animate-pulse" />
                </div>
                <h3 className="text-2xl font-serif text-luxury-ivory">
                  Reviewing Your Hair, Tone &amp; Features...
                </h3>
                <p className="text-sm text-luxury-champagne max-w-md mx-auto leading-relaxed">
                  Matching what we see against Floraison&apos;s L&apos;Oréal Professionnel colour, treatment, skin, and styling menu.
                </p>
              </div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-8 md:p-10 bg-luxury-ivory text-luxury-black border border-luxury-champagne shadow-2xl space-y-8"
              >
                {/* Problem Diagnosis */}
                <div className="border-b border-luxury-champagne pb-6">
                  <span className="inline-block bg-luxury-black text-luxury-gold px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                    {result.isClearSalonPhoto ? 'Consultant Assessment' : 'Photo Clarity Note'}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-luxury-black mb-3">
                    {result.detectedProblemTitle}
                  </h3>
                  <p className="text-luxury-black/80 text-sm md:text-base leading-relaxed">
                    {result.problemObservation}
                  </p>
                </div>

                {/* Recommended Floraison Service */}
                <div className="rounded-2xl p-6 bg-luxury-black text-luxury-white border border-luxury-gold/30 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-bold mb-1">
                        Recommended Floraison Solution
                      </p>
                      <h4 className="text-2xl font-serif font-bold text-luxury-ivory">
                        {result.recommendedServiceName}
                      </h4>
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-luxury-gold text-luxury-black text-xs font-bold uppercase tracking-wider shrink-0">
                      {result.estimatedPrice}
                    </span>
                  </div>
                  <p className="text-luxury-champagne text-sm leading-relaxed">
                    {result.whyItSolvesIt}
                  </p>
                </div>

                {/* Stylist Care Tips */}
                {result.stylistTips && result.stylistTips.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/65 mb-4">
                      Stylist Care Notes For You
                    </p>
                    <div className="space-y-3">
                      {result.stylistTips.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-luxury-black text-luxury-gold flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-sm text-luxury-black/85 leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Booking CTA */}
                <div className="pt-4 border-t border-luxury-champagne flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      onBookRecommendation(
                        result.recommendedServiceOption,
                        result.recommendedServiceName
                      )
                    }
                    className="flex-1 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs md:text-sm bg-luxury-gold text-luxury-black hover:bg-[#F9DF6F] transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/15"
                  >
                    Book {result.recommendedServiceName} <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-4 rounded-full font-bold uppercase tracking-widest text-xs border border-luxury-black/25 text-luxury-black hover:bg-luxury-black hover:text-luxury-ivory transition-colors"
                  >
                    New Photo
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card border-luxury-champagne/20 p-8 md:p-12 space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-luxury-gold/15 border border-luxury-gold/30 flex items-center justify-center shrink-0">
                    <Scissors className="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-luxury-ivory mb-2">
                      What Our AI Consultant Checks
                    </h3>
                    <p className="text-sm text-luxury-champagne leading-relaxed">
                      Upload a photo on the left to receive a personalized breakdown of what we notice and which Floraison service will solve it best.
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Hair Texture & Damage',
                      desc: 'Spotting frizz, dryness, or split ends suited for Keratin & Hair Spa.',
                    },
                    {
                      title: 'Face Shape & Cut',
                      desc: 'Recommending precision cuts & layers (₹200–₹300) for natural balance.',
                    },
                    {
                      title: 'Colour & Tone Harmony',
                      desc: 'Matching L’Oréal INOA, French Balayage & Dia Color shades (₹700–₹2,000).',
                    },
                    {
                      title: 'Skin Glow & Prep',
                      desc: 'Identifying dullness or event-prep needs for targeted facials & makeovers.',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-5 bg-luxury-ivory/[0.04] border border-luxury-champagne/15"
                    >
                      <p className="font-bold text-sm text-luxury-gold mb-1.5">{item.title}</p>
                      <p className="text-xs text-luxury-champagne/80 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-luxury-champagne/65 italic">
                  Your photo is analyzed solely for your live consultation and is not stored on our servers. Final treatment advice is confirmed in-person by our Agartala stylists.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
