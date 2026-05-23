declare namespace App {
namespace Data {
export type AdjustmentCategoryData = {
id: number,
created_at: string,
updated_at: string,
name: string,
note: string | null,
is_active: boolean,
is_default: boolean,
};
export type AdjustmentData = {
id: number,
created_at: string,
updated_at: string,
date: string,
adjustment_category_id: number,
reference: string | null,
note: string | null,
adjustment_total_quantity: number,
};
export type AdjustmentItemData = {
id: number,
created_at: string,
updated_at: string,
adjustment_id: number,
product_id: number,
unit_id: number,
adjustment_item_type: App.Enums.AdjustmentItemType,
quantity: number,
};
export type BrandData = {
id: number,
created_at: string,
updated_at: string,
name: string,
note: string | null,
is_active: boolean,
is_default: boolean,
};
export type CategoryData = {
id: number,
created_at: string,
updated_at: string,
name: string,
note: string | null,
is_active: boolean,
is_default: boolean,
};
export type CustomerData = {
id: number,
created_at: string,
updated_at: string,
name: string,
email: string | null,
phone: string | null,
address: string | null,
city: string | null,
state: string | null,
country: string | null,
note: string | null,
is_active: boolean,
is_default: boolean,
};
export type ExpenseData = {
id: number,
created_at: string,
updated_at: string,
payment_method_id: number,
date: string,
reference: string | null,
note: string | null,
status: App.Enums.StatusType,
payment_status: App.Enums.PaymentStatusType,
payment_date: string | null,
payment_amount: number,
tax: number,
discount: number,
shipping: number,
amount: number,
total: number,
};
export type ExpenseItemData = {
id: number,
created_at: string,
updated_at: string,
name: string,
quantity: number,
discount: number,
price: number,
subtotal: number,
};
export type HoldData = {
id: number,
created_at: string,
updated_at: string,
date: string,
customer_id: number,
payment_method_id: number,
reference: string | null,
note: string | null,
status: App.Enums.StatusType,
payment_status: App.Enums.PaymentStatusType,
payment_date: string | null,
payment_amount: number,
tax: number,
discount: number,
shipping: number,
price: number,
total: number,
};
export type HoldItemData = {
id: number,
created_at: string,
updated_at: string,
product_id: number,
unit_id: number,
quantity: number,
discount: number,
price: number,
subtotal: number,
};
export type PaymentData = {
id: number,
created_at: string,
updated_at: string,
payment_method_id: number,
date: string,
amount: number,
reference: string | null,
};
export type PaymentMethodData = {
id: number,
created_at: string,
updated_at: string,
name: string,
note: string | null,
is_active: boolean,
is_default: boolean,
};
export type PosData = {
id: number,
created_at: string,
updated_at: string,
opened_at: string,
opened_by: number,
closed_at: string,
closed_by: number,
};
export type ProductData = {
id: number,
created_at: string,
updated_at: string,
category_id: number,
brand_id: number,
unit_id: number,
name: string,
product_cost: number,
product_price: number,
code: string | null,
reference: string | null,
note: string | null,
stock_alert_quantity: number,
stock_limit_quantity: number,
stock_opening_quantity: number,
is_active: boolean,
};
export type PurchaseData = {
id: number,
created_at: string,
updated_at: string,
supplier_id: number,
payment_method_id: number,
date: string,
reference: string | null,
note: string | null,
status: App.Enums.StatusType,
payment_status: App.Enums.PaymentStatusType,
payment_date: string | null,
payment_amount: number,
tax: number,
discount: number,
shipping: number,
price: number,
total: number,
};
export type PurchaseItemData = {
id: number,
created_at: string,
updated_at: string,
product_id: number,
unit_id: number,
quantity: number,
discount: number,
price: number,
subtotal: number,
};
export type PurchaseReturnData = {
id: number,
created_at: string,
updated_at: string,
purchase_id: number,
supplier_id: number,
payment_method_id: number,
date: string,
reference: string | null,
note: string | null,
status: App.Enums.StatusType,
payment_status: App.Enums.PaymentStatusType,
payment_date: string | null,
payment_amount: number,
tax: number,
discount: number,
shipping: number,
price: number,
total: number,
};
export type PurchaseReturnItemData = {
id: number,
created_at: string,
updated_at: string,
product_id: number,
unit_id: number,
quantity: number,
discount: number,
price: number,
subtotal: number,
};
export type SaleData = {
id: number,
created_at: string,
updated_at: string,
date: string,
customer_id: number,
payment_method_id: number,
reference: string | null,
note: string | null,
status: App.Enums.StatusType,
payment_status: App.Enums.PaymentStatusType,
payment_date: string | null,
payment_amount: number,
tax: number,
discount: number,
shipping: number,
price: number,
total: number,
};
export type SaleItemData = {
id: number,
created_at: string,
updated_at: string,
product_id: number,
unit_id: number,
quantity: number,
discount: number,
price: number,
subtotal: number,
};
export type SaleReturnData = {
id: number,
created_at: string,
updated_at: string,
sale_id: number,
customer_id: number,
payment_method_id: number,
date: string,
reference: string | null,
note: string | null,
status: App.Enums.StatusType,
payment_status: App.Enums.PaymentStatusType,
payment_date: string | null,
payment_amount: number,
tax: number,
discount: number,
shipping: number,
price: number,
total: number,
};
export type SaleReturnItemData = {
id: number,
created_at: string,
updated_at: string,
product_id: number,
unit_id: number,
quantity: number,
discount: number,
price: number,
subtotal: number,
};
export type StockData = {
id: number,
created_at: string,
updated_at: string,
product_id: number,
unit_id: number,
quantity: number,
stock_alert_quantity: number,
stock_limit_quantity: number,
};
export type SupplierData = {
id: number,
created_at: string,
updated_at: string,
name: string,
email: string | null,
phone: string | null,
address: string | null,
city: string | null,
state: string | null,
country: string | null,
note: string | null,
is_active: boolean,
is_default: boolean,
};
export type UnitData = {
id: number,
created_at: string,
updated_at: string,
name: string,
alias: string | null,
note: string | null,
unit_parent_id: number | null,
conversion_operator: string | null,
conversion_value: number | null,
is_active: boolean,
is_default: boolean,
};
export type UserData = {
id: number,
email_verified_at: string,
created_at: string,
updated_at: string,
name: string,
email: string,
};
}
namespace Enums {
export type AdjustmentItemType = '1' | '2';
export type PaymentStatusType = '0' | '1';
export type StatusType = '0' | '1';
}
}
declare namespace Illuminate {
export type CursorPaginator<TKey, TValue> = {
data: TKey extends string ? Record<TKey, TValue> : TValue[],
links: {
url: string | null,
label: string,
active: boolean,
}[],
meta: {
path: string,
per_page: number,
next_cursor: string | null,
next_page_url: string | null,
prev_cursor: string | null,
prev_page_url: string | null,
},
};
export type CursorPaginatorInterface<TKey, TValue> = Illuminate.CursorPaginator<TKey, TValue>;
export type LengthAwarePaginator<TKey, TValue> = {
data: TKey extends string ? Record<TKey, TValue> : TValue[],
links: {
url: string | null,
label: string,
active: boolean,
}[],
meta: {
total: number,
current_page: number,
first_page_url: string,
from: number | null,
last_page: number,
last_page_url: string,
next_page_url: string | null,
path: string,
per_page: number,
prev_page_url: string | null,
to: number | null,
},
};
export type LengthAwarePaginatorInterface<TKey, TValue> = Illuminate.LengthAwarePaginator<TKey, TValue>;
}
declare namespace Spatie {
namespace LaravelData {
export type CursorPaginatedDataCollection<TKey, TValue> = Illuminate.CursorPaginator<TKey, TValue>;
export type PaginatedDataCollection<TKey, TValue> = Illuminate.LengthAwarePaginator<TKey, TValue>;
}
}
