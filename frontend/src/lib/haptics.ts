type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'impact' | 'notification';

class HapticManager {
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = 'vibrate' in navigator;
  }

  private vibrate(pattern: number | number[]): void {
    if (this.isSupported) {
      navigator.vibrate(pattern);
    }
  }

  light(): void {
    this.vibrate(10);
  }

  medium(): void {
    this.vibrate(20);
  }

  heavy(): void {
    this.vibrate(30);
  }

  selection(): void {
    this.vibrate(5);
  }

  impact(): void {
    this.vibrate([10, 50, 10]);
  }

  notification(): void {
    this.vibrate([50, 100, 50]);
  }

  success(): void {
    this.vibrate([10, 50, 10, 50, 30]);
  }

  warning(): void {
    this.vibrate([30, 100, 30, 100, 30]);
  }

  error(): void {
    this.vibrate([100, 50, 100, 50, 100]);
  }

  trigger(type: HapticType): void {
    switch (type) {
      case 'light':
        this.light();
        break;
      case 'medium':
        this.medium();
        break;
      case 'heavy':
        this.heavy();
        break;
      case 'selection':
        this.selection();
        break;
      case 'impact':
        this.impact();
        break;
      case 'notification':
        this.notification();
        break;
    }
  }
}

export const haptics = new HapticManager();

export const triggerHaptic = (type: HapticType) => {
  haptics.trigger(type);
};

export const triggerSuccess = () => {
  haptics.success();
};

export const triggerWarning = () => {
  haptics.warning();
};

export const triggerError = () => {
  haptics.error();
};