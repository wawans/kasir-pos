<?php

namespace App\Enums;

use JsonSerializable;

enum AdjustmentItemType: string implements JsonSerializable
{
    use Concerns\Options;

    case ADD = '1';
    case SUB = '2';

    public function label(): string
    {
        return match ($this) {
            default => ucwords(strtolower($this->name)),
        };
    }

    public function jsonSerialize(): mixed
    {
        return [
            'name' => $this->name,
            'value' => $this->value,
            'label' => $this->label(),
        ];
    }
}
