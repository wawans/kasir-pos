<?php

namespace App\Data;

use App\Models\Product;
use App\Models\Unit;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\MaxDigits;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithoutValidation;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class SaleItemData extends Data
{
    #[WithoutValidation]
    public int $id;

    #[WithoutValidation]
    public CarbonImmutable $created_at;

    #[WithoutValidation]
    public CarbonImmutable $updated_at;

    public function __construct(
        #[Exists(Product::class, 'id')]
        public int $product_id,
        #[Exists(Unit::class, 'id')]
        public int $unit_id,
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
