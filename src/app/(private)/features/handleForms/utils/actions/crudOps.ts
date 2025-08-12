// create supabaseclient and perform crud operations 

import { createClient } from '@/utils/supabase/client';
import { PerformCrudValidationParams, PerformCrudParams, CrudResponseData, PerformReadParams } from '../../types/operationTypes';
import { CrudOperation } from '../../types/operationTypes';
import { canPerformOperation, performCrudOperation } from '../operationUtils';

export async function postRequest(
    operation: CrudOperation,
    operationParams: PerformCrudParams,
    validationParams?: PerformCrudValidationParams,
): Promise<CrudResponseData> {
  const supabase = createClient();
  const { data: { user },} = await supabase.auth.getUser()

  if (!user || !user.id) {
    return { data: null, error: 'User id not found' };
  } 
   //  perform validation 
   const validationResult = canPerformOperation(user, operation, validationParams);

   if (typeof validationResult === 'string') {
    return { data: null, error: validationResult };
   }
   const res = await performCrudOperation(operation, operationParams, supabase, user.id);

   if (typeof res === 'string') {
    return { data: null, error: res };
   } else if (res.error) {
    return { data: null, error: res.error };
   } else {
    return { data: res.data, error: null };
   }
}
// function to fetch data 
export async function getRequest(
    operationParams: PerformReadParams,
): Promise<CrudResponseData> {
    const supabase = createClient();
    const { data: { user },} = await supabase.auth.getUser()

    if (!user || !user.id) {
        return { data: null, error: 'User id not found' };
    } else {
        const res = await performCrudOperation('read', operationParams, supabase);
        if (typeof res === 'string') {
            return { data: null, error: res };
        } else if (res.error) {
            return { data: null, error: res.error };
        } else {
            return { data: res.data, error: null };
        }
    }
}