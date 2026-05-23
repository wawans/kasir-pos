<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

#[Appends(['on_alert', 'on_limit'])]
class Stock extends Model
{
    use Concerns\BelongsToProduct;
    use Concerns\BelongsToUnit;

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
}
