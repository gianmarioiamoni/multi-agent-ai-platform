/**
 * Tool Registry Tests
 * Unit tests for tool registry functionality
 */

import { getTool, getAllTools, isToolAvailable, getToolSchemas } from '@/lib/tools/registry';
import type { ToolId } from '@/types/agent.types';

describe('Tool Registry', () => {
  describe('getTool', () => {
    it('should return web_search tool', () => {
      const tool = getTool('web_search');
      expect(tool).toBeDefined();
      expect(tool?.id).toBe('web_search');
      expect(tool?.name).toBe('Web Search');
    });

    it('should return email tool', () => {
      const tool = getTool('email');
      expect(tool).toBeDefined();
      expect(tool?.id).toBe('email');
      expect(tool?.name).toBe('Send Email');
    });

    it('should return undefined for non-existent tool', () => {
      const tool = getTool('non_existent' as ToolId);
      expect(tool).toBeUndefined();
    });
  });

  describe('getAllTools', () => {
    it('should return all registered tools', () => {
      const tools = getAllTools();
      expect(tools.length).toBeGreaterThan(0);
      expect(tools.some((t) => t.id === 'web_search')).toBe(true);
      expect(tools.some((t) => t.id === 'email')).toBe(true);
    });
  });

  describe('isToolAvailable', () => {
    it('should check web_search availability based on TAVILY_API_KEY', () => {
      const originalKey = process.env.TAVILY_API_KEY;
      
      // Test with key
      process.env.TAVILY_API_KEY = 'test-key';
      expect(isToolAvailable('web_search')).toBe(true);
      
      // Test without key
      delete process.env.TAVILY_API_KEY;
      expect(isToolAvailable('web_search')).toBe(false);
      
      // Restore original
      if (originalKey) {
        process.env.TAVILY_API_KEY = originalKey;
      }
    });

    it('should check email availability based on SMTP config', () => {
      const originalHost = process.env.SMTP_HOST;
      const originalPort = process.env.SMTP_PORT;
      const originalUser = process.env.SMTP_USER;
      const originalPass = process.env.SMTP_PASSWORD;
      
      // Test with all config
      process.env.SMTP_HOST = 'smtp.test.com';
      process.env.SMTP_PORT = '587';
      process.env.SMTP_USER = 'test@test.com';
      process.env.SMTP_PASSWORD = 'password';
      expect(isToolAvailable('email')).toBe(true);
      
      // Test without config
      delete process.env.SMTP_HOST;
      expect(isToolAvailable('email')).toBe(false);
      
      // Restore originals
      if (originalHost) process.env.SMTP_HOST = originalHost;
      if (originalPort) process.env.SMTP_PORT = originalPort;
      if (originalUser) process.env.SMTP_USER = originalUser;
      if (originalPass) process.env.SMTP_PASSWORD = originalPass;
    });
  });

  describe('getToolSchemas', () => {
    it('should return schemas for valid tools', () => {
      const schemas = getToolSchemas(['web_search', 'email']);
      expect(schemas.length).toBe(2);
      expect(schemas[0].type).toBe('function');
      expect(schemas[0].function.name).toBe('web_search');
    });

    it('should filter out invalid tool IDs', () => {
      const schemas = getToolSchemas(['web_search', 'invalid_tool' as ToolId]);
      expect(schemas.length).toBe(1);
      expect(schemas[0].function.name).toBe('web_search');
    });
  });
});

