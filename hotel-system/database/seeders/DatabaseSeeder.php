<?php

namespace Database\Seeders;

use App\Models\Shift;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $roles = [
            'Guest',
            'FrontDesk',
            'Housekeeper',
            'HRManager',
            'Admin',
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        $permissions = [
            'bookings.view',
            'frontdesk.view',
            'frontdesk.manage',
            'rooms.manage_status',
            'housekeeping.view',
            'housekeeping.manage',
            'housekeeping.assign',
            'maintenance.report',
            'maintenance.view',
            'maintenance.manage',
            'hr.view',
            'hr.manage',
            'hr.manage_salary',
            'admin.view',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $shifts = [
            [
                'name' => 'Morning',
                'start_time' => '07:00:00',
                'end_time' => '15:00:00',
            ],
            [
                'name' => 'Evening',
                'start_time' => '15:00:00',
                'end_time' => '23:00:00',
            ],
            [
                'name' => 'Night',
                'start_time' => '23:00:00',
                'end_time' => '07:00:00',
            ],
        ];

        foreach ($shifts as $shift) {
            Shift::updateOrCreate(['name' => $shift['name']], $shift);
        }

        Role::findByName('Guest')->syncPermissions(['bookings.view']);
        Role::findByName('FrontDesk')->syncPermissions([
            'frontdesk.view',
            'frontdesk.manage',
            'rooms.manage_status',
            'housekeeping.assign',
            'maintenance.report',
            'maintenance.view',
            'maintenance.manage',
        ]);
        Role::findByName('Housekeeper')->syncPermissions([
            'housekeeping.view',
            'housekeeping.manage',
            'maintenance.report',
        ]);
        Role::findByName('HRManager')->syncPermissions([
            'hr.view',
            'hr.manage',
            'hr.manage_salary',
            'maintenance.report',
        ]);
        Role::findByName('Admin')->syncPermissions($permissions);

        $seedUsers = [
            [
                'name' => 'Admin User',
                'email' => 'admin@ihms.local',
                'role' => 'Admin',
            ],
            [
                'name' => 'Guest User',
                'email' => 'guest@ihms.local',
                'role' => 'Guest',
            ],
            [
                'name' => 'Front Desk User',
                'email' => 'frontdesk@ihms.local',
                'role' => 'FrontDesk',
            ],
            [
                'name' => 'Housekeeper User',
                'email' => 'housekeeper@ihms.local',
                'role' => 'Housekeeper',
            ],
            [
                'name' => 'HR Manager User',
                'email' => 'hr@ihms.local',
                'role' => 'HRManager',
            ],
        ];

        foreach ($seedUsers as $seedUser) {
            $user = User::updateOrCreate(
                ['email' => $seedUser['email']],
                [
                    'name' => $seedUser['name'],
                    'password' => Hash::make('Password@123'),
                    'role' => $seedUser['role'],
                ]
            );

            $user->syncRoles([$seedUser['role']]);
        }

        $this->call(DemoDataSeeder::class);
    }
}
