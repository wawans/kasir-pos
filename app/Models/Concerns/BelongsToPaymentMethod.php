<?php

namespace App\Models\Concerns;

use App\Models\PaymentMethod;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToPaymentMethod
{
    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }
}
