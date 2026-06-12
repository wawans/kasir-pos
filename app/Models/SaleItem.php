<?php

namespace App\Models;

use App\Observers\SaleItemObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[ObservedBy([SaleItemObserver::class])]
class SaleItem extends Model
{
    use Concerns\BelongsToProduct,
        Concerns\BelongsToProductStock,
        Concerns\BelongsToUnit,
        Concerns\HasQueryBuilder,
        Concerns\MorphOneStockLog;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'sale_id',
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

    public static function getAllowedIncludes(): array
    {
        return [
            'parent',
            'product',
            'unit',
            'stock',
            'stockLog',
        ];
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }
}
