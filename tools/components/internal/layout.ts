import { Role } from '@lib/types'; // Role enum

// Enum for internal page paths
export enum InternalPagePath {
  Requests = '/admin',
  Request = '/admin/request',
  PermitHolders = '/admin/permit-holders',
  PermitHolder = '/admin/permit-holder',
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
    if (path === InternalPagePath.Requests || path.includes(InternalPagePath.Request)) {
      return 0;
    }
    if (path === InternalPagePath.PermitHolders || path.includes(InternalPagePath.PermitHolder)) {
      return 1;
    }
    return 0;
  } else if (role === Role.Accounting) {
    // Accounting
    return 0; // Only has access to 1 tab
  } else {
    //
    if (path === InternalPagePath.Requests || path.includes(InternalPagePath.Request)) {
      return 0;
    }
    if (path === InternalPagePath.PermitHolders || path.includes(InternalPagePath.PermitHolder)) {
      return 1;
    }
    if (path === InternalPagePath.Reports) {
      return 2;
    }
    if (path === InternalPagePath.AdminManagement) {
      return 3;
    }
    return 0;
  }
};
