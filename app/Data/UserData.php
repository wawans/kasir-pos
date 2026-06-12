<?php

namespace App\Data;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\LoadRelation;
use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Attributes\WithoutValidation;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class UserData extends Data
{
    #[WithoutValidation]
    public int $id;

    #[WithoutValidation]
    public CarbonImmutable $email_verified_at;

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
        public string $name,
        public string $email,
    ) {}
}
