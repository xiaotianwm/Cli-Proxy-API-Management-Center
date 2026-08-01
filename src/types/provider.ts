/**
 * AI 提供商相关类型
 * 基于原项目 src/modules/ai-providers.js
 */

export interface ModelAlias {
  name: string;
  alias?: string;
  priority?: number;
  testModel?: string;
  image?: boolean;
  thinking?: Record<string, unknown>;
}

export interface ApiKeyEntry {
  apiKey: string;
  proxyUrl?: string;
  weight?: number;
  authIndex?: string;
  upstreamBilling?: UpstreamBillingProbeEntry;
}

export interface UpstreamHealthProbeSample {
  status: string;
  'latency-ms'?: number;
  'http-status'?: number;
  model?: string;
  'checked-at': string;
  error?: string;
}

export interface UpstreamBillingProbeEntry {
  'auth-index': string;
  provider?: string;
  'provider-name'?: string;
  'base-url'?: string;
  'api-key-preview'?: string;
  status: string;
  error?: string;
  'observed-at'?: string;
  'group-rate-multiplier'?: number;
  'user-rate-multiplier'?: number;
  'resolved-rate-multiplier'?: number;
  'peak-rate-enabled'?: boolean;
  'peak-rate-multiplier'?: number;
  'applied-peak-multiplier'?: number;
  'effective-rate-multiplier'?: number;
  'peak-start'?: string;
  'peak-end'?: string;
  timezone?: string;
  'health-history'?: UpstreamHealthProbeSample[];
}

export interface CloakConfig {
  mode?: string;
  strictMode?: boolean;
  sensitiveWords?: string[];
  cacheUserId?: boolean;
}

export interface GeminiKeyConfig {
  apiKey: string;
  priority?: number;
  weight?: number;
  prefix?: string;
  baseUrl?: string;
  proxyUrl?: string;
  models?: ModelAlias[];
  headers?: Record<string, string>;
  excludedModels?: string[];
  disableCooling?: boolean;
  authIndex?: string;
  upstreamBilling?: UpstreamBillingProbeEntry;
}

export interface ProviderKeyConfig {
  apiKey: string;
  priority?: number;
  weight?: number;
  prefix?: string;
  baseUrl?: string;
  websockets?: boolean;
  proxyUrl?: string;
  headers?: Record<string, string>;
  models?: ModelAlias[];
  excludedModels?: string[];
  disableCooling?: boolean;
  cloak?: CloakConfig;
  experimentalCchSigning?: boolean;
  authIndex?: string;
  upstreamBilling?: UpstreamBillingProbeEntry;
}

export interface OpenAIProviderConfig {
  name: string;
  prefix?: string;
  baseUrl: string;
  apiKeyEntries: ApiKeyEntry[];
  disabled?: boolean;
  headers?: Record<string, string>;
  models?: ModelAlias[];
  priority?: number;
  testModel?: string;
  disableCooling?: boolean;
  supportPromptCacheKey?: boolean;
  authIndex?: string;
  /** Original index in the backend openai-compatibility array. */
  sourceIndex?: number;
  upstreamBilling?: UpstreamBillingProbeEntry[];
  [key: string]: unknown;
}
