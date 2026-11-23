import express from 'express';
import type { Express, NextFunction, Request, Response } from 'express';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

export const ALLOWED_SERVICE_OPTIONS = [
  'Free Wellness Consultation',
  'Swedish & Aromatherapy Massage',
  'Deep Tissue & Thai Massage',
  'Head, Shoulder & Reflexology',
  'Couple Spa & Steam Rituals',
  'Body Scrub, Wrap & Skin Care',
] as const;

const SYSTEM_INSTRUCTION = `You are the Senior Wellness & Spa Therapy AI Consultant at CROWN SPA, a luxury body massage and wellness studio located at House No. 372, 2nd Floor (Near Kohat Enclave Metro Station, Metro Pillar Nos. 342 & 343), Kohat Enclave, Pitampura, New Delhi 110034.

Your task is to analyze the user's uploaded photo (and any optional focus area or wellness note they share) and provide a warm, restorative, luxury spa consultation.

Identify the primary visible tension, fatigue, skin dehydration/dullness, or relaxation need ("the concern") and recommend the single best matching therapy from CROWN SPA's menu:
1. "Swedish & Aromatherapy Massage" — For overall stress, mental burnout, restless sleep, gentle circulatory relaxation, and aromatic essential oil calm.
2. "Deep Tissue & Thai Massage" — For visible neck/shoulder stiffness, desk posture tightness, muscular knots, back tension, or athletic recovery needing firm bodywork and assisted stretching.
3. "Head, Shoulder & Reflexology" — For facial tension, screen fatigue, upper-shoulder strain, headaches, or tired feet needing focused scalp, neck, and foot pressure-point relief.
4. "Couple Spa & Steam Rituals" — For shared celebration/relaxation sessions, full-body steam & shower detoxification, and private luxury suite rejuvenation.
5. "Body Scrub, Wrap & Skin Care" — For dull or dehydrated skin, uneven tone, rough texture, tanning, or pre-event body & facial glow preparation.
6. "Free Wellness Consultation" — Use when the photo is unclear or the guest's goals span multiple therapies requiring an in-person therapist assessment at Kohat Enclave, Pitampura.

Guidelines:
- Keep observations respectful, encouraging, concise, and non-medical (never diagnose medical conditions).
- Write 1-2 crisp sentences for "problemObservation" and 1-2 crisp sentences for "whyItSolvesIt", plus 3 short single-sentence wellness tips in "stylistTips".
- Use "On Consultation" (or "Complimentary Assessment" for Free Wellness Consultation) for "estimatedPrice" — never invent unverified rupee prices.
- Always set "recommendedServiceOption" to one of the exact 6 strings listed above.
- If the uploaded image does not show a person, posture, face, hands, feet, or skin clearly enough to advise, set "isClearSalonPhoto" to false, politely explain what to upload (a well-lit photo of your face, shoulders, or skin area), and default "recommendedServiceOption" to "Free Wellness Consultation".`;

const WEBSITE_CHAT_SYSTEM_INSTRUCTION = `You are the official AI Spa Concierge & Wellness Advisor for CROWN SPA (Pitampura, New Delhi), trained on the complete content of the Crown Spa website.

COMPLETE CROWN SPA WEBSITE KNOWLEDGE BASE:
- Brand & Tagline: CROWN SPA — Luxury Body & Wellness Spa Studio ("Unwind Deeply. Feel Confident.") in Kohat Enclave, Pitampura, New Delhi.
- Address & Landmarks: House No. 372, 2nd Floor, Near Kohat Enclave Metro Station (Metro Pillar Nos. 342 & 343), Kohat Enclave, Pitampura, New Delhi, Delhi 110034.
- Google Maps Coordinates: 28.6980, 77.1404 | Google Business Profile: https://share.google/a6wdlxGyipxGRJVCj
- Phone & WhatsApp: +91 87929 02454 and +91 93542 47716 (WhatsApp: https://wa.me/919354247716).
- Opening Hours: Monday to Sunday, 10:00 AM – 10:00 PM (Call ahead to confirm private suite and therapist availability during peak evening and weekend hours).
- Rating & Highlights: 4.1★ average rating across hundreds of local client reviews praising spotless hygienic private rooms, trained and attentive therapists, relaxing ambient lighting, and integrated steam & shower facilities.
- Guest Concerns We Solve: Chronic neck/back stiffness from long desk hours & Delhi commutes, mental burnout and poor sleep quality, noisy rushed parlors lacking real privacy or hygiene, and uncertainty over which body therapy fits your soreness or stress level.
- What You'll Experience: Deep Muscular Relief, Serene Mental Reset, Private Hygienic Suites (sanitized linens, ambient lighting & quiet rooms), Steam & Shower Rituals, Tailored Therapist Pressure, and Effortless Renewed Glow.
- Signature Services Menu (Pricing: On Consultation / Personalized Packages):
  1. Swedish & Aromatherapy Massage (60 / 90 Min • On Consultation): Long rhythmic strokes paired with warm essential oils to ease daily stress and restore calm sleep.
  2. Deep Tissue & Thai Massage (60 / 90 Min • On Consultation): Targeted slow-pressure myofascial release and traditional Thai stretching to unlock tight back, neck, and shoulder knots.
  3. Head, Shoulder & Reflexology (30 / 45 Min • On Consultation): Focused scalp, temple, cervical, and foot reflex-point therapy ideal for express post-work recharge.
  4. Couple Spa & Steam Rituals (90 / 120 Min • On Consultation): Private luxury treatment suites featuring aromatic steam, synchronized full-body massage, and warm shower facilities.
  5. Body Scrub, Wrap & Skin Care (60 / 90 Min • On Consultation): Exfoliating polishes, hydrating wraps, and soothing facial refreshers for smoother, luminous skin.
- Featured Offer: Complimentary Wellness Consultation — sit down with our lead therapist for a personalized posture, tension, and aroma assessment to choose your ideal therapy and pressure profile before booking.
- Your Path to Calm (3 Simple Steps): 01. Book Your Slot (online booking form on this website or WhatsApp; concierge calls within 15 minutes to confirm) -> 02. Arrive & Consult (House No. 372, 2nd Floor, near Kohat Enclave Metro) -> 03. Unwind & Recharge.
- Booking Form Services Available (#booking): Free Wellness Consultation, Swedish & Aromatherapy Massage, Deep Tissue & Thai Massage, Head, Shoulder & Reflexology, Couple Spa & Steam Rituals, Body Scrub, Wrap & Skin Care.
- AI Wellness Consultant (#consultant): Visitors can also upload a photo in the AI Consultant section on this page for instant tension/skin observation and therapy matching.

RESPONSE GUIDELINES:
1. Answer questions accurately using the Crown Spa website knowledge above in a warm, calm, luxury spa concierge voice.
2. When asked about directions, landmarks near Kohat Enclave Metro Station / Metro Pillar 342 & 343 / Pitampura, or nearby routes, use Google Maps grounding to provide accurate geographic details.
3. Recommend the most suitable Crown Spa therapy/therapies whenever relevant. Mention clearly that package rates are shared on consultation or by calling +91 87929 02454 / +91 93542 47716.
4. Keep answers clear and concise (short paragraphs or bullet points), and always end by inviting the user to click the "Book in Form" CTA button directly below your message to reserve their private suite slot.
5. Never invent fixed rupee prices, fake discounts, or services that are not listed on the website above.`;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function matchServiceKeywords(text: string): string | null {
  const lower = text.toLowerCase();
  if (/deep tissue|thai|stiff|knot|back pain|muscle|sore|sport|posture/.test(lower)) {
    return 'Deep Tissue & Thai Massage';
  }
  if (/swedish|aroma|aromatherapy|stress|sleep|relax|essential oil|calm/.test(lower)) {
    return 'Swedish & Aromatherapy Massage';
  }
  if (/head|scalp|shoulder|neck|foot|feet|reflexology|migraine|express/.test(lower)) {
    return 'Head, Shoulder & Reflexology';
  }
  if (/couple|steam|shower|suite|jacuzzi|anniversary|private room|ritual/.test(lower)) {
    return 'Couple Spa & Steam Rituals';
  }
  if (/scrub|wrap|polish|exfoliat|facial|skin|glow|tan|dehydrat/.test(lower)) {
    return 'Body Scrub, Wrap & Skin Care';
  }
  return null;
}

function inferRecommendedService(userMessage: string, reply: string): string {
  const fromUser = matchServiceKeywords(userMessage);
  if (fromUser) return fromUser;

  if (
    /^(hi+|hello+|hey+|good\s*(morning|afternoon|evening)|namaste|help|info)\b/i.test(userMessage.trim()) ||
    /what services|all services|menu|price list|prices|rate|cost|where|location|address|directions|hours|open|review|rating|metro|offer/i.test(
      userMessage
    )
  ) {
    return 'Free Wellness Consultation';
  }

  return matchServiceKeywords(reply) || 'Free Wellness Consultation';
}

interface IncomingChatTurn {
  role: 'user' | 'model';
  text: string;
}

interface GroundingMapSource {
  title: string;
  uri: string;
  reviewSnippets?: string[];
}

function handleGeminiRouteError(err: unknown, res: Response, fallbackMessage: string) {
  const message = err instanceof Error ? err.message : String(err);
  if (message === 'MISSING_API_KEY') {
    res.status(500).json({
      error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your environment variables.',
    });
    return;
  }
  if (message.includes('PERMISSION_DENIED') || message.includes('API_KEY_INVALID') || message.includes('403')) {
    res.status(403).json({
      error: 'Gemini API key appears invalid or lacks permission. Please verify GEMINI_API_KEY.',
    });
    return;
  }
  if (message.includes('RESOURCE_EXHAUSTED') || message.includes('429')) {
    res.status(429).json({
      error: 'AI service is experiencing high demand. Please try again in a moment.',
    });
    return;
  }
  console.error('Gemini API error:', err);
  res.status(500).json({ error: fallbackMessage });
}

function createApiRouter() {
  const router = express.Router();

  router.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'crown-spa-api',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  router.post('/bookings', (req: Request, res: Response) => {
    const { name, phone, service, time } = req.body ?? {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'Please provide your full name.' });
      return;
    }

    if (!phone || typeof phone !== 'string') {
      res.status(400).json({ error: 'Please provide a valid phone number.' });
      return;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      res.status(400).json({ error: 'Please enter a valid 10-digit phone number.' });
      return;
    }

    if (!time || typeof time !== 'string' || !time.trim()) {
      res.status(400).json({ error: 'Please select a preferred appointment date and time.' });
      return;
    }

    const cleanService =
      typeof service === 'string' && service.trim()
        ? service.trim().slice(0, 120)
        : 'Free Wellness Consultation';

    const bookingId = `CRN-${Date.now().toString(36).toUpperCase()}`;

    res.status(201).json({
      success: true,
      bookingId,
      message:
        'Session Request Secured! Our concierge will call you within 15 minutes to confirm your private suite and therapist.',
      booking: {
        name: name.trim().slice(0, 100),
        phone: phone.trim().slice(0, 30),
        service: cleanService,
        time: time.trim().slice(0, 60),
        createdAt: new Date().toISOString(),
      },
    });
  });

  router.post('/chat', async (req: Request, res: Response) => {
    try {
      const { message, history, location } = req.body ?? {};

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Please enter a message to chat with the Crown Spa AI Concierge.' });
        return;
      }

      const ai = getGeminiClient();

      const safeHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = Array.isArray(history)
        ? history
            .filter(
              (item): item is IncomingChatTurn =>
                Boolean(item) &&
                (item.role === 'user' || item.role === 'model') &&
                typeof item.text === 'string' &&
                item.text.trim().length > 0
            )
            .slice(-16)
            .map((item) => ({
              role: item.role,
              parts: [{ text: item.text.trim().slice(0, 2000) }],
            }))
        : [];

      const contents = [
        ...safeHistory,
        {
          role: 'user' as const,
          parts: [{ text: message.trim().slice(0, 2000) }],
        },
      ];

      const lat =
        location && typeof location.latitude === 'number' && Number.isFinite(location.latitude)
          ? location.latitude
          : 28.698;
      const lng =
        location && typeof location.longitude === 'number' && Number.isFinite(location.longitude)
          ? location.longitude
          : 77.1404;

      const wantsLocationGrounding =
        /where|location|address|directions|map|nearby|landmark|kohat|pitampura|pillar|metro|delhi|far|distance|reach|parking|google|hours|open/i.test(
          message
        );

      const isKeyError = (err: unknown): boolean => {
        const msg = err instanceof Error ? err.message : String(err);
        return (
          msg === 'MISSING_API_KEY' ||
          msg.includes('PERMISSION_DENIED') ||
          msg.includes('API_KEY_INVALID') ||
          msg.includes('403')
        );
      };

      const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> =>
        new Promise<T>((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('GEMINI_CHAT_TIMEOUT')), ms);
          promise.then(
            (val) => {
              clearTimeout(timer);
              resolve(val);
            },
            (err) => {
              clearTimeout(timer);
              reject(err);
            }
          );
        });

      const generateChatResponse = (model: string, useMaps: boolean, timeoutMs?: number) => {
        const call = ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: WEBSITE_CHAT_SYSTEM_INSTRUCTION,
            thinkingConfig: {
              thinkingLevel: model === 'gemini-3.1-flash-lite' ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW,
            },
            ...(useMaps
              ? {
                  tools: [{ googleMaps: {} }],
                  toolConfig: {
                    retrievalConfig: {
                      latLng: {
                        latitude: lat,
                        longitude: lng,
                      },
                    },
                  },
                }
              : {}),
          },
        });
        return timeoutMs ? withTimeout(call, timeoutMs) : call;
      };

      let response;
      if (wantsLocationGrounding) {
        try {
          response = await generateChatResponse('gemini-4-hydrogen', true, 4000);
        } catch (err) {
          if (isKeyError(err)) throw err;
          response = await generateChatResponse('gemini-3.1-flash-lite', false);
        }
      } else {
        response = await generateChatResponse('gemini-3.1-flash-lite', false);
      }

      const reply = (response.text ?? '').trim();
      if (!reply) {
        res.status(502).json({ error: 'The AI concierge returned an empty response. Please try again.' });
        return;
      }

      const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
      const seenUris = new Set<string>();
      const mapsSources: GroundingMapSource[] = [];

      for (const chunk of rawChunks as Array<{
        maps?: {
          uri?: string;
          title?: string;
          placeAnswerSources?: {
            reviewSnippets?: Array<{ content?: string; text?: string } | string>;
          };
        };
      }>) {
        const uri = chunk?.maps?.uri;
        if (!uri || seenUris.has(uri)) continue;
        seenUris.add(uri);

        const snippetsRaw = chunk.maps?.placeAnswerSources?.reviewSnippets ?? [];
        const reviewSnippets = snippetsRaw
          .map((s) => (typeof s === 'string' ? s : s?.content || s?.text || ''))
          .filter((s) => s.trim().length > 0)
          .slice(0, 2);

        mapsSources.push({
          title: chunk.maps?.title || 'View on Google Maps',
          uri,
          ...(reviewSnippets.length > 0 ? { reviewSnippets } : {}),
        });
      }

      const recommendedServiceOption = inferRecommendedService(message, reply);

      res.json({
        reply,
        mapsSources,
        recommendedServiceOption,
      });
    } catch (err: unknown) {
      handleGeminiRouteError(err, res, 'Unable to reach the Crown Spa AI Concierge right now. Please try again.');
    }
  });

  router.post('/consult', async (req: Request, res: Response) => {
    try {
      const { imageBase64, mimeType, focusArea, concern } = req.body ?? {};

      if (!imageBase64 || typeof imageBase64 !== 'string') {
        res.status(400).json({ error: 'Please upload a photo before starting the wellness consultation.' });
        return;
      }

      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
      const safeMime = typeof mimeType === 'string' && allowedMimes.includes(mimeType) ? mimeType : 'image/jpeg';

      const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      if (!cleanBase64 || cleanBase64.length > 14 * 1024 * 1024) {
        res.status(400).json({ error: 'Image is too large or invalid. Please use a photo under 10 MB.' });
        return;
      }

      const ai = getGeminiClient();

      const focusText =
        typeof focusArea === 'string' && focusArea.trim() ? focusArea.trim() : 'Complete Relaxation';
      const concernText =
        typeof concern === 'string' && concern.trim()
          ? `Guest note: "${concern.trim().slice(0, 500)}"`
          : 'No additional note provided by the guest.';

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: safeMime,
                data: cleanBase64,
              },
            },
            {
              text: `Analyze this guest photo for a luxury wellness spa consultation at CROWN SPA (Kohat Enclave, Pitampura, New Delhi). Focus area selected: ${focusText}. ${concernText} Identify visible tension, fatigue, posture strain, or skin care needs and recommend the best matching CROWN SPA therapy.`,
            },
          ],
        },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isClearSalonPhoto: {
                type: Type.BOOLEAN,
                description: 'True if the photo clearly shows a person, face, posture, or skin suitable for spa wellness consultation.',
              },
              detectedProblemTitle: {
                type: Type.STRING,
                description: 'Short 3-6 word title of the main observed tension, fatigue, or skin wellness opportunity.',
              },
              problemObservation: {
                type: Type.STRING,
                description: '1-2 respectful, observant sentences describing what is visible and the relaxation or skin care need identified.',
              },
              recommendedServiceOption: {
                type: Type.STRING,
                description: `Must be exact match to one of: ${ALLOWED_SERVICE_OPTIONS.join(', ')}`,
              },
              recommendedServiceName: {
                type: Type.STRING,
                description: 'Friendly Crown Spa therapy name (e.g., Signature Swedish & Aromatherapy Ritual, Deep Tissue Muscular Release).',
              },
              estimatedPrice: {
                type: Type.STRING,
                description: 'Crown Spa pricing label: either "On Consultation" or "Complimentary Assessment".',
              },
              whyItSolvesIt: {
                type: Type.STRING,
                description: '1-2 sentences explaining specifically how this Crown Spa therapy restores comfort and what result to expect.',
              },
              stylistTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Exactly 3 concise, practical hydration, posture, or aftercare tips tailored to this guest.',
              },
            },
            required: [
              'isClearSalonPhoto',
              'detectedProblemTitle',
              'problemObservation',
              'recommendedServiceOption',
              'recommendedServiceName',
              'estimatedPrice',
              'whyItSolvesIt',
              'stylistTips',
            ],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'The AI consultant returned an empty response. Please try again.' });
        return;
      }

      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(rawText) as Record<string, unknown>;
      } catch {
        res.status(502).json({ error: 'Received an unexpected consultation response format. Please try again.' });
        return;
      }

      const candidateOption =
        typeof parsed.recommendedServiceOption === 'string' ? parsed.recommendedServiceOption : '';
      const validOption = (ALLOWED_SERVICE_OPTIONS as readonly string[]).includes(candidateOption)
        ? candidateOption
        : 'Free Wellness Consultation';

      res.json({
        ...parsed,
        recommendedServiceOption: validOption,
      });
    } catch (err: unknown) {
      handleGeminiRouteError(err, res, 'Unable to complete photo analysis right now. Please try again.');
    }
  });

  return router;
}

export function createApiApp(options: { serverless?: boolean } = {}): Express {
  const app = express();

  app.use(express.json({ limit: '15mb' }));

  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (err && typeof err === 'object' && 'type' in err && (err as { type?: string }).type === 'entity.parse.failed') {
      res.status(400).json({ error: 'Invalid JSON request payload.' });
      return;
    }
    next(err);
  });

  const apiRouter = createApiRouter();
  app.use('/api', apiRouter);
  app.use('/.netlify/functions/api', apiRouter);

  if (options.serverless) {
    app.use('/', apiRouter);
    app.use((_req: Request, res: Response) => {
      res.status(404).json({ error: 'API route not found.' });
    });
  }

  return app;
}
