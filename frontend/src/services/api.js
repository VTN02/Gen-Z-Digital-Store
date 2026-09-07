/**
 * Services Index — re-exports all service modules.
 * Components should import from here for consistency.
 */

export * from './auth.service';
export * from './dashboard.service';
export { default as apiClient } from './apiClient';
