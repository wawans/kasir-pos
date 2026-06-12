<?php

namespace App\Data;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\LoadRelation;
use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\WithoutValidation;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class BrandData extends Data
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
    public ?string $avatar;

    public function __construct(
        #[Max(30)]
        public string $name,
        #[Max(250)]
        public ?string $note,
        public bool $is_active = true,
        public bool $is_default = false,
    ) {}
}
