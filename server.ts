import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_SERVICE_OPTIONS = [
  'Free Consultation',
  'Haircut & Styling (₹200–₹300)',
  'Global Hair Colour / French Balayage (₹700–₹2,000)',
  'Keratin & Hair Spa',
  'Skin & Facial Treatment',
  'Bridal & Occasion Makeover',
] as const;

const SYSTEM_INSTRUCTION = `You are the Senior Style & Beauty AI Consultant at FLORAISON, an official L'Oréal Professionnel VIP Unisex Salon located at T.G. Road, Near Sankar Chowmuhani, Ram Nagar, Agartala, Tripura 799001.

Your task is to analyze the user's uploaded photo (and any optional focus area or concern note they share) and provide a warm, encouraging, luxury salon consultation.

Identify the primary visible hair, scalp, skin, or styling concern/opportunity in the photo ("the problem") and recommend the single best matching service from FLORAISON's menu:
1. "Haircut & Styling (₹200–₹300)" — For split/uneven ends, flat volume, outgrown shape, face-framing layers, men's grooming, or kids cuts (from ₹150).
2. "Global Hair Colour / French Balayage (₹700–₹2,000)" — For dull/faded colour, grey coverage, brassiness, wanting dimension/highlights via L'Oréal INOA, French Balayage, French Blending, Dia Color, or Dia Light.
3. "Keratin & Hair Spa" — For visible frizz, dryness, roughness, heat/chemical damage, lack of shine, or scalp fatigue needing smoothing and deep nourishment.
4. "Skin & Facial Treatment" — For tired-looking or dull skin, uneven tone, visible dryness/oiliness, congestion, or pre-event glow prep.
5. "Bridal & Occasion Makeover" — For wedding, reception, party, or milestone event styling and complete makeover looks.
6. "Free Consultation" — Use when the photo is unclear or the concern spans multiple treatments requiring an in-person stylist assessment at T.G. Road, Agartala.

Guidelines:
- Keep observations respectful, constructive, concise, and confidence-boosting (never insulting or diagnostic in a medical sense).
- Write 1-2 crisp, direct sentences for "problemObservation" and 1-2 crisp sentences for "whyItSolvesIt", plus 3 short single-sentence tips in "stylistTips".
- Explain clearly what issue/opportunity you spotted in the photo and how the recommended Floraison service solves it.
- Always set "recommendedServiceOption" to one of the exact 6 strings listed above.
- If the uploaded image does not show hair, face, skin, or a person clearly enough to advise, set "isClearSalonPhoto" to false, politely explain what to upload (a well-lit photo of your hair or face), and default "recommendedServiceOption" to "Free Consultation".`;

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

const WEBSITE_CHAT_SYSTEM_INSTRUCTION = `You are the official AI Salon Concierge & Beauty Advisor for FLORAISON, a luxury unisex hair, skin, spa, and bridal salon in Agartala, trained on the complete content of the Floraison website.

COMPLETE FLORAISON WEBSITE KNOWLEDGE BASE:
- Brand & Tagline: FLORAISON — L'Oréal Professionnel VIP Unisex Salon ("Look Stunning. Feel Confident.") in Agartala.
- Address & Landmark: T.G. Road (Thakur Gobinda Road), Near Sankar Chowmuhani, Ram Nagar, Agartala, Tripura 799001.
- Google Maps Coordinates: 23.844059, 91.27068329 | Google Business Profile: https://share.google/4KhY6miTT5y6uRD8S
- Phone & WhatsApp: +91 98624 79278 (Primary / WhatsApp) and +91 97743 55193 (Booking Desk).
- Opening Hours: Monday to Sunday, 11:00 AM – 10:00 PM (Call ahead on Thursdays and holidays; appointments recommended during peak hours).
- Rating & Reviews: 4.1★ average rating across 125+ verified local reviews (clients such as Ayesha S., Rohan M. for Gentleman's Styling, and Priya K. for Bridal Consultation praise tailored understanding and lasting compliments).
- Client Concerns We Solve: Bad haircuts that don't suit your face shape, hair damage/frizz/hair fall, salons failing to deliver a "wow" result, or wanting a fresh polished look without knowing what suits your features.
- What You'll Experience: Confident & Camera-Ready looks, No More Guessing (styles matched to your face and persona), healthy Hair That Lives root-to-tip, effortless daily polish, unexpected compliments, and a serene mental reset.
- Signature Services & Pricing Menu:
  1. Haircuts & Styling (₹200 – ₹300; Kids Cuts — Prince & Princess cuts — from ₹150): Precision unisex haircuts, kids styling, blowouts, and customized face-framing looks.
  2. L'Oréal Hair Colour & Balayage (₹700 – ₹2,000): Global hair colour, ammonia-free INOA, French Balayage, French Blending, Dia Color, and Dia Light gloss transformations.
  3. Keratin & Hair Spa Rituals (On Consultation): Deep-conditioning hair spa, keratin smoothing, frizz control, and restorative scalp therapies.
  4. Skin, Facials & Bridal (On Consultation): Rejuvenating facials, skin & grooming treatments, and bespoke bridal or party makeovers.
- Featured Offer: Free Consultation (Worth ₹999) — a personalized hair & skin deep-dive assessment plus a customized style roadmap tailored to your facial structure and lifestyle.
- Your Path to Radiance (3 Simple Steps): 01. Book Your Slot (online booking form on this website or WhatsApp; concierge calls within 15 minutes to confirm) -> 02. Visit & Consult (T.G. Road, Ram Nagar studio) -> 03. Transform Your Look.
- Booking Form Services Available (#booking): Free Consultation, Haircut & Styling (₹200–₹300), Global Hair Colour / French Balayage (₹700–₹2,000), Keratin & Hair Spa, Skin & Facial Treatment, and Bridal & Occasion Makeover.
- AI Photo Consultant (#consultant): Visitors can also upload a hair or face photo in the AI Consultant section on this page for instant visual diagnosis and service matching.

RESPONSE GUIDELINES:
1. Answer questions accurately using the Floraison website knowledge above in a warm, polished, luxury salon concierge voice.
2. When asked about directions, landmarks near Sankar Chowmuhani / T.G. Road / Ram Nagar, or nearby places, use Google Maps grounding to provide accurate geographic details.
3. Recommend the most suitable Floraison service(s) and pricing whenever relevant.
4. Keep answers clear and concise (short paragraphs or bullet points), and always end by inviting the user to click the "Book in Form" CTA button directly below your message to reserve their appointment slot.
5. Never invent prices, offers, or services that are not listed on the website above.`;

function matchServiceKeywords(text: string): string | null {
  const lower = text.toLowerCase();
  if (/keratin|hair spa|frizz|dryness|dry hair|smoothing|scalp|damage|hair fall/.test(lower)) {
    return 'Keratin & Hair Spa';
  }
  if (/balayage|inoa|dia color|dia light|hair colou?r|global colou?r|highlights|grey coverage|dye/.test(lower)) {
    return 'Global Hair Colour / French Balayage (₹700–₹2,000)';
  }
  if (/haircut|hair cut|trim|prince|princess|kids cut|blowout|bangs|layers/.test(lower)) {
    return 'Haircut & Styling (₹200–₹300)';
  }
  if (/facial|skin|glow|acne|peel|cleanup|tan/.test(lower)) {
    return 'Skin & Facial Treatment';
  }
  if (/bridal|wedding|bride|occasion|party makeup|makeover/.test(lower)) {
    return 'Bridal & Occasion Makeover';
  }
  return null;
}

function inferRecommendedService(userMessage: string, reply: string): string {
  const fromUser = matchServiceKeywords(userMessage);
  if (fromUser) return fromUser;

  // For broad overview queries (location, hours, all services/menu, pricing), default CTA to Free Consultation
  if (/what services|all services|menu|price list|prices|where|location|address|directions|hours|open|review|rating|offer/i.test(userMessage)) {
    return 'Free Consultation';
  }

  return matchServiceKeywords(reply) || 'Free Consultation';
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
      error: 'Gemini API key is not configured. Please add GEMINI_API_KEY in Settings > Secrets.',
    });
    return;
  }
  if (message.includes('PERMISSION_DENIED') || message.includes('API_KEY_INVALID') || message.includes('403')) {
    res.status(403).json({
      error: 'Gemini API key appears invalid or lacks permission. Please verify it in Settings > Secrets.',
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

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '15mb' }));

  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message, history, location } = req.body ?? {};

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Please enter a message to chat with the Floraison AI Concierge.' });
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
          : 23.844058990478516;
      const lng =
        location && typeof location.longitude === 'number' && Number.isFinite(location.longitude)
          ? location.longitude
          : 91.27068328857422;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction: WEBSITE_CHAT_SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: lat,
                longitude: lng,
              },
            },
          },
        },
      });

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
      handleGeminiRouteError(err, res, 'Unable to reach the Floraison AI Concierge right now. Please try again.');
    }
  });

  app.post('/api/consult', async (req: Request, res: Response) => {
    try {
      const { imageBase64, mimeType, focusArea, concern } = req.body ?? {};

      if (!imageBase64 || typeof imageBase64 !== 'string') {
        res.status(400).json({ error: 'Please upload a photo before starting the consultation.' });
        return;
      }

      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
      const safeMime = typeof mimeType === 'string' && allowedMimes.includes(mimeType) ? mimeType : 'image/jpeg';

      // Strip data URL prefix if present
      const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      if (!cleanBase64 || cleanBase64.length > 14 * 1024 * 1024) {
        res.status(400).json({ error: 'Image is too large or invalid. Please use a photo under 10 MB.' });
        return;
      }

      const ai = getGeminiClient();

      const focusText = typeof focusArea === 'string' && focusArea.trim() ? focusArea.trim() : 'Complete Look (Hair & Skin)';
      const concernText =
        typeof concern === 'string' && concern.trim()
          ? `Client note: "${concern.trim().slice(0, 500)}"`
          : 'No additional note provided by the client.';

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
              text: `Analyze this client photo for a salon consultation at FLORAISON (Agartala). Focus area selected: ${focusText}. ${concernText} Identify the visible hair/skin problem or styling opportunity and recommend the best matching FLORAISON service.`,
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
                description: 'True if the photo clearly shows a person, hair, or face suitable for salon consultation.',
              },
              detectedProblemTitle: {
                type: Type.STRING,
                description: 'Short 3-6 word title of the main observed concern or styling opportunity.',
              },
              problemObservation: {
                type: Type.STRING,
                description: '2-3 respectful, observant sentences describing what is visible in the photo and the styling/care problem identified.',
              },
              recommendedServiceOption: {
                type: Type.STRING,
                description: `Must be exact match to one of: ${ALLOWED_SERVICE_OPTIONS.join(', ')}`,
              },
              recommendedServiceName: {
                type: Type.STRING,
                description: 'Friendly Floraison service name (e.g., L’Oréal French Balayage & Toning, Keratin & Hair Spa Ritual).',
              },
              estimatedPrice: {
                type: Type.STRING,
                description: 'Floraison price range such as ₹200 – ₹300, ₹700 – ₹2,000, or On Consultation.',
              },
              whyItSolvesIt: {
                type: Type.STRING,
                description: '2-3 sentences explaining specifically how this Floraison service solves the problem and what result to expect.',
              },
              stylistTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Exactly 3 concise, practical aftercare or styling tips tailored to this client.',
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

      const parsed = JSON.parse(rawText);
      const validOption = ALLOWED_SERVICE_OPTIONS.includes(parsed.recommendedServiceOption)
        ? parsed.recommendedServiceOption
        : 'Free Consultation';

      res.json({
        ...parsed,
        recommendedServiceOption: validOption,
      });
    } catch (err: unknown) {
      handleGeminiRouteError(err, res, 'Unable to complete photo analysis right now. Please try again.');
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Floraison server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
