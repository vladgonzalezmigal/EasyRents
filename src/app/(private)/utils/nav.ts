const today = new Date();
const currentYear = today.getFullYear().toString();
const currentMonth: number = (today.getMonth())
const root = "/selection";
const pages: string[] = ["rents"];
const otherPages: string[] = ["mail", "settings", "analytics"];


/**
 * Extracts the active page from the current path
 * 
 * @param pathname - The current URL path
 * @returns The active page (sales, payroll, expenses) or undefined if not found
 */
export const getActiveForm = (pathname: string, company_name?: string): string => {  
  for (const page of pages) {
    if (pathname.includes(page)) {
      return page + (company_name ? `: ${company_name}` : '');
    }
  }

  for (const page of otherPages) {
    if (pathname.includes(page)) {
      return page;
    }
  }
  
  // Return undefined if no page is found in the pathname
  return 'selection';
};

/**
 * Function to generate page links based on current path and target page
 * 
 * @param currentPath - The current URL path
 * @param company_id - The target page to navigate to (sales, payroll, or expenses)
 * @returns The URL the link should lead to
 */

export const getPagesLink = (currentPath: string, company_id: string): string => {
  const layers = currentPath.split('/')

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
    let backURL: string | undefined;
    const layers = path.split('/')
    if (layers.length === 4) { // calendar level 
      return { backURL: root  };
    } else if (layers.length === 6) { // rents level
      backURL = root + '/rents/' + layers[3];
    }
    
    return { backURL: backURL || root };
}; 