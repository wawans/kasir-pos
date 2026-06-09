<?php

namespace App\Data;

use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Carbon;
use Spatie\LaravelData\Attributes\LoadRelation;
use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\WithoutValidation;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PosData extends Data
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
        #[DateFormat('Y-m-d', 'Y-m-d H:i:s')]
        public Carbon $opened_at,
        #[Exists(User::class, 'id')]
        public int $opened_by,
        #[DateFormat('Y-m-d', 'Y-m-d H:i:s')]
        public Carbon $closed_at,
        #[Exists(User::class, 'id')]
        public int $closed_by,
    ) {}
}
