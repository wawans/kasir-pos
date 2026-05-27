<?php

namespace App\Data;

use App\Models\AdjustmentCategory;
use Carbon\CarbonImmutable;
use Illuminate\Support\Carbon;
use Spatie\LaravelData\Attributes\LoadRelation;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\MaxDigits;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithoutValidation;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class AdjustmentData extends Data
{
    #[WithoutValidation]
    public int $id;

    #[WithoutValidation]
    public CarbonImmutable $created_at;

    #[WithoutValidation]
    public CarbonImmutable $updated_at;

    #[WithoutValidation]
    #[LoadRelation]
    public ?UserActorData $createdBy;

    #[WithoutValidation]
    #[LoadRelation]
    public ?UserActorData $updatedBy;

    #[WithoutValidation]
    public ?AdjustmentCategoryData $adjustmentCategory;

    public function __construct(
        #[DateFormat('Y-m-d')]
        public Carbon $date,
        #[Exists(AdjustmentCategory::class, 'id')]
        public int $adjustment_category_id,
        #[Max(30)]
        public ?string $reference,
        #[Max(250)]
        public ?string $note,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $adjustment_total_quantity = 0,
    ) {}
}
