<?php

namespace App\Observers;

use App\Models\SaleReturnItem;

class SaleReturnItemObserver
{
    /**
     * Handle the SaleReturnItem "created" event.
     */
    public function created(SaleReturnItem $item): void
    {
        //
    }

    /**
     * Handle the SaleReturnItem "updated" event.
     */
    public function updated(SaleReturnItem $item): void
    {
        //
    }

    /**
     * Handle the SaleReturnItem "deleting" event.
     */
    public function deleting(SaleReturnItem $item): void
    {
        $item->stockLog?->delete();
    }

    /**
     * Handle the SaleReturnItem "deleted" event.
     */
    public function deleted(SaleReturnItem $item): void
    {
        $item->stockLog?->delete();
    }

    /**
     * Handle the SaleReturnItem "restored" event.
     */
    public function restored(SaleReturnItem $item): void
    {
        //
    }

    /**
     * Handle the SaleReturnItem "force deleted" event.
     */
    public function forceDeleted(SaleReturnItem $item): void
    {
        //
    }
}
