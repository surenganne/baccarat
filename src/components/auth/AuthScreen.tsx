import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Club, Diamond, Heart, Spade } from 'lucide-react';

export function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Listen for registration success
  useEffect(() => {
    if (mode === 'register') {
      const handleRegistrationSuccess = () => {
        setTimeout(() => {
          setMode('login');
        }, 2000);
      };

      window.addEventListener('registrationSuccess', handleRegistrationSuccess);
      return () => {
        window.removeEventListener('registrationSuccess', handleRegistrationSuccess);
      };
    }
  }, [mode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500/10 via-white to-primary-500/10">
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
      
      <div className="relative flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="flex items-center gap-4">
              {/* Dancing Card Symbols */}
              <Club className="w-8 h-8 text-gray-900 animate-[bounce_1s_ease-in-out_infinite]" />
              <Diamond className="w-8 h-8 text-red-500 animate-[bounce_1s_ease-in-out_infinite_0.2s]" />
              <Heart className="w-8 h-8 text-red-500 animate-[bounce_1s_ease-in-out_infinite_0.4s]" />
              <Spade className="w-8 h-8 text-gray-900 animate-[bounce_1s_ease-in-out_infinite_0.6s]" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            3nadh Score Card
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === 'login' ? 
              'Welcome back! Please sign in to continue.' :
              'Create an account to get started.'
            }
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white/80 backdrop-blur-xl px-6 py-12 shadow-xl ring-1 ring-gray-900/5 sm:rounded-3xl sm:px-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <div className="flex gap-4 bg-white px-6 ring-1 ring-gray-900/5 rounded-full">
                  <button
                    onClick={() => setMode('login')}
                    className={`py-2 px-4 text-sm font-medium rounded-full transition-colors ${
                      mode === 'login'
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setMode('register')}
                    className={`py-2 px-4 text-sm font-medium rounded-full transition-colors ${
                      mode === 'register'
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10">
              {mode === 'login' ? <LoginForm /> : <RegisterForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}