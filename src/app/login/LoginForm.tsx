'use client';

import { useState, useEffect } from 'react';
import { login } from '../../utils/AuthActions';
import { useRouter } from 'next/navigation';
import { FormErrors, AuthFormData, validateForm } from '@/app/(public)/utils/formValidation';
import LoadingWave from '@/app/components/LoadingWave';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: null,
    password: null,
  });

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Form change handlers

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(name === 'email') {
      e.target.value = value.toLowerCase();
      setFormData(prev => ({
            ...prev,
            email: value.toLowerCase(),
          }));     
      // Clear error if email is valid
      if (formErrors.email && validateForm({...formData, email: value.toLowerCase()}).email === null) {   // Create a copy of formData with the updated email value
        setFormErrors(prev => ({
          ...prev,
          email: null,
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        password: value,
      }));
      // Clear error if password is valid
      if (formErrors.password && validateForm({...formData, password: value}).password === null) { 
        setFormErrors(prev => ({
          ...prev,
          password: null,
        }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;

    const newErrors = validateForm(formData);

    if (validateForm(formData).email !== null && name === 'email') {
      setFormErrors(prev => ({
        ...prev,
        email:newErrors.email,
      }));
    } else if (validateForm(formData).password !== null && name === 'password') {
      setFormErrors(prev => ({
        ...prev,
        password: newErrors.password,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoginError(null); // Clear login error for better UX
    const newErrors = validateForm(formData);

    if (Object.values(newErrors).some(value => value !== null)) {
      setFormErrors(newErrors); // Show errors if validation fails
      return;
    }

    try {
      setLoading(true);
      const result = await login(formData);
      if (result) {
        setLoading(false);
        setLoginError(result.error);
      } else {
        // loading state continues until router.push is called
        router.push('/selection');
      }
    } catch (error) {
      setLoginError(error as string);
      setLoading(false);
    }
  };

  

  useEffect(() => {
    // Reset errors when the component mounts or when the user logs out
    setFormErrors({
      email: null,
      password: null,
    });
  }, []);

  return (
    
    <div className="max-w-[500px] h-[400px] w-full space-y-8 p-8 bg-gradient-to-br from-[#F0FDFC] via-white to-[#E0F5F3] rounded-lg shadow-xl flex justify-center border border-[#DFDFDF]">
    <div className="w-[280px] flex items-center justify-center flex-col ">
        
      
    <div className="text-left w-full flex justify-between">
      <h2 className="text-4xl font-light tracking-wider text-gray-900">
        Log in
      </h2>
      <div className="w-[44px] h-[44px] rounded-full bg-[#B6E8E4]">

      </div>
    </div>

    <form className="w-full flex-1 flex flex-col justify-center mt-6" onSubmit={handleSubmit}>
      
      <div className="">
        <div className="pb-4">
          <label htmlFor="email" className="block text-[20px] font-medium text-[#585858] ">
            Email
          </label>
          <div className="w-full h-[12px] items-center justify-center pb-2 ">
          {formErrors.email && (
          <div className="text-red-600 text-sm h-full flex items-center justify-center text-center">
            <p> {formErrors.email}</p>
      
            </div>
        )}
        </div>
          <input
            id="email"
            name="email"
            type="email"
            required={true}
            className="marketing-input-field"
            placeholder="rodriguez-joaquin@comcast.net"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      
        <div className="">
          
          <label htmlFor="password" className="block text-[20px] font-medium text-[#585858] mb-3">
            Password
          </label>
          {formErrors.password && (
            <div className="text-red-600 text-sm text-center">{formErrors.password}</div>
          )}
          <input
            id="password"
            name="password"
            type="password"
            required={true}
            className="marketing-input-field"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        <div className="w-full h-[12px] items-center justify-center   mb-6 ">
          {loginError && (
          <div className="text-red-600 text-lg font-semibold pt-4 h-full flex items-center justify-center text-center">
            <p> {loginError}</p>
      
            </div>
        )}
        </div>
        
      </div>

      <div className="">
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center h-[52px] flex items-center justify-center border border-transparent text-lg rounded-full text-[#2F2F2F] bg-[#B6E8E4] hover:bg-[#DFF4F3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <LoadingWave /> : 'Sign in'}
        </button>
      </div>

      
    </form>
    </div>
  </div>
  );
}
