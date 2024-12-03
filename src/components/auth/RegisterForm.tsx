import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { AlertCircle, User, Phone, Lock, Loader2, CheckCircle2 } from 'lucide-react';

export function RegisterForm() {
  const { register, error, isLoading, clearError } = useAuthStore();
  const [username, setUsername] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [validationError, setValidationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [switchToSignIn, setSwitchToSignIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!username && !mobileNumber) {
      setValidationError('Username or mobile number is required');
      return;
    }

    if (pin !== confirmPin) {
      setValidationError('PINs do not match');
      return;
    }

    if (pin.length < 4) {
      setValidationError('PIN must be at least 4 digits');
      return;
    }

    try {
      await register({ username, mobileNumber, pin });
      setRegistrationSuccess(true);
      setTimeout(() => {
        setSwitchToSignIn(true);
      }, 2000);
    } catch (error) {
      // Error handling is already done in the store
    }
  };

  if (switchToSignIn) {
    return null; // AuthScreen will switch to login mode
  }

  if (registrationSuccess) {
    return (
      <div className="p-6 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Registration Successful!</h3>
        <p className="text-sm text-gray-600 text-center">
          Your account has been created successfully. Redirecting to sign in...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                clearError();
              }}
              className="block w-full pl-10 rounded-xl border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500"
              placeholder="Username"
            />
          </div>
        </div>

        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="mobileNumber"
              type="tel"
              value={mobileNumber}
              onChange={(e) => {
                setMobileNumber(e.target.value);
                clearError();
              }}
              className="block w-full pl-10 rounded-xl border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500"
              placeholder="Mobile Number"
            />
          </div>
        </div>

        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                clearError();
              }}
              className="block w-full pl-10 rounded-xl border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500"
              placeholder="Create PIN"
              required
              minLength={4}
              maxLength={6}
            />
          </div>
        </div>

        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPin"
              type="password"
              value={confirmPin}
              onChange={(e) => {
                setConfirmPin(e.target.value);
                clearError();
              }}
              className="block w-full pl-10 rounded-xl border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500"
              placeholder="Confirm PIN"
              required
              minLength={4}
              maxLength={6}
            />
          </div>
        </div>
      </div>

      {(error || validationError) && (
        <div className="rounded-lg bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-sm text-red-700">{error || validationError}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full justify-center items-center gap-2 rounded-xl bg-primary-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
}