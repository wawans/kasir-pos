<?php

namespace App\Models\Concerns;

use App\Models\User;
use Illuminate\Database\Eloquent\Attributes\Boot;
use Illuminate\Database\Eloquent\Attributes\Initialize;
use Illuminate\Database\Eloquent\SoftDeletes;

trait HasUserstamps
{
    public $userstamps = true;

    #[Initialize]
    public function initializeHasUserstamps()
    {
        // $this->with[] = 'createdBy';
        // $this->with[] = 'updatedBy';

        // if (in_array(SoftDeletes::class, class_uses_recursive(static::class))) {
        //     $this->with[] = 'deletedBy';
        // }
    }

    #[Boot]
    public static function bootHasUserstamps()
    {
        static::creating(function ($model) {
            if (! $model->usesUserstamps()) {
                return;
            }

            $model->{$model->getCreatedByColumn()} = $model->{$model->getCreatedByColumn()} ?: (auth()->id() ?? null);
            $model->{$model->getUpdatedByColumn()} = $model->{$model->getUpdatedByColumn()} ?: (auth()->id() ?? null);
        });

        static::updating(function ($model) {
            if (! $model->usesUserstamps()) {
                return;
            }

            $model->{$model->getUpdatedByColumn()} = $model->{$model->getUpdatedByColumn()} ?: (auth()->id() ?? null);
        });

        static::deleting(function ($model) {
            if (in_array(SoftDeletes::class, class_uses_recursive($model))) {
                if ($model->forceDeleting) {
                    return;
                }

                if (! $model->usesUserstamps()) {
                    return;
                }

                $model->{$model->getDeletedByColumn()} = $model->{$model->getDeletedByColumn()} ?: (auth()->id() ?? null);
            }
        });
    }

    /**
     * Indicates if the model should be userstamped.
     *
     * @return bool
     */
    public function usesUserstamps()
    {
        return $this->userstamps && $this->usesTimestamps();
    }

    /**
     * Get the name of the "created by" column.
     *
     * @return string|null
     */
    public function getCreatedByColumn()
    {
        return defined(static::class.'::CREATED_BY') ? static::CREATED_BY : 'created_by';
    }

    /**
     * Get the name of the "updated by" column.
     *
     * @return string|null
     */
    public function getUpdatedByColumn()
    {
        return defined(static::class.'::UPDATED_BY') ? static::UPDATED_BY : 'updated_by';
    }

    /**
     * Get the name of the "deleted by" column.
     *
     * @return string|null
     */
    public function getDeletedByColumn()
    {
        return defined(static::class.'::DELETED_BY') ? static::DELETED_BY : 'deleted_by';
    }

    /**
     * Get the fully qualified "created by" column.
     *
     * @return string|null
     */
    public function getQualifiedCreatedByColumn()
    {
        return $this->qualifyColumn($this->getCreatedByColumn());
    }

    /**
     * Get the fully qualified "updated by" column.
     *
     * @return string|null
     */
    public function getQualifiedUpdatedByColumn()
    {
        return $this->qualifyColumn($this->getUpdatedByColumn());
    }

    /**
     * Get the fully qualified "deleted by" column.
     *
     * @return string|null
     */
    public function getQualifiedDeletedByColumn()
    {
        return $this->qualifyColumn($this->getDeletedByColumn());
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, $this->getCreatedByColumn());
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, $this->getUpdatedByColumn());
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, $this->getDeletedByColumn());
    }
}
