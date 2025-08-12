export interface AuthFormData {
    email: string;
    password: string;
  }

  export type FormErrors = Record<keyof AuthFormData, string | null>;

export function validateForm(formData: AuthFormData): FormErrors {
  const newErrors: FormErrors = {
    email: null,
    password: null,
  };

  if (!formData.email) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    newErrors.password = 'Password is required';
  } // TODO: add password regex 

  return newErrors;
}