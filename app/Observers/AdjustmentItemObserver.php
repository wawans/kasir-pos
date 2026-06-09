<?php

namespace App\Observers;

use App\Enums\AdjustmentItemType;
use App\Models\AdjustmentItem;

class AdjustmentItemObserver
{
    /**
     * Handle the AdjustmentItem "created" event.
     */
    public function created(AdjustmentItem $item): void
    {
        $stock = $item->stock;
        $quantity = $item->adjustment_item_type === AdjustmentItemType::SUB ? ($item->quantity * -1) : $item->quantity;

        $item->stockLog()->create([
            'product_id' => $item->product_id,
            'unit_id' => $item->unit_id,
            'quantity' => $quantity,
            'remaining_quantity' => $stock ? ($stock->quantity + $quantity) : $quantity,
        ]);
    }

    /**
     * Handle the AdjustmentItem "updated" event.
     */
    public function updated(AdjustmentItem $item): void
    {
        $log = $item->stockLog;
        $stock = $item->stockLog->stock;
        $remaining = $stock->quantity;
        $change = $log->quantity;
        $origin = $remaining - $change;

        $quantity = $item->adjustment_item_type === AdjustmentItemType::SUB ? ($item->quantity * -1) : $item->quantity;

        $item->stockLog->update([
            'quantity' => $quantity,
            'remaining_quantity' => $origin + $quantity,
        ]);
    }

    /**
     * Handle the AdjustmentItem "deleting" event.
     */
    public function deleting(AdjustmentItem $item): void
    {
        $item->stockLog?->delete();

    }

    /**
     * Handle the AdjustmentItem "deleted" event.
     */
    public function deleted(AdjustmentItem $item): void
    {
        $item->stockLog?->delete();
    }

    /**
     * Handle the AdjustmentItem "restored" event.
     */
    public function restored(AdjustmentItem $item): void
    {
        //
    }

    /**
     * Handle the AdjustmentItem "force deleted" event.
     */
    public function forceDeleted(AdjustmentItem $item): void
    {
        //
    }
}
