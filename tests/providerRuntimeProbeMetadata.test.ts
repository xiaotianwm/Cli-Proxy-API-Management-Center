import { afterEach, describe, expect, test } from 'bun:test';
import { apiClient } from '../src/services/api/client';
import { providersApi } from '../src/services/api/providers';

const originalGet = apiClient.get;

afterEach(() => {
  apiClient.get = originalGet;
});

describe('provider runtime probe metadata', () => {
  test('loads auth indexes and health history from provider-specific endpoints', async () => {
    const calls: string[] = [];
    apiClient.get = (async (url: string) => {
      calls.push(url);
      const key = url.slice(1);
      return {
        [key]: [
          {
            'api-key': `${key}-secret`,
            'auth-index': `${key}:runtime-index`,
            'upstream-billing': {
              'auth-index': `${key}:runtime-index`,
              status: 'ok',
              'effective-rate-multiplier': 1.25,
              'health-history': [
                {
                  status: 'ok',
                  'latency-ms': 125,
                  'checked-at': '2026-08-01T12:00:00Z',
                },
              ],
            },
          },
        ],
      };
    }) as typeof apiClient.get;

    const results = await Promise.all([
      providersApi.getGeminiConfigs(),
      providersApi.getInteractionsConfigs(),
      providersApi.getCodexConfigs(),
      providersApi.getXAIConfigs(),
      providersApi.getClaudeConfigs(),
    ]);

    expect(calls).toEqual([
      '/gemini-api-key',
      '/interactions-api-key',
      '/codex-api-key',
      '/xai-api-key',
      '/claude-api-key',
    ]);
    for (const configs of results) {
      expect(configs[0]?.authIndex).toContain(':runtime-index');
      expect(configs[0]?.upstreamBilling?.['effective-rate-multiplier']).toBe(1.25);
      expect(configs[0]?.upstreamBilling?.['health-history']).toHaveLength(1);
    }
  });
});
