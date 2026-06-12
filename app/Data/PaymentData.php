<?php

namespace App\Data;

use App\Models\PaymentMethod;
use Carbon\CarbonImmutable;
use Illuminate\Support\Carbon;
use Spatie\LaravelData\Attributes\LoadRelation;
use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\MaxDigits;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithoutValidation;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PaymentData extends Data
{
    #[WithoutValidation]
    public int $id;

    #[WithoutValidation]
    public CarbonImmutable $created_at;

    #[WithoutValidation]
    public CarbonImmutable $updated_at;

    #[WithoutValidation]
    #[LoadRelation]
    #[MapOutputName(SnakeCaseMapper::class)]
    public ?UserActorData $createdBy;

    #[WithoutValidation]
    #[LoadRelation]
    #[MapOutputName(SnakeCaseMapper::class)]
    public ?UserActorData $updatedBy;

    #[WithoutValidation]
    #[LoadRelation]
    #[MapOutputName(SnakeCaseMapper::class)]
    public ?PaymentMethodData $paymentMethod;

    public function __construct(
        #[Exists(PaymentMethod::class, 'id')]
        public int $payment_method_id,
        #[DateFormat('Y-m-d', 'Y-m-d H:i:s')]
        public Carbon $date,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $amount,
        #[Max(30)]
        public ?string $reference,
    ) {}
}
