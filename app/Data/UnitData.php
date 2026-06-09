<?php

namespace App\Data;

use App\Models\Unit;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\LoadRelation;
use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\MaxDigits;
use Spatie\LaravelData\Attributes\WithoutValidation;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class UnitData extends Data
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

    public function __construct(
        #[Max(30)]
        public string $name,
        #[Max(5)]
        public ?string $alias,
        #[Max(200)]
        public ?string $note,
        #[Exists(Unit::class, 'id')]
        public ?int $unit_parent_id,
        #[Max(1)]
        public ?string $conversion_operator,
        #[MaxDigits(15)]
        public ?float $conversion_value,
        public bool $is_active = true,
        public bool $is_default = false,
    ) {}
}
