<?php

namespace App\Models;

use App\Observers\StockLogObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

#[ObservedBy([StockLogObserver::class])]
class StockLog extends Model
{
    use Concerns\BelongsToProduct,
        Concerns\BelongsToUnit,
        Concerns\HasQueryBuilder, Concerns\HasUserstamps;

    /**
     * The relations to eager load on every query.
     *
     * @var array
     */
    protected $with = ['createdBy', 'updatedBy'];

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

    public static function getAllowedIncludes(): array
    {
        return [
            //
        ];
    }

    public function model(): MorphTo
    {
        return $this->morphTo();
    }

    public function stock(): BelongsTo
    {
        return $this->belongsTo(Stock::class, 'product_id', 'product_id');
    }
}
