import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), LocalStorageService],
    });
    service = TestBed.inject(LocalStorageService);

    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem and getItem', () => {
    it('should store and retrieve a string value', () => {
      const key = 'test-key';
      const value = 'test-value';

      const setResult = service.setItem(key, value);
      expect(setResult).toBe(true);

      const retrievedValue = service.getItem(key);
      expect(retrievedValue).toBe(value);
    });

    it('should return null for non-existent key', () => {
      const result = service.getItem('non-existent-key');
      expect(result).toBeNull();
    });
  });

  describe('setObject and getObject', () => {
    it('should store and retrieve an object', () => {
      const key = 'test-object';
      const testObject = { name: 'test', value: 123, active: true };

      const setResult = service.setObject(key, testObject);
      expect(setResult).toBe(true);

      const retrievedObject = service.getObject(key);
      expect(retrievedObject).toEqual(testObject);
    });

    it('should return null for invalid JSON', () => {
      localStorage.setItem('invalid-json', '{invalid json}');

      const result = service.getObject('invalid-json');
      expect(result).toBeNull();
    });

    it('should return null for non-existent key', () => {
      const result = service.getObject('non-existent-key');
      expect(result).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all items from localStorage', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      service.clear();

      expect(localStorage.getItem('key1')).toBeNull();
      expect(localStorage.getItem('key2')).toBeNull();
    });
  });
});
