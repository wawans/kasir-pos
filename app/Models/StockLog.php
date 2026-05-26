<?php

namespace App\Models;

use App\Observers\StockLogObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

#[ObservedBy([StockLogObserver::class])]
class StockLog extends Model
{
    use Concerns\BelongsToProduct;
    use Concerns\BelongsToUnit;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'model_type',
        'model_id',
        'product_id',
        'unit_id',
        'quantity',
        'remaining_quantity',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            //
        ];
    }

    public function model(): MorphTo
    {
        return $this->morphTo();
    }
}
