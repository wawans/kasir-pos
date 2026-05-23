<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

trait DefaultScope
{
    /**
     * Scope a query to only include models of a given default status.
     */
    #[Scope]
    protected function default(Builder $query, bool $status = true): void
    {
        $query->where('is_default', $status);
    }
}
