<?php

namespace App\Models;

use App\Observers\PurchaseItemObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[ObservedBy([PurchaseItemObserver::class])]
class PurchaseItem extends Model
{
    use Concerns\BelongsToProduct,
        Concerns\BelongsToProductStock,
        Concerns\BelongsToUnit,
        Concerns\MorphOneStockLog;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'purchase_id',
        'product_id',
        'unit_id',
        'quantity',
        'price',
        'discount',
        'subtotal',
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

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Purchase::class);
    }
}
