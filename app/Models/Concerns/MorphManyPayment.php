<?php

namespace App\Models\Concerns;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait MorphManyPayment
{
    public function payments(): MorphMany
    {
        return $this->morphMany(Payment::class, 'model');
    }
}
