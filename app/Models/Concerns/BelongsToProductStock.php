<?php

namespace App\Models\Concerns;

use App\Models\Stock;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToProductStock
{
    public function stock(): BelongsTo
    {
        return $this->belongsTo(Stock::class, 'product_id', 'product_id');
    }
}
