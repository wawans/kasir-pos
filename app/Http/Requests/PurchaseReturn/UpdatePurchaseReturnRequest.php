<?php

namespace App\Http\Requests\PurchaseReturn;

use App\Models\PurchaseReturn;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class UpdatePurchaseReturnRequest extends StorePurchaseReturnRequest
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
                Rule::unique(PurchaseReturn::class)->ignore($this->purchaseReturn->id),
            ],
        ]);
    }
}
