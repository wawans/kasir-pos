<?php

namespace App\Models;

use App\Enums\PaymentStatusType;
use App\Enums\StatusType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Sale extends Model
{
    use Concerns\BelongsToCustomer,
        Concerns\BelongsToPaymentMethod,
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
        'date',
        'reference',
        'customer_id',
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
            'payment_status' => PaymentStatusType::class,
            'status' => StatusType::class,
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    public function returned(): HasOne
    {
        return $this->hasOne(SaleReturn::class);
    }
}
