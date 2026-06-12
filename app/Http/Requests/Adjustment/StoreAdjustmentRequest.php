<?php

namespace App\Http\Requests\Adjustment;

use App\Enums\AdjustmentItemType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreAdjustmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    // public function authorize(): bool
    // {
    //     return false;
    // }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date' => ['required', 'date', 'before_or_equal:'.today()->endOfDay()],
            'reference' => ['required', 'string', 'max:30', 'unique:adjustments'],
            'adjustment_category_id' => ['required', 'integer', 'exists:adjustment_categories,id'],
            'note' => ['sometimes', 'nullable', 'string', 'max:255'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:0', 'max_digits:15'],
            'items.*.adjustment_item_type' => ['required', new Enum(AdjustmentItemType::class)],
        ];
    }
}
