// Baccarat Game Rules Implementation
export function calculateNaturalWin(playerScore: number, bankerScore: number): boolean {
  return playerScore >= 8 || bankerScore >= 8;
}

export function needsThirdCard(score: number): boolean {
  return score >= 0 && score <= 5;
}

export function shouldBankerDrawThirdCard(bankerScore: number, playerThirdCard: number): boolean {
  if (bankerScore >= 7) return false;
  if (bankerScore <= 2) return true;
  
  // Banker drawing rules based on player's third card
  switch (bankerScore) {
    case 3:
      return playerThirdCard !== 8;
    case 4:
      return [2, 3, 4, 5, 6, 7].includes(playerThirdCard);
    case 5:
      return [4, 5, 6, 7].includes(playerThirdCard);
    case 6:
      return [6, 7].includes(playerThirdCard);
    default:
      return false;
  }
}

export function calculateFinalScore(score: number, thirdCard?: number): number {
  const total = thirdCard !== undefined ? score + thirdCard : score;
  return total % 10;
}

export function validateScore(score: number): boolean {
  return score >= 0 && score <= 9;
}

export function determineWinner(playerScore: number, bankerScore: number): 'player' | 'banker' | 'tie' {
  if (playerScore > bankerScore) return 'player';
  if (bankerScore > playerScore) return 'banker';
  return 'tie';
}