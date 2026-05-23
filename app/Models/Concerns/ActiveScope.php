<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

trait ActiveScope
{
    /**
     * Scope a query to only include models of a given active status.
     */
    #[Scope]
    protected function active(Builder $query, bool $status = true): void
    {
        $query->where('is_active', $status);
    }
}
