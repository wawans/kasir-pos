<?php

namespace App\Models\Concerns;

use App\Models\StockLog;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait MorphOneStockLog
{
    public function stockLog(): MorphOne
    {
        return $this->morphOne(StockLog::class, 'model');
    }
}
