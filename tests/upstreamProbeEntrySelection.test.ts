import { describe, expect, test } from 'bun:test';
import { openaiToResource } from '../src/features/providers/adapters';
import type { OpenAIProviderConfig } from '../src/types';

const healthSample = {
  status: 'ok',
  'latency-ms': 250,
  'checked-at': '2026-07-31T12:00:00Z',
};

const provider: OpenAIProviderConfig = {
  name: 'multi-key',
  baseUrl: 'https://example.com/v1',
  apiKeyEntries: [
    {
      apiKey: 'key-a',
      authIndex: 'provider-a',
      upstreamBilling: {
        'auth-index': 'provider-a',
        status: 'ok',
        'effective-rate-multiplier': 1,
      },
    },
    {
      apiKey: 'key-b',
      authIndex: 'provider-b',
      upstreamBilling: {
        'auth-index': 'provider-b',
        status: 'ok',
        'effective-rate-multiplier': 2,
        'health-history': [healthSample],
      },
    },
  ],
};

describe('OpenAI upstream probe selection', () => {
  test('keeps billing and health on the first key when no provider auth index is present', () => {
    const resource = openaiToResource(provider, 0);

    expect(resource.authIndex).toBe('provider-a');
    expect(resource.upstreamBilling?.label).toBe('x1');
    expect(resource.upstreamHealth).toBeUndefined();
  });

  test('uses the same explicitly selected key for billing and health', () => {
    const resource = openaiToResource({ ...provider, authIndex: 'provider-b' }, 0);

    expect(resource.upstreamBilling?.label).toBe('x2');
    expect(resource.upstreamHealth?.history).toEqual([healthSample]);
  });
});
