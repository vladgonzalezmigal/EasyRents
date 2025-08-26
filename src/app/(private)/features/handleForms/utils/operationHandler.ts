// import getSupabaseClient from "@/utils/supabase/supaBaseServerConfig" 
import { CrudOperation, CrudResponseData, PerformCreateParams, PerformCrudParams, PerformReadParams, PerformUpdateParams } from "../types/operationTypes";
import { FormData, Sales } from "@/app/(private)/types/formTypes";
import { PerformDeleteParams } from "../types/operationTypes";
import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

// Basic handler class that can be extended for various operations
export abstract class PerformOperationHandler {
    protected errorState: string | null = null;
    constructor(
        protected operation: CrudOperation,
        protected params: PerformCrudParams, // Params containing tableName and other operation-specific data
        protected supabase: SupabaseClient,
        protected user_id?: string
    ) {
        if (!this.params.tableName) { 
            this.errorState = "Table name is required";
        }
    }

    // Abstract method to be implemented by subclasses
    abstract perform(supabase: SupabaseClient): Promise<CrudResponseData>;

    // Execute method that calls the perform method for specific operation
    async execute(): Promise<CrudResponseData> {

        if (this.errorState) {
            // If an error is already set in the constructor, return immediately
            return { data: null, error: this.errorState};
        }
        // create supabase 
        // const supabaseClient =  createClient()
        return await this.perform(this.supabase); // Delegate the async operation to the specific handler
    }
}

// Helper functions
const omitId = (obj: FormData, arr: string[] = ['id']) => 
    Object.fromEntries(Object.entries(obj).filter(([k]) => !arr.includes(k)));

const omitIds = <T extends FormData>(objects: T[], arr: string[] = ['id']): T[] => 
    objects.map(obj => omitId(obj, arr) as T);

const getQueryColumns = (dataType: FormData | FormData[]): string => {
    if (Array.isArray(dataType)) {
        return Object.keys(dataType[0]).join(',');
    } else {
        return Object.keys(dataType).join(',');
    }
}

const handleApiResponse = (apiData: FormData[] | null, apiError: PostgrestError | null): CrudResponseData => {
    if (apiError) {
        return {
            data: null,
            error: apiError.message || "Unknown error"
        };
    } else {
        return {
            data: apiData as FormData[],
            error: null
        };
    }
    
};

// Create operation handler

export class PerformCreateOperationHandler extends PerformOperationHandler {
    constructor(params: PerformCreateParams, supabase: SupabaseClient, user_id: string) {
        super('create', params, supabase, user_id);
    }

    // Perform async operation for create
    async perform(supabase: SupabaseClient): Promise<CrudResponseData> {
        const createParams = this.params as PerformCreateParams;
        let cleanedData = {}
        if (Array.isArray(createParams.createData)) {
            cleanedData = omitIds(createParams.createData)
        } else {
            cleanedData = omitId(createParams.createData)
        }
        try {           
            // Handle array vs single object insertion
            const insertData = Array.isArray(cleanedData) 
                ? cleanedData.map(item => ({ ...item, user_id: this.user_id }))
                : { ...cleanedData, user_id: this.user_id };

            const { data: apiData, error: apiError } = await supabase 
                .from(createParams.tableName)
                .insert(insertData)
                .select(getQueryColumns(createParams.createData));

            return handleApiResponse(apiData as unknown as FormData[], apiError);
        } catch (err) { // network error or other error
            return {
                data: null,
                error: err instanceof Error ? err.message : "Unexpected error occurred"
            };
        }
    }
}

// Read operation handler

function buildReadQuery(table: string, params: PerformReadParams, supabase: SupabaseClient ) {
    if (!params.dataType){
        return "inaccurate data provided"
    }
    const baseQuery = supabase.from(params.tableName).select(getQueryColumns(params.dataType));
    switch (table) {
        case 'sales':
            const dataType = params.dataType as Sales;
            return baseQuery 
                .eq('store_id', dataType.store_id) // filter by store_id
                .gte('date', params.startDate)
                .lt('date', params.endDate)
                .order('date', { ascending: false });
        case 'expenses':
            return baseQuery
                .gte('date', params.startDate)
                .lt('date', params.endDate)
                .order('date', { ascending: false }); // newest first 
        case 'payroll':
            return baseQuery
                .eq('end_date', params.endDate)
                .order('end_date', { ascending: false });
        default:
            return baseQuery;
    }
}

export class PerformReadOperationHandler extends PerformOperationHandler {
    constructor(params: PerformReadParams, supabase: SupabaseClient) {
        super('read', params, supabase);
    }

    // Perform async operation for read
    async perform(supabase: SupabaseClient): Promise<CrudResponseData> {
        const readParams = this.params as PerformReadParams;
        if (!readParams.dataType) {
            this.errorState = "Data type is required";
            return { data: null, error: this.errorState };
        }

        if (!this.params.dataType) {
            return { data: null, error: "Data type is required " };
        }
        
        const readQuery = buildReadQuery(readParams.tableName, readParams, supabase);
        
        if (typeof readQuery === "string") {
            return { data: null, error: readQuery };
        }

        try {
            const { data: apiData, error: apiError } = await readQuery;
            return handleApiResponse(apiData as unknown as FormData[], apiError);
        } catch (err) {
            return {
                data: null,
                error: err instanceof Error ? err.message : "Unexpected error occurred"
            };
        }
    }
}

// Update operation handler
export class PerformUpdateOperationHandler extends PerformOperationHandler {
    constructor(params: PerformUpdateParams, supabase: SupabaseClient, user_id: string) {
        super('update', params as PerformUpdateParams, supabase, user_id);
    }

    // Perform async operation for update
    async perform(supabase: SupabaseClient): Promise<CrudResponseData> {
        const updateParams = this.params as PerformUpdateParams;
        const updatedRowsWithUserId = updateParams.editedRows.map(row => ({
            ...row,
            user_id: this.user_id
          }));
        try {
            const { data: apiData, error: apiError } = await supabase
                .from(updateParams.tableName)
                .upsert(updatedRowsWithUserId)
                .select(getQueryColumns(updateParams.editedRows[0]))
            return handleApiResponse(apiData as unknown as FormData[], apiError);
        } catch (err) {
            return {
                data: null,
                error: err instanceof Error ? err.message : "Unexpected error occurred"
            };
        }
    }
}

// Delete operation handler
export class PerformDeleteOperationHandler extends PerformOperationHandler {
    constructor(params: PerformDeleteParams, supabase: SupabaseClient) {
        super('delete', params as PerformDeleteParams, supabase);
    }

    // Perform async operation for delete
    async perform(supabase: SupabaseClient): Promise<CrudResponseData> {
        const deleteParams = this.params as PerformDeleteParams;
        try {
            const { data: apiData, error: apiError } = await supabase
                .from(deleteParams.tableName)
                .delete()
                .in('id', deleteParams.rowsToDelete)
                .select('id');

            return handleApiResponse(apiData as FormData[], apiError);
        } catch (err) {
            return {
                data: null,
                error: err instanceof Error ? err.message : "Unexpected error occurred"
            };
        }
    }
}

// 