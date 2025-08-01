import { GameRun, RunSubmissionForm } from '@/types';

// Date formatting utilities
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateString);
  }
}

// Validation utilities
export function validateRunSubmission(data: RunSubmissionForm): string[] {
  const errors: string[] = [];
  
  if (!data.boss.trim()) {
    errors.push('Boss is required');
  }
  
  if (data.items.length === 0) {
    errors.push('At least one item is required');
  }
  
  if (data.hp < 1 || data.hp > 999) {
    errors.push('HP must be between 1 and 999');
  }
  
  if (data.atk < 0 || data.atk > 999) {
    errors.push('ATK must be between 0 and 999');
  }
  
  if (data.def < 0 || data.def > 999) {
    errors.push('DEF must be between 0 and 999');
  }
  
  if (data.spd < 0 || data.spd > 999) {
    errors.push('SPD must be between 0 and 999');
  }
  
  if (!['victory', 'defeat'].includes(data.outcome)) {
    errors.push('Outcome must be either victory or defeat');
  }
  
  if (data.outcome === 'defeat' && !data.deathReason?.trim()) {
    errors.push('Death reason is required for defeats');
  }
  
  if (data.notes && data.notes.length > 1000) {
    errors.push('Notes must be 1000 characters or less');
  }
  
  return errors;
}

export function validateComment(message: string, authorName?: string): string[] {
  const errors: string[] = [];
  
  if (!message.trim()) {
    errors.push('Comment message is required');
  }
  
  if (message.length > 500) {
    errors.push('Comment must be 500 characters or less');
  }
  
  if (authorName && authorName.length > 50) {
    errors.push('Name must be 50 characters or less');
  }
  
  return errors;
}

// Stat calculation utilities
export function calculateTotalStats(run: GameRun): number {
  return run.hp + run.atk + run.def + run.spd;
}

export function getStatDistribution(run: GameRun): { stat: string; value: number; percentage: number }[] {
  const total = calculateTotalStats(run);
  
  return [
    { stat: 'HP', value: run.hp, percentage: Math.round((run.hp / total) * 100) },
    { stat: 'ATK', value: run.atk, percentage: Math.round((run.atk / total) * 100) },
    { stat: 'DEF', value: run.def, percentage: Math.round((run.def / total) * 100) },
    { stat: 'SPD', value: run.spd, percentage: Math.round((run.spd / total) * 100) }
  ];
}

// Text utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// URL utilities
export function createRunUrl(runId: string): string {
  return `/runs/${runId}`;
}

export function createTwitterShareUrl(run: GameRun, baseUrl: string): string {
  const runUrl = `${baseUrl}${createRunUrl(run.id)}`;
  const outcome = run.outcome === 'victory' ? 'defeated' : 'was slain by';
  const text = `I ${outcome} ${run.boss} in He is Coming! Check out my run:`;
  
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(runUrl)}`;
}

export function createDiscordShareText(run: GameRun, baseUrl: string): string {
  const runUrl = `${baseUrl}${createRunUrl(run.id)}`;
  const outcome = run.outcome === 'victory' ? 'defeated' : 'was slain by';
  
  return `I ${outcome} **${run.boss}** in He is Coming!\n\n**Stats:** HP: ${run.hp}, ATK: ${run.atk}, DEF: ${run.def}, SPD: ${run.spd}\n**Items:** ${run.items.join(', ')}\n\nCheck it out: ${runUrl}`;
}

// CSS utility for conditional classes
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
