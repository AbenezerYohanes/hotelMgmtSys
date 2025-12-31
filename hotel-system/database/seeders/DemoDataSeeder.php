<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Employee;
use App\Models\HousekeepingAssignment;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\MaintenanceIssue;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Fixed anchor date keeps demo data deterministic across runs.
        $anchorDate = CarbonImmutable::parse('2025-12-15 09:00:00');
        Carbon::setTestNow($anchorDate);

        try {
            $roomTypes = [
                [
                    'name' => 'Standard',
                    'description' => 'Comfortable room with essential amenities.',
                    'price_per_night' => 80.00,
                    'max_occupancy' => 2,
                    'is_active' => true,
                ],
                [
                    'name' => 'Deluxe',
                    'description' => 'Larger room with workspace and city views.',
                    'price_per_night' => 120.00,
                    'max_occupancy' => 3,
                    'is_active' => true,
                ],
                [
                    'name' => 'Suite',
                    'description' => 'Premium suite with a separate living area.',
                    'price_per_night' => 180.00,
                    'max_occupancy' => 4,
                    'is_active' => true,
                ],
            ];

            foreach ($roomTypes as $roomType) {
                RoomType::updateOrCreate(['name' => $roomType['name']], $roomType);
            }

            $roomTypeIds = RoomType::pluck('id', 'name')->all();

            $roomSeeds = [
                ['room_number' => '101', 'room_type' => 'Standard', 'floor' => 1, 'status' => 'clean', 'is_active' => true],
                ['room_number' => '102', 'room_type' => 'Standard', 'floor' => 1, 'status' => 'clean', 'is_active' => true],
                ['room_number' => '103', 'room_type' => 'Standard', 'floor' => 1, 'status' => 'dirty', 'is_active' => true],
                ['room_number' => '104', 'room_type' => 'Standard', 'floor' => 1, 'status' => 'clean', 'is_active' => true],
                ['room_number' => '105', 'room_type' => 'Standard', 'floor' => 1, 'status' => 'clean', 'is_active' => true],
                ['room_number' => '106', 'room_type' => 'Standard', 'floor' => 1, 'status' => 'clean', 'is_active' => true],
                ['room_number' => '107', 'room_type' => 'Deluxe', 'floor' => 1, 'status' => 'clean', 'is_active' => true],
                ['room_number' => '108', 'room_type' => 'Deluxe', 'floor' => 1, 'status' => 'clean', 'is_active' => true],
                ['room_number' => '109', 'room_type' => 'Deluxe', 'floor' => 1, 'status' => 'clean', 'is_active' => true],
                ['room_number' => '110', 'room_type' => 'Suite', 'floor' => 1, 'status' => 'out_of_service', 'is_active' => true],
                ['room_number' => '201', 'room_type' => 'Standard', 'floor' => 2, 'status' => 'clean', 'is_active' => true],
                ['room_number' => '202', 'room_type' => 'Standard', 'floor' => 2, 'status' => 'clean', 'is_active' => true],
                ['room_number' => '203', 'room_type' => 'Standard', 'floor' => 2, 'status' => 'dirty', 'is_active' => true],
                ['room_number' => '204', 'room_type' => 'Standard', 'floor' => 2, 'status' => 'clean', 'is_active' => true],
                ['room_number' => '205', 'room_type' => 'Standard', 'floor' => 2, 'status' => 'clean', 'is_active' => true],
                ['room_number' => '206', 'room_type' => 'Deluxe', 'floor' => 2, 'status' => 'clean', 'is_active' => true],
                ['room_number' => '207', 'room_type' => 'Deluxe', 'floor' => 2, 'status' => 'clean', 'is_active' => true],
                ['room_number' => '208', 'room_type' => 'Deluxe', 'floor' => 2, 'status' => 'clean', 'is_active' => true],
                ['room_number' => '209', 'room_type' => 'Suite', 'floor' => 2, 'status' => 'clean', 'is_active' => true],
                ['room_number' => '210', 'room_type' => 'Suite', 'floor' => 2, 'status' => 'clean', 'is_active' => false],
            ];

            foreach ($roomSeeds as $roomSeed) {
                $roomTypeId = $roomTypeIds[$roomSeed['room_type']] ?? null;

                if (! $roomTypeId) {
                    continue;
                }

                Room::updateOrCreate(
                    ['room_number' => $roomSeed['room_number']],
                    [
                        'room_type_id' => $roomTypeId,
                        'floor' => $roomSeed['floor'],
                        'status' => $roomSeed['status'],
                        'is_active' => $roomSeed['is_active'],
                    ]
                );
            }

            $roomsByNumber = Room::with('roomType')->get()->keyBy('room_number');

            $staffSeeds = [
                [
                    'name' => 'Front Desk User',
                    'email' => 'frontdesk@ihms.local',
                    'role' => 'FrontDesk',
                    'employee' => [
                        'full_name' => 'Morgan Reyes',
                        'phone' => '555-0101',
                        'address' => '12 Market Street',
                        'position_title' => 'Front Desk Agent',
                        'hire_date' => $anchorDate->subYears(2)->toDateString(),
                        'salary' => 36000,
                        'is_active' => true,
                    ],
                ],
                [
                    'name' => 'Housekeeper User',
                    'email' => 'housekeeper@ihms.local',
                    'role' => 'Housekeeper',
                    'employee' => [
                        'full_name' => 'Rosa Patel',
                        'phone' => '555-0102',
                        'address' => '44 Pine Avenue',
                        'position_title' => 'Housekeeper',
                        'hire_date' => $anchorDate->subYears(1)->toDateString(),
                        'salary' => 28000,
                        'is_active' => true,
                    ],
                ],
                [
                    'name' => 'HR Manager User',
                    'email' => 'hr@ihms.local',
                    'role' => 'HRManager',
                    'employee' => [
                        'full_name' => 'Jordan Blake',
                        'phone' => '555-0103',
                        'address' => '88 River Road',
                        'position_title' => 'HR Manager',
                        'hire_date' => $anchorDate->subYears(3)->toDateString(),
                        'salary' => 52000,
                        'is_active' => true,
                    ],
                ],
            ];

            $staffUsers = [];

            foreach ($staffSeeds as $staffSeed) {
                $user = User::updateOrCreate(
                    ['email' => $staffSeed['email']],
                    [
                        'name' => $staffSeed['name'],
                        'password' => Hash::make('Password@123'),
                        'role' => $staffSeed['role'],
                    ]
                );

                $user->syncRoles([$staffSeed['role']]);
                $staffUsers[$staffSeed['email']] = $user;

                Employee::updateOrCreate(
                    ['user_id' => $user->id],
                    $staffSeed['employee']
                );
            }

            $guestSeeds = [
                ['name' => 'Guest User', 'email' => 'guest@ihms.local'],
                ['name' => 'Jamie Guest', 'email' => 'guest2@ihms.local'],
                ['name' => 'Taylor Guest', 'email' => 'guest3@ihms.local'],
            ];

            $guestUsers = [];

            foreach ($guestSeeds as $guestSeed) {
                $user = User::updateOrCreate(
                    ['email' => $guestSeed['email']],
                    [
                        'name' => $guestSeed['name'],
                        'password' => Hash::make('Password@123'),
                        'role' => 'Guest',
                    ]
                );

                $user->syncRoles(['Guest']);
                $guestUsers[$guestSeed['email']] = $user;
            }

            $usersByEmail = array_merge($staffUsers, $guestUsers);
            $adminUser = User::where('email', 'admin@ihms.local')->first();
            if ($adminUser) {
                $usersByEmail[$adminUser->email] = $adminUser;
            }

            $bookingSeeds = [
                [
                    'booking_code' => 'HEAVEN-2025-00001',
                    'guest_email' => 'guest@ihms.local',
                    'room_number' => '101',
                    'check_in_date' => $anchorDate->subDays(6)->toDateString(),
                    'check_out_date' => $anchorDate->subDays(3)->toDateString(),
                    'status' => 'checked_out',
                    'adults' => 2,
                    'children' => 0,
                    'notes' => 'Corporate stay - invoice requested.',
                ],
                [
                    'booking_code' => 'HEAVEN-2025-00002',
                    'guest_email' => 'guest2@ihms.local',
                    'room_number' => '102',
                    'check_in_date' => $anchorDate->subDay()->toDateString(),
                    'check_out_date' => $anchorDate->addDays(2)->toDateString(),
                    'status' => 'checked_in',
                    'adults' => 2,
                    'children' => 0,
                    'notes' => 'Early check-in approved.',
                ],
                [
                    'booking_code' => 'HEAVEN-2025-00003',
                    'guest_email' => 'guest3@ihms.local',
                    'room_number' => '103',
                    'check_in_date' => $anchorDate->addDays(2)->toDateString(),
                    'check_out_date' => $anchorDate->addDays(4)->toDateString(),
                    'status' => 'confirmed',
                    'adults' => 1,
                    'children' => 1,
                    'notes' => 'Requires baby crib.',
                ],
                [
                    'booking_code' => 'HEAVEN-2025-00004',
                    'guest_email' => 'guest@ihms.local',
                    'room_number' => '104',
                    'check_in_date' => $anchorDate->addDays(6)->toDateString(),
                    'check_out_date' => $anchorDate->addDays(8)->toDateString(),
                    'status' => 'pending',
                    'adults' => 2,
                    'children' => 0,
                    'notes' => null,
                ],
                [
                    'booking_code' => 'HEAVEN-2025-00005',
                    'guest_email' => 'guest2@ihms.local',
                    'room_number' => '105',
                    'check_in_date' => $anchorDate->addDays(9)->toDateString(),
                    'check_out_date' => $anchorDate->addDays(11)->toDateString(),
                    'status' => 'cancelled',
                    'adults' => 2,
                    'children' => 0,
                    'notes' => 'Cancelled due to schedule change.',
                ],
                [
                    'booking_code' => 'HEAVEN-2025-00006',
                    'guest_email' => 'guest3@ihms.local',
                    'room_number' => '201',
                    'check_in_date' => $anchorDate->subDays(12)->toDateString(),
                    'check_out_date' => $anchorDate->subDays(10)->toDateString(),
                    'status' => 'checked_out',
                    'adults' => 1,
                    'children' => 0,
                    'notes' => null,
                ],
                [
                    'booking_code' => 'HEAVEN-2025-00007',
                    'guest_email' => 'guest@ihms.local',
                    'room_number' => '206',
                    'check_in_date' => $anchorDate->addDay()->toDateString(),
                    'check_out_date' => $anchorDate->addDays(3)->toDateString(),
                    'status' => 'confirmed',
                    'adults' => 2,
                    'children' => 1,
                    'notes' => 'Airport pickup requested.',
                ],
                [
                    'booking_code' => 'HEAVEN-2025-00008',
                    'guest_email' => 'guest2@ihms.local',
                    'room_number' => '209',
                    'check_in_date' => $anchorDate->subDays(2)->toDateString(),
                    'check_out_date' => $anchorDate->addDay()->toDateString(),
                    'status' => 'checked_in',
                    'adults' => 2,
                    'children' => 1,
                    'notes' => 'Suite upgrade applied.',
                ],
            ];

            $bookingsByCode = [];

            foreach ($bookingSeeds as $bookingSeed) {
                $guest = $usersByEmail[$bookingSeed['guest_email']] ?? null;
                $room = $roomsByNumber->get($bookingSeed['room_number']);

                if (! $guest || ! $room) {
                    continue;
                }

                $booking = Booking::updateOrCreate(
                    ['booking_code' => $bookingSeed['booking_code']],
                    [
                        'user_id' => $guest->id,
                        'room_id' => $room->id,
                        'check_in_date' => $bookingSeed['check_in_date'],
                        'check_out_date' => $bookingSeed['check_out_date'],
                        'status' => $bookingSeed['status'],
                        'adults' => $bookingSeed['adults'],
                        'children' => $bookingSeed['children'],
                        'notes' => $bookingSeed['notes'],
                    ]
                );

                $bookingsByCode[$booking->booking_code] = $booking->fresh(['room.roomType']);
            }

            $invoiceSeeds = [
                [
                    'booking_code' => 'HEAVEN-2025-00001',
                    'invoice_number' => 'INV-2025-0001',
                    'payment_status' => 'paid',
                ],
                [
                    'booking_code' => 'HEAVEN-2025-00006',
                    'invoice_number' => 'INV-2025-0002',
                    'payment_status' => 'unpaid',
                ],
            ];

            $taxRate = (float) config('ihms.tax_rate', 0);

            foreach ($invoiceSeeds as $invoiceSeed) {
                $booking = $bookingsByCode[$invoiceSeed['booking_code']] ?? null;
                $roomType = $booking?->room?->roomType;

                if (! $booking || ! $roomType) {
                    continue;
                }

                $nights = max(1, $booking->check_in_date->diffInDays($booking->check_out_date));
                $unitPrice = (float) $roomType->price_per_night;
                $subtotal = round($nights * $unitPrice, 2);
                $tax = round($subtotal * $taxRate, 2);
                $total = round($subtotal + $tax, 2);

                $invoice = Invoice::updateOrCreate(
                    ['booking_id' => $booking->id],
                    [
                        'invoice_number' => $invoiceSeed['invoice_number'],
                        'subtotal' => $subtotal,
                        'tax' => $tax,
                        'total' => $total,
                        'payment_status' => $invoiceSeed['payment_status'],
                    ]
                );

                $description = "Room nights ({$booking->room->room_number} - {$roomType->name})";

                InvoiceItem::updateOrCreate(
                    ['invoice_id' => $invoice->id, 'description' => $description],
                    [
                        'qty' => $nights,
                        'unit_price' => $unitPrice,
                        'line_total' => $subtotal,
                    ]
                );
            }

            $maintenanceSeeds = [
                [
                    'room_number' => '110',
                    'reported_by' => 'frontdesk@ihms.local',
                    'title' => 'HVAC not cooling',
                    'description' => 'Air conditioner is not cooling the room.',
                    'priority' => 'high',
                    'status' => 'in_progress',
                    'resolved_by' => null,
                    'resolved_at' => null,
                ],
                [
                    'room_number' => '203',
                    'reported_by' => 'housekeeper@ihms.local',
                    'title' => 'Leaking faucet',
                    'description' => 'Bathroom sink faucet is leaking.',
                    'priority' => 'medium',
                    'status' => 'open',
                    'resolved_by' => null,
                    'resolved_at' => null,
                ],
                [
                    'room_number' => '207',
                    'reported_by' => 'frontdesk@ihms.local',
                    'title' => 'TV not powering on',
                    'description' => 'Guest reported the TV will not turn on.',
                    'priority' => 'low',
                    'status' => 'resolved',
                    'resolved_by' => 'admin@ihms.local',
                    'resolved_at' => $anchorDate->subDays(1)->toDateTimeString(),
                ],
            ];

            foreach ($maintenanceSeeds as $maintenanceSeed) {
                $room = $roomsByNumber->get($maintenanceSeed['room_number']);
                $reportedBy = $usersByEmail[$maintenanceSeed['reported_by']] ?? $adminUser;

                if (! $room || ! $reportedBy) {
                    continue;
                }

                $resolvedBy = null;
                if ($maintenanceSeed['resolved_by']) {
                    $resolvedBy = $usersByEmail[$maintenanceSeed['resolved_by']] ?? null;
                }

                MaintenanceIssue::updateOrCreate(
                    ['room_id' => $room->id, 'title' => $maintenanceSeed['title']],
                    [
                        'reported_by_user_id' => $reportedBy->id,
                        'description' => $maintenanceSeed['description'],
                        'priority' => $maintenanceSeed['priority'],
                        'status' => $maintenanceSeed['status'],
                        'resolved_by_user_id' => $resolvedBy?->id,
                        'resolved_at' => $maintenanceSeed['resolved_at'],
                    ]
                );
            }

            $assignmentSeeds = [
                [
                    'room_number' => '103',
                    'housekeeper_email' => 'housekeeper@ihms.local',
                    'assigned_date' => $anchorDate->toDateString(),
                    'status' => 'assigned',
                ],
                [
                    'room_number' => '107',
                    'housekeeper_email' => 'housekeeper@ihms.local',
                    'assigned_date' => $anchorDate->toDateString(),
                    'status' => 'done',
                ],
                [
                    'room_number' => '203',
                    'housekeeper_email' => 'housekeeper@ihms.local',
                    'assigned_date' => $anchorDate->addDay()->toDateString(),
                    'status' => 'assigned',
                ],
            ];

            foreach ($assignmentSeeds as $assignmentSeed) {
                $room = $roomsByNumber->get($assignmentSeed['room_number']);
                $housekeeper = $usersByEmail[$assignmentSeed['housekeeper_email']] ?? null;

                if (! $room || ! $housekeeper) {
                    continue;
                }

                HousekeepingAssignment::updateOrCreate(
                    [
                        'room_id' => $room->id,
                        'housekeeper_user_id' => $housekeeper->id,
                        'assigned_date' => $assignmentSeed['assigned_date'],
                    ],
                    [
                        'status' => $assignmentSeed['status'],
                    ]
                );
            }
        } finally {
            Carbon::setTestNow();
        }
    }
}
