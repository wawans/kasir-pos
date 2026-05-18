<?php

namespace App\Data;

use Carbon\CarbonImmutable;
use Illuminate\Support\Carbon;
use Spatie\LaravelData\Attributes\Validation\Date;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Sometimes;
use Spatie\LaravelData\Attributes\WithoutValidation;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;


#[TypeScript]
class BrandData extends Data
{
    public function __construct(
        #[WithoutValidation]
        public ?int $id,
        public string $name,
        public ?string $description,
        #[Sometimes]
        public ?bool $is_default,
        #[WithoutValidation]
        #[DateFormat(['Y-m-d', 'Y-m-d H:i:s'])]
        public ?Carbon $created_at,
        #[WithoutValidation]
        #[DateFormat(['Y-m-d', 'Y-m-d H:i:s'])]
        public ?Carbon $updated_at,
    ) {}
}
