<?php

namespace App\Models\Concerns;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToCustomer
{
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
