<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Appends(['on_alert', 'on_limit'])]
class Stock extends Model
{
    use Concerns\BelongsToProduct,
        Concerns\BelongsToUnit,
        Concerns\HasUserstamps;

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
        'product_id', 'unit_id', 'quantity', 'stock_alert_quantity', 'stock_limit_quantity',
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

    public function onAlert(): Attribute
    {
        return Attribute::get(fn () => $this->quantity <= $this->stock_alert_quantity);
    }

    public function onLimit(): Attribute
    {
        return Attribute::get(fn () => $this->quantity <= $this->stock_limit_quantity);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(StockLog::class, 'product_id', 'product_id');
    }

    public function sumLogsQuantity()
    {
        return $this->logs()->sum('quantity');
    }

    public function updateSumLogsQuantity()
    {
        return $this->update(['quantity' => $this->sumLogsQuantity()]);
    }
}
