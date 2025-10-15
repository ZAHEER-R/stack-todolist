// Sound effect utilities
export const playSound = (type: string) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Different frequencies for different operations
  const frequencies: Record<string, number> = {
    push: 523.25, // C5
    pop: 392.00, // G4
    peek: 659.25, // E5
    undo: 440.00, // A4
    redo: 493.88, // B4
    iterate: 587.33, // D5
    clear: 329.63, // E4
    complete: 783.99, // G5
    victory: 1046.50, // C6
    ok: 698.46, // F5
  };

  oscillator.frequency.value = frequencies[type] || 440;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
};
