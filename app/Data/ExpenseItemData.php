<?php

namespace App\Data;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\Validation\MaxDigits;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithoutValidation;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ExpenseItemData extends Data
{
    #[WithoutValidation]
    public int $id;

    #[WithoutValidation]
    public CarbonImmutable $created_at;

    #[WithoutValidation]
    public CarbonImmutable $updated_at;

    public function __construct(
        public string $name,
        #[Min(0)]
        #[MaxDigits(15)]
        public float $quantity,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $discount = 0,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $price = 0,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $subtotal = 0,
    ) {}
}
