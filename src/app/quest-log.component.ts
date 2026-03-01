import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SnackbarMessage {
  text: string;
  type: 'success' | 'error';
  visible: boolean;
}

interface RippleEffect {
  x: number;
  y: number;
  active: boolean;
}

@Component({
  selector: 'app-quest-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quest-log.component.html',
  styleUrl: './quest-log.component.css'
})
export class QuestLogComponent {
  // Form Data
  username = signal('');
  password = signal('');
  dateOfBirth = signal('');
  originStory = signal('');
  selectedClass = signal('');
  startingItem = signal('Iron Shield');

  // UI State
  darkMode = signal(false);
  snackbar = signal<SnackbarMessage>({
    text: '',
    type: 'success',
    visible: false
  });
  rippleEffect = signal<RippleEffect>({
    x: 0,
    y: 0,
    active: false
  });

  // Validation States
  passwordValid = signal(false);
  dateValid = signal(false);
  formValid = computed(() => {
    return (
      this.username().length > 0 &&
      this.passwordValid() &&
      this.dateValid() &&
      this.originStory().length > 0 &&
      this.selectedClass().length > 0
    );
  });

  // Progress calculation (0-100%)
  xpProgress = computed(() => {
    const fields = [
      this.username().length > 0,
      this.passwordValid(),
      this.dateValid(),
      this.originStory().length > 0,
      this.selectedClass().length > 0,
      this.startingItem().length > 0
    ];
    return Math.round((fields.filter(f => f).length / fields.length) * 100);
  });

  // XP bar segments
  xpSegments = computed(() => {
    const count = Math.ceil(this.xpProgress() / 10);
    return Array(count).fill(0).map((_, i) => i);
  });

  classOptions = [
    { id: 'builder', name: '⛏️ BUILDER', description: 'Strong and sturdy' },
    { id: 'bard', name: '🎵 BARD', description: 'Magical and charming' },
    { id: 'paladin', name: '⚔️ PALADIN', description: 'Holy warrior' }
  ];

  itemOptions = ['Iron Shield', 'Phoenix Down', 'Mana Potion'];

  validatePassword(pwd: string): void {
    const isValid = this.isPasswordValid(pwd);
    this.passwordValid.set(isValid);

    if (pwd.length > 0) {
      if (isValid) {
        this.showSnackbar('Critical Hit! Password accepted!', 'success');
      } else {
        this.showSnackbar('Mana Depleted! Password too weak!', 'error');
      }
    }
  }

  isPasswordValid(pwd: string): boolean {
    // At least 8 characters
    if (pwd.length < 8) return false;
    // Must be alphanumeric only
    if (!/^[a-zA-Z0-9]+$/.test(pwd)) return false;
    // Must start with a letter
    if (!/^[a-zA-Z]/.test(pwd)) return false;
    return true;
  }

  validateDateOfBirth(dob: string): void {
    if (!dob) {
      this.dateValid.set(false);
      return;
    }

    const birthDate = new Date(dob);
    const currentDate = new Date();
    const cutoffDate = new Date('2006-12-31');

    if (birthDate <= cutoffDate) {
      this.dateValid.set(true);
      this.showSnackbar('Critical Hit! Age verified!', 'success');
    } else {
      this.dateValid.set(false);
      this.showSnackbar('Level Requirement Not Met! You must be born in 2006 or earlier!', 'error');
    }
  }

  selectClass(classId: string): void {
    this.selectedClass.set(classId);
    this.showSnackbar(`You chose ${classId.toUpperCase()}!`, 'success');
  }

  showSnackbar(text: string, type: 'success' | 'error'): void {
    this.snackbar.set({ text, type, visible: true });
    setTimeout(() => {
      this.snackbar.set({ ...this.snackbar(), visible: false });
    }, 3000);
  }

  toggleDarkMode(): void {
    this.darkMode.set(!this.darkMode());
  }

  triggerRipple(event: MouseEvent): void {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.rippleEffect.set({ x, y, active: true });

    setTimeout(() => {
      this.rippleEffect.set({ ...this.rippleEffect(), active: false });
    }, 600);
  }

  finishQuest(): void {
    if (this.formValid()) {
      this.triggerRipple(event as any);
      this.showSnackbar('🎉 QUEST COMPLETE! Welcome, adventurer!', 'success');
      console.log('Form Data:', {
        username: this.username(),
        dateOfBirth: this.dateOfBirth(),
        class: this.selectedClass(),
        originStory: this.originStory(),
        startingItem: this.startingItem(),
        darkMode: this.darkMode()
      });
    }
  }
}
