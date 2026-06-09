<?php

namespace App\Data;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Unit;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\LoadRelation;
use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\MaxDigits;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithoutValidation;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ProductData extends Data
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
    public ?CategoryData $category;

    #[WithoutValidation]
    public ?BrandData $brand;

    #[WithoutValidation]
    public ?UnitData $unit;

    #[WithoutValidation]
    public ?StockData $stock;

    public function __construct(
        #[Exists(Category::class, 'id')]
        public int $category_id,
        #[Exists(Brand::class, 'id')]
        public int $brand_id,
        #[Exists(Unit::class, 'id')]
        public int $unit_id,
        public string $name,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $product_cost,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $product_price,
        #[Max(30)]
        public ?string $code,
        #[Max(30)]
        public ?string $reference,
        #[Max(250)]
        public ?string $note,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $stock_alert_quantity = 0,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $stock_limit_quantity = 0,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $stock_opening_quantity = 0,
        public bool $is_active = true,
    ) {}
}
