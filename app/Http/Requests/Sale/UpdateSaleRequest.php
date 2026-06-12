<?php

namespace App\Http\Requests\Sale;

use App\Models\Sale;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class UpdateSaleRequest extends StoreSaleRequest
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
        return array_merge(parent::rules(), [
            'reference' => [
                'required', 'string', 'max:30',
                Rule::unique(Sale::class)->ignore($this->sale->id),
            ],
        ]);
    }
}
