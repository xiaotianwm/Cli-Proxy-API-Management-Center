import type { UpstreamProbeTaskRef } from '@/services/api/providers';

const HEALTH_TASK_PREFIX = 'health\u0000';

export const upstreamProbeTaskSet = (tasks: UpstreamProbeTaskRef[] | undefined): Set<string> =>
  new Set(
    (tasks ?? [])
      .filter((task) => task?.['auth-index'] && task?.kind)
      .map((task) => `${task.kind}\u0000${task['auth-index']}`)
  );

export const hasCompletedHealthProbe = (
  previous: ReadonlySet<string>,
  next: ReadonlySet<string>
): boolean =>
  Array.from(previous).some((task) => task.startsWith(HEALTH_TASK_PREFIX) && !next.has(task));
