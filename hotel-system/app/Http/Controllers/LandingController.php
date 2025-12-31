<?php

namespace App\Http\Controllers;

use App\Models\RoomType;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\View\View;
use Spatie\Permission\Models\Role;

class LandingController extends Controller
{
    public function index(): View
    {
        $roomTypes = RoomType::where('is_active', true)->orderBy('name')->get();

        return view('welcome', [
            'roomTypes' => $roomTypes,
        ]);
    }

    public function quickBook(Request $request): RedirectResponse
    {
        $searchData = $this->validateSearch($request);
        $searchData['children'] = (int) ($searchData['children'] ?? 0);

        if (Auth::check()) {
            return redirect()->route('guest.bookings.search', $searchData);
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255'],
            'password' => ['required', Password::defaults()],
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            $credentials = $request->only('email', 'password');
            if (! Auth::attempt($credentials)) {
                return back()
                    ->withInput()
                    ->withErrors([
                        'email' => 'An account already exists for this email. Please sign in to continue.',
                    ]);
            }
        } else {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'role' => 'Guest',
                'password' => Hash::make($request->password),
            ]);

            $guestRole = Role::firstOrCreate(['name' => 'Guest']);
            $user->assignRole($guestRole);

            event(new Registered($user));

            Auth::login($user);
        }

        return redirect()->route('guest.bookings.search', $searchData);
    }

    private function validateSearch(Request $request): array
    {
        return $request->validate([
            'check_in_date' => ['required', 'date', 'after_or_equal:today'],
            'check_out_date' => ['required', 'date', 'after:check_in_date'],
            'room_type_id' => ['nullable', 'exists:room_types,id'],
            'adults' => ['required', 'integer', 'min:1'],
            'children' => ['nullable', 'integer', 'min:0'],
        ], [], [
            'check_in_date' => 'check-in date',
            'check_out_date' => 'check-out date',
        ]);
    }
}
