<?php

namespace App\Data;

use App\Data\Transformers\JsonSerializableEnumTransformer;
use App\Enums\PaymentStatusType;
use App\Enums\StatusType;
use App\Models\PaymentMethod;
use App\Models\Purchase;
use App\Models\Supplier;
use Carbon\CarbonImmutable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\LoadRelation;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\MaxDigits;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\WithoutValidation;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PurchaseReturnData extends Data
{
    #[WithoutValidation]
    public int $id;

    #[WithoutValidation]
    public CarbonImmutable $created_at;

    #[WithoutValidation]
    public CarbonImmutable $updated_at;

    #[WithoutValidation]
    #[LoadRelation]
    public ?UserActorData $createdBy;

    #[WithoutValidation]
    #[LoadRelation]
    public ?UserActorData $updatedBy;

    #[WithoutValidation]
    public ?PurchaseData $purchase;

    #[WithoutValidation]
    public ?SupplierData $supplier;

    #[WithoutValidation]
    public ?PaymentMethodData $paymentMethod;

    #[WithoutValidation]
    /**
     * @var Collection<PurchaseReturnItemData>|Lazy
     */
    public ?array $items;

    #[WithoutValidation]
    #[WithTransformer(JsonSerializableEnumTransformer::class)]
    #[LiteralTypeScriptType(['label' => 'string', 'name' => 'string', 'value' => 'string'])]
    #[MapInputName('status')]
    public StatusType $status_type;

    #[WithoutValidation]
    #[WithTransformer(JsonSerializableEnumTransformer::class)]
    #[LiteralTypeScriptType(['label' => 'string', 'name' => 'string', 'value' => 'string'])]
    #[MapInputName('payment_status')]
    public PaymentStatusType $payment_status_type;

    public function __construct(
        #[Exists(Purchase::class, 'id')]
        public int $purchase_id,
        #[Exists(Supplier::class, 'id')]
        public int $supplier_id,
        #[Exists(PaymentMethod::class, 'id')]
        public int $payment_method_id,
        #[DateFormat('Y-m-d', 'Y-m-d H:i:s')]
        public Carbon $date,
        public ?string $reference,
        public ?string $note,
        public StatusType $status,
        public PaymentStatusType $payment_status,
        #[DateFormat('Y-m-d', 'Y-m-d H:i:s')]
        public ?Carbon $payment_date,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $payment_amount = 0,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $tax = 0,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $discount = 0,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $shipping = 0,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $price = 0,
        #[Min(0)]
        #[MaxDigits(15)]
        public int $total = 0,
    ) {}
}
