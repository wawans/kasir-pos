<?php

namespace App\Models;

use App\Observers\PurchaseReturnItemObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[ObservedBy([PurchaseReturnItemObserver::class])]
class PurchaseReturnItem extends Model
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
        'purchase_return_id',
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
        return $this->belongsTo(PurchaseReturn::class);
    }
}
