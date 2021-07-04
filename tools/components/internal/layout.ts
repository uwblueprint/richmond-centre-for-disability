import { Role } from '@lib/types'; // Role enum

// Enum for internal page paths
export enum InternalPagePath {
  Requests = '/admin',
  PermitHolders = '/admin/permit-holders',
  Reports = '/admin/reports',
  AdminManagement = '/admin/admin-management',
}

/**
 * Get the Header tab index given a page path
 * @param path - The path
 * @param role - The role of the user
 * @returns The index of the tab corresponding to the path
 */
export const getTabIndex = (path: string, role: Role): number => {
  if (role === Role.Secretary) {
    // Secretary
    switch (path) {
      case InternalPagePath.Requests:
        return 0;
      case InternalPagePath.PermitHolders:
        return 1;
      default:
        return 0;
    }
  } else if (role === Role.Accounting) {
    // Accounting
    return 0; // Only has access to 1 tab
  } else {
    // Admin
    switch (path) {
      case InternalPagePath.Requests:
        return 0;
      case InternalPagePath.PermitHolders:
        return 1;
      case InternalPagePath.Reports:
        return 2;
      case InternalPagePath.AdminManagement:
        return 3;
      default:
        return 0;
    }
  }
};
