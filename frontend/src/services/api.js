/**
 * Services Index — re-exports all service modules.
 * Components should import from here for consistency.
 */

export * from '../epics/ep04-administration/services/auth.service';
export * from '../epics/ep04-administration/services/dashboard.service';
export { default as apiClient } from './apiClient';
