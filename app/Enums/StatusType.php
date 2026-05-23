<?php

namespace App\Enums;

use JsonSerializable;

enum StatusType: string implements JsonSerializable
{
    use Concerns\Options;

    case DRAFT = '0';
    case FINAL = '1';

    public function label(): string
    {
        return match ($this) {
            default => $this->name,
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
