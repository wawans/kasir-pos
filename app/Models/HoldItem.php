<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HoldItem extends Model
{
    use Concerns\BelongsToProduct,
        Concerns\BelongsToUnit,
        Concerns\HasQueryBuilder;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'hold_id',
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
        return $this->belongsTo(Hold::class);
    }
}
