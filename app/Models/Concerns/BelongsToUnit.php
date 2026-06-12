<?php

namespace App\Models\Concerns;

use App\Models\Unit;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToUnit
{
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }
}
