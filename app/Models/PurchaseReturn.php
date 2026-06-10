<?php

namespace App\Models;

use App\Enums\StatusType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseReturn extends Model
{
    use Concerns\BelongsToPaymentMethod,
        Concerns\BelongsToSupplier,
        Concerns\HasQueryBuilder, Concerns\HasUserstamps,
        Concerns\MorphManyPayment,
        Concerns\MorphManyStockLog;

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
        'purchase_id',
        'date',
        'reference',
        'supplier_id',
        'price',
        'tax',
        'discount',
        'shipping',
        'total',
        'payment_method_id',
        'payment_amount',
        'payment_date',
        'payment_status',
        'note',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date',
            'payment_date' => 'date',
            'status' => StatusType::class,
        ];
    }

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class);
    }

    public function parent(): BelongsTo
    {
        return $this->purchase();
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseReturnItem::class);
    }
}
