<?php

namespace App\Data;

use App\Data\Transformers\JsonSerializableEnumTransformer;
use App\Enums\AdjustmentItemType;
use App\Models\Adjustment;
use App\Models\Product;
use App\Models\Unit;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\MaxDigits;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithoutValidation;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class AdjustmentItemData extends Data
{
    #[WithoutValidation]
    public int $id;

    #[WithoutValidation]
    public CarbonImmutable $created_at;

    #[WithoutValidation]
    public CarbonImmutable $updated_at;

    #[WithoutValidation]
    public ?AdjustmentData $adjustment;

    #[WithoutValidation]
    public ?ProductData $product;

    #[WithoutValidation]
    public ?UnitData $unit;

    #[WithoutValidation]
    #[WithTransformer(JsonSerializableEnumTransformer::class)]
    #[LiteralTypeScriptType(['label' => 'string', 'name' => 'string', 'value' => 'string'])]
    #[MapInputName('adjustment_item_type')]
    public AdjustmentItemType $adjustment_item_type_type;

    public function __construct(
        #[Exists(Adjustment::class, 'id')]
        public int $adjustment_id,
        #[Exists(Product::class, 'id')]
        public int $product_id,
        #[Exists(Unit::class, 'id')]
        public int $unit_id,
        public AdjustmentItemType $adjustment_item_type,
        #[Min(0)]
        #[MaxDigits(15)]
        public float $quantity,
    ) {}
}
