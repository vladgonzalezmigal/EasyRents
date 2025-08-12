// utils/validationHandler.ts 
/**
 * Validation Handler Module
 * 
 * This module implements the Strategy pattern for validating CRUD operations
 * before they are executed. It provides a set of handler classes that encapsulate
 * the validation logic for different operations (create, read, update, delete).
 * 
 * The module works with the operation types defined in operationTypes.ts and
 * integrates with the authentication system to ensure users have appropriate
 * permissions for their requested operations.
 * 
 * Each handler implements operation-specific validation rules while sharing
 * common validation logic through the abstract base class.
 */


import { User } from "@supabase/supabase-js";
import { CrudOperation, DeleteValidationParams, OperationValidationParams, UpdateValidationParams,} from "@/app/(private)/features/handleForms/types/operationTypes";

export abstract class CanPerformOperationHandler {
    constructor(
        protected user: User,
        protected operation: CrudOperation,
        protected params?: OperationValidationParams
    ) {}

    // Shared session validation logic
    protected validateSession(): User | string {
        if (!this.user) {
            return "No user found";
        }
        return this.user;
    }

    // Abstract method to be implemented by each operation type
    abstract validate(user: User): string | User;

    // Execute the operation after validation
    execute(): string | User {
        const user = this.validateSession();
        if (typeof user === 'string') {
            return user;
        } 
        return this.validate(user); // Each subclass can add its specific validation here   
    }
}

// Create operation validation handler 
export class CanCreateOperationHandler extends CanPerformOperationHandler {
    constructor(user: User) {
        super(user, 'create'); // Pass session and operation type to the base class
    }

    validate(user: User): User {
        return user;
    }
}

// Update operation validation handler 

function findUpdateDataError(params: UpdateValidationParams) : string | boolean {

    // shared validation errors
    if (Object.keys(params.validationErrors).length > 0) {
        return "Fix the errors in the form";
    } else if (params.editedRows.length === 0) {
        return "No rows selected for update";
    }

    switch (params.tableName) {
        case 'sales':
            return false;
        case 'expenses':
            return false;
        case 'payroll':
            return false;
        default:
            return "table name not found";
    }
}

export class CanUpdateOperationHandler extends CanPerformOperationHandler {
    constructor(user: User, params: UpdateValidationParams) {
        super(user, 'update', params); // Pass session and operation type to the base class
    }

    validate(user: User): User | string {
        const updateParams = this.params as UpdateValidationParams;
        const error = findUpdateDataError(updateParams);
        if (error && typeof error === 'string') {
            return error;
        }
        return user;
    }
}

// Delete operation validation handler 

function findDeleteValidationErrors(params: DeleteValidationParams) : string | boolean {
    // shared validation errors
    if (params.rowsToDelete.length === 0) {
        return "No rows selected for deletion";
    } 

    switch (params.tableName) {
        case 'sales':
            return false;
        case 'expenses':
            return false;
        case 'payroll':
            return false;
        default:
            return `table name ${params.tableName} not found`;
    }
}

export class CanDeleteOperationHandler extends CanPerformOperationHandler {
    constructor(user: User, params: DeleteValidationParams) {
        super(user, 'delete', params); // Pass session and operation type to the base class
    }

    // Specific validation for delete operation
    validate(user: User): string | User {
        const deleteParams = this.params as DeleteValidationParams;
        const error = findDeleteValidationErrors(deleteParams);
        if (error && typeof error === 'string') {
            return error;
        }
        return user;
    }
}