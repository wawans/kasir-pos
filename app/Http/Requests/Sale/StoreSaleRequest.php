<?php

namespace App\Http\Requests\Sale;

use App\Enums\PaymentStatusType;
use App\Enums\StatusType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreSaleRequest extends FormRequest
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
            'reference' => ['required', 'string', 'max:30', 'unique:purchases'],
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'tax' => ['required', 'numeric', 'min:0', 'max_digits:15'],
            'discount' => ['required', 'numeric', 'min:0', 'max_digits:15'],
            'shipping' => ['required', 'numeric', 'min:0', 'max_digits:15'],
            // 'price' => ['required'],
            // 'total' => ['required'],
            'payment_method_id' => ['required', 'integer', 'exists:payment_methods,id'],
            'payment_status' => ['required', new Enum(PaymentStatusType::class)],
            'payment_date' => [
                'sometimes', 'nullable',
                'required_if:payment_status,'.PaymentStatusType::PAID->value,
                'date', 'before_or_equal:'.today()->endOfDay()],
            'payment_amount' => [
                'required_if:payment_status,'.PaymentStatusType::PAID->value,
                'numeric', 'min:0', 'max_digits:15'],
            'note' => ['sometimes', 'nullable', 'string', 'max:255'],
            'status' => ['required', new Enum(StatusType::class)],

            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:0', 'max_digits:15'],
            'items.*.discount' => ['required', 'numeric', 'min:0', 'max_digits:15'],
        ];
    }
}
