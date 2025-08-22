const today = new Date();
const currentYear = today.getFullYear().toString();
const currentMonth: number = (today.getMonth())
const root = "/selection";


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
 * @param company_id - The target page to navigate to (sales, payroll, or expenses)
 * @returns The URL the link should lead to
 */

export const getPagesLink = (currentPath: string, company_id: string): string => {
  let layers = currentPath.split('/')

  if (layers.length === 4) { // calendar level 
    return root + '/rents/' + company_id; 
  } else {
    return root + '/rents/' + company_id + '/' + currentYear + '/' + (currentMonth + 1);
  }
  
};

export const getOtherPagesLink = (currentPath: string, targetPage: string): string => {
  if (currentPath.startsWith("/settings")) {
    return currentPath;
  }
   
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
    let layers = path.split('/')
    if (layers.length === 4) { // calendar level 
      return { backURL: root  };
    } else if (layers.length === 5) { // rents level
      backURL = root + '/rents/' + layers[3];
    }
    
    return { backURL: root };
}; 