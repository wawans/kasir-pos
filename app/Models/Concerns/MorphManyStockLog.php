<?php

namespace App\Models\Concerns;

use App\Models\StockLog;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait MorphManyStockLog
{
    public function stockLogs(): MorphMany
    {
        return $this->morphMany(StockLog::class, 'model');
    }
}
