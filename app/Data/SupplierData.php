<?php

namespace App\Data;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\LoadRelation;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\WithoutValidation;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class SupplierData extends Data
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
    public ?string $avatar;

    public function __construct(
        public string $name,
        #[Email]
        public ?string $email,
        #[Max(15)]
        public ?string $phone,
        #[Max(250)]
        public ?string $address,
        #[Max(125)]
        public ?string $city,
        #[Max(125)]
        public ?string $state,
        #[Max(125)]
        public ?string $country,
        #[Max(250)]
        public ?string $note,
        public bool $is_active = true,
        public bool $is_default = false,
    ) {}
}
