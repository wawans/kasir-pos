<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Cache;

trait AvatarAttribute
{
    public function avatar(): Attribute
    {
        return Attribute::get(
            fn () => Cache::remember(
                basename(static::class).'.avatar.'.$this->id.$this->updated_at->unix(),
                now()->addMonth(),
                function () {
                    $value = $this->getFirstMediaUrl();

                    return $value === '' ? null : $value;
                }
            )
        );
    }
}
