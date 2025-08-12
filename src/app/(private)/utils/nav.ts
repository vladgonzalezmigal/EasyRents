/**
 * Extracts the active page from the current path
 * 
 * @param pathname - The current URL path
 * @returns The active page (sales, payroll, expenses) or undefined if not found
 */
export const getActiveForm = (pathname: string): string => {
  const pages: Pages[] = ["sales", "payroll", "expenses"];
  
  // Check if any of the page names appear in the pathname
  for (const page of pages) {
    if (pathname.includes(page)) {
      return page;
    }
  }

  const otherPages: string[] = ["mail", "settings", "analytics"];
  for (const page of otherPages) {
    if (pathname.includes(page)) {
      return page;
    }
  }
  
  // Return undefined if no page is found in the pathname
  return 'selection';
};

/**
 * Extracts the active store ID from the current path
 * 
 * @param storeIDs - Array of store IDs to check against
 * @param pathname - The current URL path
 * @returns The active store ID or 'error' if not found
 */
export const getActiveSubpage = (storeIDs: string[], pathname: string): string => {
  const pathParts = pathname.split('/');
  
  // Check if pathParts[3] matches any storeID
  if (pathParts.length > 3) {
    const potentialStoreID = pathParts[3];
    if (storeIDs.includes(potentialStoreID)) {
      return potentialStoreID;
    }
  }
  
  // Return error if no store ID is found in the pathname
  return 'error';
};


/**
 * Type representing the available pages in the application
 */
export type Pages = "sales" | "payroll" | "expenses";

/**
 * Function to generate page links based on current path and target page
 * 
 * @param currentPath - The current URL path
 * @param targetPage - The target page to navigate to (sales, payroll, or expenses)
 * @returns The URL the link should lead to
 */

export const getPagesLink = (currentPath: string, targetPage: string): string => {
  if (currentPath.includes(targetPage)) {
    return currentPath;
  }
  // If we're at the selection root, return target page 
  if (currentPath === "/selection") {
    return `/selection/${targetPage}`;
  }
  // If we're at /selection/ followed by a search page 
  if ((currentPath.startsWith("/selection/payroll") || currentPath.startsWith("/selection/expenses")) && currentPath.split('/').length == 3) {
    return `/selection/${targetPage}`;
  } else if (currentPath.startsWith("/selection/sales") && currentPath.split('/').length == 4) {
    return `/selection/${targetPage}`;
  }

  
  
  // If we're at /selection/[page]/year/month || /selection/[page]/[store_id]/year/month
  if (((currentPath.includes("sales")) && currentPath.split('/').length === 6)) {
    const pathParts = currentPath.split('/');
    const year = pathParts[4];
    const month = pathParts[5];
    if (targetPage === "payroll"){
      return `/selection/${targetPage}/${year}/${month}/1`;
    }
    return `/selection/${targetPage}/${year}/${month}`;
  } else if (currentPath.includes("payroll") && targetPage !== "payroll" && currentPath.split('/').length === 6) {
    const pathParts = currentPath.split('/');
    const year = pathParts[3];
    const month = pathParts[4];

    return `/selection/${targetPage}/${year}/${month}`;
  } else if (currentPath.split('/').length === 5) {

    const pathParts = currentPath.split('/');
    const year = pathParts[3];
    const month = pathParts[4];
    if (targetPage === "payroll"){
      return `/selection/${targetPage}/${year}/${month}/1`;
    }
    return `/selection/${targetPage}/${year}/${month}`;
  } 
  
  // Default fallback
  return "/selection";
};

export const getOtherPagesLink = (currentPath: string, targetPage: string): string => {
  if (currentPath.startsWith("/settings")) {
    return currentPath;
  }
  
  // If we're at /selection/[page]/year/month || /selection/[page]/[store_id]/year/month
  // if ((currentPath.includes("sales") && currentPath.split('/').length === 6)) {
  //   const pathParts = currentPath.split('/');
  //   const year = pathParts[4];
  //   const month = pathParts[5];
  //   return `/selection/${targetPage}/${year}/${month}`;
  // } else if (currentPath.split('/').length === 5) {
  //   const pathParts = currentPath.split('/');
  //   const year = pathParts[3];
  //   const month = pathParts[4];
  //   return `/selection/${targetPage}/${year}/${month}`;
  // } 
  
  // Default fallback
  return `/${targetPage}`;
};


/**
 * Interface representing the navigation configuration
 */
interface BackConfig {
    backURL: string;
}
/**
 * Determines the navigation configuration based on the current path
 * 
 * @param path - The current URL path
 * @returns NavConfig object with the appropriate back URL
 */

export const getBackConfig = (path: string): BackConfig => {
    // Determine the back URL based on path pattern
    let backURL: string | undefined;
    
    // Extract path parts
    const pathParts = path.split('/').filter(part => part);
    // Check if path matches the year/month pattern (e.g., .../something/2023/01)
    if (/\/\d{4}\/\d{1,2}$/.test(path)) {
        // For year/month pattern, return everything before year
        const yearIndex = path.lastIndexOf('/', path.lastIndexOf('/') - 1);
        backURL = path.substring(0, yearIndex);
    } else if (pathParts.length === 5 && path.includes('payroll')) {
      backURL = '/selection/payroll'



    } else if (pathParts.length === 3 && path.includes('sales')) {
        // For sales with 3 layers (selection/sales/storeId), go back to selection
        backURL = '/selection';
    } else if (pathParts.length > 0) {
        // For other paths, pop off the last segment
        backURL = '/' + pathParts.slice(0, -1).join('/');
        // If we're at the root level, don't return an empty path
        if (backURL === '/') {
            backURL = undefined;
        }
    }
    
    return { backURL: backURL || '/selection' };
}; 