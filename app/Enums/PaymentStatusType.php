<?php

namespace App\Enums;

use JsonSerializable;

enum PaymentStatusType: string implements JsonSerializable
{
    use Concerns\Options;

    case UNPAID = '0';
    case PAID = '1';

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
