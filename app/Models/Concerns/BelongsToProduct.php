<?php

namespace App\Models\Concerns;

use App\Models\Product;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToProduct
{
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
