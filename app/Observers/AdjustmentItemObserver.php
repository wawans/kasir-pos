<?php

namespace App\Observers;

use App\Models\AdjustmentItem;

class AdjustmentItemObserver
{
    /**
     * Handle the AdjustmentItem "created" event.
     */
    public function created(AdjustmentItem $adjustmentItem): void
    {
        //
    }

    /**
     * Handle the AdjustmentItem "updated" event.
     */
    public function updated(AdjustmentItem $adjustmentItem): void
    {
        //
    }

    /**
     * Handle the AdjustmentItem "deleted" event.
     */
    public function deleted(AdjustmentItem $adjustmentItem): void
    {
        //
    }

    /**
     * Handle the AdjustmentItem "restored" event.
     */
    public function restored(AdjustmentItem $adjustmentItem): void
    {
        //
    }

    /**
     * Handle the AdjustmentItem "force deleted" event.
     */
    public function forceDeleted(AdjustmentItem $adjustmentItem): void
    {
        //
    }
}
