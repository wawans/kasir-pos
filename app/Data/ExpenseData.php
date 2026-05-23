<?php

namespace App\Data;

use App\Enums\PaymentStatusType;
use App\Enums\StatusType;
use App\Models\PaymentMethod;
use Carbon\CarbonImmutable;
use Illuminate\Support\Carbon;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\MaxDigits;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithoutValidation;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ExpenseData extends Data
{
    #[WithoutValidation]
    public int $id;

    #[WithoutValidation]
    public CarbonImmutable $created_at;

    #[WithoutValidation]
    public CarbonImmutable $updated_at;

    public function __construct(
        #[Exists(PaymentMethod::class, 'id')]
        public int $payment_method_id,
        #[DateFormat('Y-m-d', 'Y-m-d H:i:s')]
        public Carbon $date,
        public ?string $reference,
        public ?string $note,
        public StatusType $status,
        public PaymentStatusType $payment_status,
        #[DateFormat('Y-m-d', 'Y-m-d H:i:s')]
        public ?Carbon $payment_date,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $payment_amount = 0,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $tax = 0,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $discount = 0,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $shipping = 0,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $amount = 0,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $total = 0,
    ) {}
}
