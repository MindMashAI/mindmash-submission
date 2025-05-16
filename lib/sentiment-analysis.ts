// Sentiment analysis service for analyzing message content

export interface SentimentResult {
  score: number // Range from 0 (negative) to 1 (positive)
  label: string // Human-readable label
  confidence: number // Confidence in the analysis (0-1)
  emotions: {
    // Detected emotions and their strengths
    [emotion: string]: number
  }
  keywords: string[] // Key sentiment-bearing words detected
}

// Emotion detection patterns
const EMOTION_PATTERNS: Record<string, RegExp> = {
  joy: /\b(happy|joy|delighted|excited|pleased|glad|thrilled|wonderful|amazing|excellent|great|good)\b/i,
  sadness: /\b(sad|unhappy|depressed|disappointed|upset|miserable|heartbroken|gloomy|down|terrible|awful)\b/i,
  anger: /\b(angry|mad|furious|outraged|annoyed|irritated|frustrated|enraged|hostile)\b/i,
  fear: /\b(afraid|scared|frightened|terrified|anxious|worried|nervous|concerned|uneasy)\b/i,
  surprise: /\b(surprised|shocked|amazed|astonished|stunned|unexpected|wow|whoa)\b/i,
  disgust: /\b(disgusted|revolted|repulsed|gross|nasty|offensive|unpleasant)\b/i,
  trust: /\b(trust|reliable|dependable|honest|faithful|confident|secure|certain)\b/i,
  anticipation: /\b(anticipate|expect|look forward|await|hope|eager|excited about)\b/i,
}

// Positive and negative word lists
const POSITIVE_WORDS = [
  "good",
  "great",
  "excellent",
  "wonderful",
  "amazing",
  "fantastic",
  "terrific",
  "outstanding",
  "superb",
  "brilliant",
  "awesome",
  "fabulous",
  "incredible",
  "marvelous",
  "perfect",
  "positive",
  "beneficial",
  "favorable",
  "helpful",
  "useful",
  "valuable",
  "advantageous",
  "effective",
  "efficient",
  "productive",
  "successful",
  "impressive",
  "exceptional",
  "remarkable",
  "admirable",
  "commendable",
  "praiseworthy",
  "laudable",
  "meritorious",
  "worthy",
  "deserving",
  "satisfactory",
  "pleasing",
  "gratifying",
  "rewarding",
  "fulfilling",
  "enjoyable",
  "pleasant",
  "delightful",
  "charming",
  "lovely",
  "attractive",
  "appealing",
  "alluring",
  "engaging",
  "captivating",
  "fascinating",
  "interesting",
  "intriguing",
  "compelling",
  "innovative",
  "creative",
  "original",
  "unique",
  "novel",
  "fresh",
  "new",
  "modern",
  "contemporary",
  "cutting-edge",
  "state-of-the-art",
  "advanced",
  "sophisticated",
  "elegant",
  "refined",
  "polished",
  "sleek",
  "stylish",
  "chic",
  "fashionable",
  "trendy",
  "cool",
  "hip",
  "popular",
  "well-liked",
  "well-received",
  "acclaimed",
  "celebrated",
  "renowned",
  "famous",
  "distinguished",
  "eminent",
  "prominent",
  "notable",
  "noteworthy",
  "significant",
  "important",
  "essential",
  "crucial",
  "critical",
  "vital",
  "indispensable",
  "necessary",
  "needed",
  "required",
  "fundamental",
  "basic",
  "core",
  "central",
  "key",
  "main",
  "primary",
  "principal",
  "chief",
  "leading",
  "foremost",
  "top",
  "premium",
  "superior",
  "high-quality",
  "first-rate",
  "first-class",
  "top-notch",
  "top-tier",
  "high-end",
  "upscale",
  "luxurious",
  "opulent",
  "lavish",
  "sumptuous",
  "magnificent",
  "splendid",
  "glorious",
  "grand",
  "majestic",
  "impressive",
  "imposing",
  "striking",
  "stunning",
  "breathtaking",
  "awe-inspiring",
  "spectacular",
  "sensational",
  "phenomenal",
  "extraordinary",
  "remarkable",
  "astounding",
  "astonishing",
  "staggering",
  "mind-blowing",
  "mind-boggling",
  "unbelievable",
  "incredible",
  "inconceivable",
  "unimaginable",
  "unthinkable",
  "undreamed-of",
  "undreamt-of",
]

const NEGATIVE_WORDS = [
  "bad",
  "poor",
  "terrible",
  "horrible",
  "awful",
  "dreadful",
  "abysmal",
  "atrocious",
  "appalling",
  "deplorable",
  "unacceptable",
  "inadequate",
  "insufficient",
  "deficient",
  "lacking",
  "wanting",
  "unsatisfactory",
  "disappointing",
  "discouraging",
  "disheartening",
  "distressing",
  "troubling",
  "worrying",
  "concerning",
  "alarming",
  "disturbing",
  "upsetting",
  "annoying",
  "irritating",
  "aggravating",
  "exasperating",
  "frustrating",
  "infuriating",
  "maddening",
  "vexing",
  "irksome",
  "bothersome",
  "troublesome",
  "problematic",
  "difficult",
  "challenging",
  "hard",
  "tough",
  "demanding",
  "arduous",
  "strenuous",
  "laborious",
  "onerous",
  "burdensome",
  "taxing",
  "trying",
  "stressful",
  "painful",
  "hurtful",
  "harmful",
  "damaging",
  "detrimental",
  "injurious",
  "deleterious",
  "adverse",
  "unfavorable",
  "disadvantageous",
  "inimical",
  "prejudicial",
  "destructive",
  "ruinous",
  "catastrophic",
  "disastrous",
  "calamitous",
  "cataclysmic",
  "tragic",
  "unfortunate",
  "unlucky",
  "unhappy",
  "sad",
  "sorrowful",
  "mournful",
  "grievous",
  "lamentable",
  "regrettable",
  "pitiful",
  "pathetic",
  "woeful",
  "wretched",
  "miserable",
  "grim",
  "dire",
  "grave",
  "serious",
  "severe",
  "critical",
  "acute",
  "extreme",
  "intense",
  "excessive",
  "overwhelming",
  "unbearable",
  "intolerable",
  "insufferable",
  "unendurable",
  "unsupportable",
  "insupportable",
  "unacceptable",
  "objectionable",
  "offensive",
  "repugnant",
  "repulsive",
  "revolting",
  "disgusting",
  "sickening",
  "nauseating",
  "nauseous",
  "loathsome",
  "hateful",
  "detestable",
  "abhorrent",
  "abominable",
  "odious",
  "vile",
  "foul",
  "nasty",
  "mean",
  "cruel",
  "brutal",
  "savage",
  "vicious",
  "ferocious",
  "fierce",
  "violent",
  "dangerous",
  "hazardous",
  "perilous",
  "risky",
  "unsafe",
  "threatening",
  "menacing",
  "ominous",
  "sinister",
  "malevolent",
  "malicious",
  "malignant",
  "evil",
  "wicked",
  "villainous",
  "nefarious",
  "heinous",
  "atrocious",
  "monstrous",
  "horrific",
  "horrifying",
  "horrendous",
  "hideous",
  "ghastly",
  "grisly",
  "gruesome",
  "macabre",
  "nightmarish",
  "hellish",
  "infernal",
  "diabolical",
  "fiendish",
  "demonic",
  "devilish",
  "satanic",
  "unholy",
  "ungodly",
  "godless",
  "immoral",
  "unethical",
  "unprincipled",
  "unscrupulous",
  "dishonorable",
  "disreputable",
  "disgraceful",
  "shameful",
  "ignominious",
  "scandalous",
  "outrageous",
  "shocking",
  "appalling",
  "terrible",
]

// Analyze sentiment of a message
export function analyzeSentiment(message: string): SentimentResult {
  const lowerMessage = message.toLowerCase()
  const words = lowerMessage.split(/\s+/)

  // Count positive and negative words
  let positiveCount = 0
  let negativeCount = 0
  const sentimentKeywords: string[] = []

  // Check for positive words
  for (const word of POSITIVE_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "i")
    if (regex.test(lowerMessage)) {
      positiveCount++
      sentimentKeywords.push(word)
    }
  }

  // Check for negative words
  for (const word of NEGATIVE_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "i")
    if (regex.test(lowerMessage)) {
      negativeCount++
      sentimentKeywords.push(word)
    }
  }

  // Calculate base sentiment score (0-1)
  const totalSentimentWords = positiveCount + negativeCount
  let sentimentScore = 0.5 // Neutral default

  if (totalSentimentWords > 0) {
    sentimentScore = positiveCount / totalSentimentWords
  }

  // Detect emotions
  const emotions: { [emotion: string]: number } = {}
  let totalEmotions = 0

  for (const [emotion, pattern] of Object.entries(EMOTION_PATTERNS)) {
    const matches = lowerMessage.match(pattern)
    if (matches) {
      const strength = matches.length / words.length
      emotions[emotion] = strength
      totalEmotions += strength
    }
  }

  // Normalize emotion strengths
  if (totalEmotions > 0) {
    for (const emotion in emotions) {
      emotions[emotion] = emotions[emotion] / totalEmotions
    }
  }

  // Determine confidence based on the number of sentiment words and message length
  const confidence = Math.min(0.9, Math.max(0.3, totalSentimentWords / Math.min(words.length, 20)))

  // Determine sentiment label
  let sentimentLabel = "Neutral"
  if (sentimentScore >= 0.75) {
    sentimentLabel = "Very Positive"
  } else if (sentimentScore >= 0.6) {
    sentimentLabel = "Positive"
  } else if (sentimentScore <= 0.25) {
    sentimentLabel = "Very Negative"
  } else if (sentimentScore <= 0.4) {
    sentimentLabel = "Negative"
  }

  return {
    score: sentimentScore,
    label: sentimentLabel,
    confidence,
    emotions,
    keywords: sentimentKeywords.slice(0, 5), // Limit to top 5 keywords
  }
}

// Get a color based on sentiment score
export function getSentimentColor(score: number): string {
  if (score >= 0.75) return "text-green-500"
  if (score >= 0.6) return "text-green-400"
  if (score <= 0.25) return "text-red-500"
  if (score <= 0.4) return "text-red-400"
  return "text-yellow-400"
}

// Get a background color based on sentiment score
export function getSentimentBgColor(score: number): string {
  if (score >= 0.75) return "bg-green-500"
  if (score >= 0.6) return "bg-green-400"
  if (score <= 0.25) return "bg-red-500"
  if (score <= 0.4) return "bg-red-400"
  return "bg-yellow-400"
}
