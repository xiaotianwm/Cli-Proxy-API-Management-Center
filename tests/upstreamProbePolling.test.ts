import { describe, expect, test } from 'bun:test';
import {
  hasCompletedHealthProbe,
  upstreamProbeTaskSet,
} from '../src/features/providers/upstreamProbePolling';

describe('upstream probe polling transitions', () => {
  test('detects a completed health task without treating billing completion as health', () => {
    const previous = upstreamProbeTaskSet([
      { 'auth-index': 'provider-a', kind: 'billing' },
      { 'auth-index': 'provider-a', kind: 'health' },
    ]);

    expect(
      hasCompletedHealthProbe(
        previous,
        upstreamProbeTaskSet([{ 'auth-index': 'provider-a', kind: 'health' }])
      )
    ).toBeFalse();
    expect(hasCompletedHealthProbe(previous, upstreamProbeTaskSet([]))).toBeTrue();
  });

  test('keeps separate tasks for each upstream and probe kind', () => {
    const running = upstreamProbeTaskSet([
      { 'auth-index': 'provider-a', kind: 'health' },
      { 'auth-index': 'provider-b', kind: 'health' },
      { 'auth-index': 'provider-b', kind: 'billing' },
    ]);

    expect(running.size).toBe(3);
    expect(
      hasCompletedHealthProbe(
        running,
        upstreamProbeTaskSet([
          { 'auth-index': 'provider-a', kind: 'health' },
          { 'auth-index': 'provider-b', kind: 'billing' },
        ])
      )
    ).toBeTrue();
  });
});
