// utils/canPerformOperation.ts
import { CrudOperation, DeleteValidationParams, PerformCrudValidationParams, UpdateValidationParams,
     PerformCreateParams,
     PerformDeleteParams, PerformUpdateParams, PerformReadParams } from "@/app/(private)/features/handleForms/types/operationTypes";
import {  CanDeleteOperationHandler, CanCreateOperationHandler, CanUpdateOperationHandler } from "./validationHandler";
import { PerformCreateOperationHandler, PerformDeleteOperationHandler, PerformReadOperationHandler, PerformUpdateOperationHandler } from "./operationHandler";
import {  SupabaseClient, User } from "@supabase/supabase-js";
import { CrudResponseData, PerformCrudParams } from "../types/operationTypes";

/**
 * Validates if the current session can perform the requested operation
 * @param session - The current user session state
 * @param operation - The CRUD operation to perform (create, read, update, delete)
 * @param params - Optional validation parameters specific to the operation
 * @returns A Session object if operation is allowed, or an error message string
 */
export function canPerformOperation(
    user: User,
    operation: CrudOperation,
    params?: PerformCrudValidationParams
): string | User {
    let handler: { execute: () => string | User } | undefined;

    switch (operation) {
        case 'delete':
            handler = new CanDeleteOperationHandler(user, params as DeleteValidationParams);
            break;
        case 'create':
            handler = new CanCreateOperationHandler(user);
            break;
        case 'read':
            // TODO: Implement ReadOperationHandler
            // handler = new ReadOperationHandler(session, params as ReadParams);
            break;
        case 'update':
            handler = new CanUpdateOperationHandler(user, params as UpdateValidationParams);
            break;
        default:
            return "Invalid operation";
    }

    return !handler 
        ? "Invalid operation handler" 
        : handler.execute(); // Delegate to the handler's execute method
}

/**
 * Performs the requested operation on the database
 * @param operation - The CRUD operation to perform (create, read, update, delete)
 * @param params - Optional parameters specific to the operation
 * @returns A Session object if operation is successful, or an error message string
 */

export function performCrudOperation(
    operation: CrudOperation,
    params: PerformCrudParams,
    supabase: SupabaseClient,
    user_id?: string
): Promise<CrudResponseData> | string {
    let handler: { execute: () => Promise<CrudResponseData> } | undefined;

    switch (operation) {
        case 'delete':
            handler = new PerformDeleteOperationHandler(params as PerformDeleteParams, supabase);
            break;
        case 'create':
            if (!user_id) {
                return "User ID is required";
            }
            handler = new PerformCreateOperationHandler(params as PerformCreateParams, supabase, user_id);
            break;
        case 'read':
            handler = new PerformReadOperationHandler(params as PerformReadParams, supabase);
            break;
        case 'update':
            if (!user_id) {
                return "User ID is required";
            }
            handler = new PerformUpdateOperationHandler(params as PerformUpdateParams, supabase, user_id);
            break;
        default:
            return "Invalid operation";
    }

    return !handler 
        ? "Invalid operation handler" 
        : handler.execute(); // Delegate to the handler's execute method
}
