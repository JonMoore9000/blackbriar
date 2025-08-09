import OpenAI from 'openai';
import { GameRun } from '@/types';
import { getBossById, getItemById } from '@/lib/serverGameData';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateRoast(run: GameRun): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const boss = await getBossById(run.boss);
  const items = await Promise.all(
    run.items.map(async itemId => await getItemById(itemId))
  ).then(items => items.filter(Boolean));
  const itemNames = items.map(item => item!.name).join(', ');
  
  const totalStats = run.hp + run.atk + run.def + run.spd;
  const playerName = run.playerName || 'Anonymous';
  
  // Build context for the AI
  let context = `Player: ${playerName}\n`;
  context += `Boss: ${boss?.name || run.boss} (${boss?.difficulty || 'unknown'} difficulty)\n`;
  context += `Stats: HP: ${run.hp}, ATK: ${run.atk}, DEF: ${run.def}, SPD: ${run.spd} (Total: ${totalStats})\n`;
  context += `Items: ${itemNames || 'None'}\n`;
  context += `Outcome: ${run.outcome}\n`;
  
  if (run.outcome === 'defeat' && run.deathReason) {
    context += `Death Reason: ${run.deathReason}\n`;
  }
  
  if (run.notes) {
    context += `Notes: ${run.notes}\n`;
  }

  // Create different prompts based on outcome
  let prompt: string;
  
  if (run.outcome === 'victory') {
    prompt = `You are a sarcastic AI that roasts players in the horror game "We Are Losing". A player just WON against a boss. Write a short, witty, sarcastic congratulations that's playfully mocking but not mean-spirited. Focus on their stats, items, or strategy. Keep it under 100 characters and make it funny.

${context}

Roast:`;
  } else {
    prompt = `You are a sarcastic AI that roasts players in the horror game "We Are Losing". A player just DIED to a boss. Write a short, brutal but humorous roast about their failure. Focus on their terrible stats, poor item choices, or obvious mistakes. Be savage but funny, not genuinely mean. Keep it under 100 characters.

${context}

Roast:`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a witty, sarcastic AI that creates humorous roasts for gaming failures and victories. Keep responses short, punchy, and entertaining.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 50,
      temperature: 0.9, // High creativity for funnier roasts
    });

    const roast = completion.choices[0]?.message?.content?.trim();
    
    if (!roast) {
      throw new Error('No roast generated');
    }

    // Clean up the roast (remove quotes if AI added them)
    return roast.replace(/^["']|["']$/g, '');
    
  } catch (error) {
    console.error('Error generating AI roast:', error);
    
    // Fallback roasts if API fails
    const fallbackRoasts = run.outcome === 'victory' 
      ? [
          "Congrats on not dying... this time.",
          "Even a broken clock is right twice a day.",
          "Victory by pure luck, impressive.",
          "The boss must have felt sorry for you."
        ]
      : [
          "Git gud, seriously.",
          "That was painful to watch.",
          "Maybe try an easier game?",
          "The boss sends their regards.",
          "Better luck next life."
        ];
    
    return fallbackRoasts[Math.floor(Math.random() * fallbackRoasts.length)];
  }
}

// Function to generate and save roast for an existing run
export async function generateAndSaveRoast(runId: string, forceRegenerate: boolean = false): Promise<string> {
  const { getRunById } = await import('./firebaseStorage');
  const run = await getRunById(runId);

  if (!run) {
    throw new Error('Run not found');
  }

  // Only return existing roast if we're not forcing regeneration
  if (run.aiRoast && !forceRegenerate) {
    return run.aiRoast;
  }

  const roast = await generateRoast(run);

  // Update the run with the roast
  const { updateRunRoast } = await import('./firebaseStorage');
  await updateRunRoast(runId, roast);

  return roast;
}
