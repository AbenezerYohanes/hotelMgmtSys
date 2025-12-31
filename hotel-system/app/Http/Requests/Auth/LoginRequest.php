<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        $user = $this->user();
        if ($user) {
            if ($user->is_deleted) {
                Auth::logout();
                RateLimiter::clear($this->throttleKey());

                throw ValidationException::withMessages([
                    'email' => 'Your account has been deleted. Please contact the administrator.',
                ]);
            }

            $isGuest = $user->hasRole('Guest') || $user->role === 'Guest';
            $isPrivileged = $user->hasRole(['Admin', 'HRManager'])
                || in_array($user->role, ['Admin', 'HRManager'], true);

            if (! $isPrivileged && ! $isGuest && ! $user->employee) {
                Auth::logout();
                RateLimiter::clear($this->throttleKey());

                throw ValidationException::withMessages([
                    'email' => 'Your account is not assigned to an employee profile. Please contact the administrator.',
                ]);
            }

            if ($user->employee && ! $user->employee->is_active) {
                Auth::logout();
                RateLimiter::clear($this->throttleKey());

                throw ValidationException::withMessages([
                    'email' => 'Your account is suspended. Please contact the administrator.',
                ]);
            }
        }

        RateLimiter::clear($this->throttleKey());
    }

    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
