<?php

namespace App\Repositories\Concerns;

use Illuminate\Database\Eloquent\Model;

trait EnsureHasDefault
{
    public function ensureHasDefault()
    {
        if ($this->model->where('is_default', 1)->exists()) {
            return;
        }

        $model = $this->model->where('is_default', 0)
            ->where('is_active', 1)
            ->latest()
            ->first();

        if ($model) {
            $model->update(['is_default' => 1]);
            $model->saveQuietly();
        }
    }

    public function ensureOneDefault(Model $model)
    {
        $other = $this->model->where('is_default', 1)->whereNot('id', $model->getKey())->first();
        if ($other) {
            $other->update(['is_default' => 0]);
            $other->saveQuietly();
        }
    }
}
