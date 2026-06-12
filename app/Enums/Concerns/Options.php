<?php

namespace App\Enums\Concerns;

trait Options
{
    /**
     * Cache default self::cases() method.
     */
    public static function options(): array
    {
        static $options = null;

        if ($options === null) {
            $options = collect(self::cases())->map(fn ($case) => [
                'value' => $case->value,
                'label' => $case->label() ?? $case->name,
            ])->toArray();
        }

        return $options;
    }
}
