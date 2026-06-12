<?php

namespace App\Models\Concerns;

use App\Models\Supplier;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToSupplier
{
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
}
