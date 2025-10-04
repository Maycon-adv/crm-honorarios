import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, getTodayISO } from '../helpers';

describe('Helpers Utils', () => {
  describe('formatCurrency', () => {
    it('should format number to BRL currency', () => {
      const result1 = formatCurrency(1000);
      const result2 = formatCurrency(1500.50);
      const result3 = formatCurrency(0);

      // Use regex to handle different currency formatting (space variations)
      expect(result1).toMatch(/R\$\s*1\.000,00/);
      expect(result2).toMatch(/R\$\s*1\.500,50/);
      expect(result3).toMatch(/R\$\s*0,00/);
    });

    it('should handle negative values', () => {
      const result = formatCurrency(-500);
      expect(result).toMatch(/-R\$\s*500,00/);
    });

    it('should handle large values', () => {
      const result = formatCurrency(1000000);
      expect(result).toMatch(/R\$\s*1\.000\.000,00/);
    });
  });

  describe('formatDate', () => {
    it('should format date string to DD/MM/YYYY', () => {
      const date = '2024-01-15';
      const formatted = formatDate(date);
      expect(formatted).toBe('15/01/2024');
    });

    it('should handle empty string', () => {
      const formatted = formatDate('');
      expect(formatted).toBe('');
    });

    it('should handle invalid date', () => {
      const formatted = formatDate('invalid-date');
      expect(formatted).toBe('Data inválida');
    });
  });

  describe('getTodayISO', () => {
    it('should return today date in YYYY-MM-DD format', () => {
      const today = getTodayISO();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return a valid date', () => {
      const today = getTodayISO();
      const date = new Date(today);
      expect(date).toBeInstanceOf(Date);
      expect(isNaN(date.getTime())).toBe(false);
    });
  });
});
