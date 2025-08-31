import { DocMetaData } from "../types/mailTypes";




/**
 * Checks the health status of the backend server
 * @async
 * @function fetchHealth
 * @returns {Promise<{ error?: string }>} Promise resolving to an object containing an error message if the health check fails
 * @throws {Error} If BACKEND_URL environment variable is missing or if the health check request fails
 */

export const fetchHealth = async () => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";
  try {
    if (!BACKEND_URL) {
      throw new Error("Missing BACKEND_URL environment variable");
    }
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
  
    const options: RequestInit = {
      method: 'GET',
      headers,
      mode: 'cors',
    };
    const response = await fetch(`${BACKEND_URL}/health`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return ;
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'An unexpected error occurred'};
  }
}

/**
 * Sends email with attached files and metadata
 * @async
 * @function sendEmail
 * @param {File[]} files - Array of files to be attached to the email
 * @param {DocMetaData[]} metadata - Array of metadata for each file
 * @throws {Error} If BACKEND_URL is missing or if the email request fails
 */
export const sendEmail = async (files: File[], metadata: DocMetaData[]) => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  
  if (!BACKEND_URL) {
    throw new Error("Missing BACKEND_URL environment variable");
  }

  const formData = new FormData();
  
  // Append each file
  files.forEach((file) => {
    formData.append('files', file);
  });

  // Append entire metadata array as one JSON string
  formData.append('metadata', JSON.stringify(metadata));

  const response = await fetch(`${BACKEND_URL}/send-pdfs`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }
};
