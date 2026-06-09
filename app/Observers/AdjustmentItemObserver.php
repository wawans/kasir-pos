<?php

namespace App\Observers;

use App\Enums\AdjustmentItemType;
use App\Models\AdjustmentItem;
use Illuminate\Support\Facades\Log;

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
        $quantity = $item->adjustment_item_type === AdjustmentItemType::SUB ? ($item->quantity * -1) : $item->quantity;

        Log::debug('AdjustmentItem "updated" event', [
            'item' => $item,
            'stockLog' => $item->stockLog,
            'stock' => $item->stockLog?->stock,
        ]);

        $item->stockLog->update([
            'quantity' => $quantity,
            'remaining_quantity' => $stock->quantity + $log->quantity - $quantity,
        ]);
    }

    /**
     * Handle the AdjustmentItem "deleting" event.
     */
    public function deleting(AdjustmentItem $item): void
    {
        Log::debug('AdjustmentItem "deleting" event', [
            'item' => $item,
            'stockLog' => $item->stockLog,
            'stock' => $item->stockLog?->stock,
        ]);

        $item->stockLog?->delete();

    }

    /**
     * Handle the AdjustmentItem "deleted" event.
     */
    public function deleted(AdjustmentItem $item): void
    {
        Log::debug('AdjustmentItem "deleted" event', [
            'item' => $item,
            'stockLog' => $item->stockLog,
            'stock' => $item->stockLog?->stock,
        ]);

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
