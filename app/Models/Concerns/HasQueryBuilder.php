<?php

namespace App\Models\Concerns;

trait HasQueryBuilder
{
    public static function getAllowedFields(): array
    {
        return array_merge(is_array(self::getKeyName()) ? self::getKeyName() : [self::getKeyName()], self::getFillable());
    }

    public static function getAllowedFilters(): array
    {
        return array_merge(is_array(self::getKeyName()) ? self::getKeyName() : [self::getKeyName()], self::getFillable());
    }

    public static function getAllowedSorts(): array
    {
        return array_merge(is_array(self::getKeyName()) ? self::getKeyName() : [self::getKeyName()], self::getFillable());
    }

    public static function getAllowedIncludes(): array
    {
        return [
            //
        ];
    }
}
