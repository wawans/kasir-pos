<?php

namespace App\Models;

use App\Enums\PaymentStatusType;
use App\Enums\StatusType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hold extends Model
{
    use Concerns\BelongsToCustomer;
    use Concerns\BelongsToPaymentMethod;
    use Concerns\MorphManyPayment;

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
        return $this->hasMany(HoldItem::class);
    }
}
