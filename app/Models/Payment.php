<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Payment extends Model
{
    use Concerns\BelongsToPaymentMethod,
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
        'reference',
        'payment_method_id',
        'date',
        'amount',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'datetime',
        ];
    }

    public function model(): MorphTo
    {
        return $this->morphTo();
    }
}
