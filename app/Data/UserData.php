<?php

namespace App\Data;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\Validation\Date;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class UserData extends Data
{
    public function __construct(
        public ?int $id,
        public string $name,
        public string $email,
        #[Date]
        public ?CarbonImmutable $email_verified_at,
        #[Date]
        public ?CarbonImmutable $created_at,
        #[Date]
        public ?CarbonImmutable $updated_at,
    ) {}
}
