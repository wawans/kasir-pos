<?php

namespace App\Data\Transformers;

use BackedEnum;
use JsonSerializable;
use Spatie\LaravelData\Support\DataProperty;
use Spatie\LaravelData\Support\Transformation\TransformationContext;
use Spatie\LaravelData\Transformers\Transformer;

class JsonSerializableEnumTransformer implements Transformer
{
    public function transform(DataProperty $property, mixed $value, TransformationContext $context): string|int|array|null
    {
        if ($value instanceof JsonSerializable) {
            return $value->jsonSerialize();
        }

        return $value instanceof BackedEnum ? $value->value : $value;
    }
}
