<?php

namespace App\Enums;

use App\Models\Adjustment;
use App\Models\AdjustmentItem;
use App\Models\Hold;
use App\Models\HoldItem;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\PurchaseReturn;
use App\Models\PurchaseReturnItem;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SaleReturn;
use App\Models\SaleReturnItem;
use JsonSerializable;

enum StockLogModelType: string implements JsonSerializable
{
    use Concerns\Options;

    case Adjustment = Adjustment::class;
    case AdjustmentItem = AdjustmentItem::class;
    case Hold = Hold::class;
    case HoldItem = HoldItem::class;
    case Product = Product::class;
    case Purchase = Purchase::class;
    case PurchaseItem = PurchaseItem::class;
    case PurchaseReturn = PurchaseReturn::class;
    case PurchaseReturnItem = PurchaseReturnItem::class;
    case Sale = Sale::class;
    case SaleItem = SaleItem::class;
    case SaleReturn = SaleReturn::class;
    case SaleReturnItem = SaleReturnItem::class;

    public function label(): string
    {
        return match ($this) {
            self::Adjustment,
            self::AdjustmentItem => 'Adjustment',
            self::Hold,
            self::HoldItem => 'Hold',
            self::Product => 'Product',
            self::Purchase,
            self::PurchaseItem => 'Purchase',
            self::PurchaseReturn,
            self::PurchaseReturnItem => 'Purchase Return',
            self::Sale,
            self::SaleItem => 'Sale',
            self::SaleReturn,
            self::SaleReturnItem => 'Sale Return',
            default => $this->name,
        };
    }

    public function jsonSerialize(): mixed
    {
        return [
            'name' => $this->name,
            'value' => $this->value,
            'label' => $this->label(),
        ];
    }
}
