declare namespace App {
namespace Data {
export type AdjustmentData = {
id: number,
created_at: string,
updated_at: string,
};
export type AdjustmentItemData = {
id: number,
created_at: string,
updated_at: string,
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
};
export type ExpenseItemData = {
id: number,
created_at: string,
updated_at: string,
};
export type HoldData = {
id: number,
created_at: string,
updated_at: string,
};
export type HoldItemData = {
id: number,
created_at: string,
updated_at: string,
};
export type PaymentData = {
id: number,
created_at: string,
updated_at: string,
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
};
export type ProductData = {
id: number,
created_at: string,
updated_at: string,
};
export type PurchaseData = {
id: number,
created_at: string,
updated_at: string,
};
export type PurchaseItemData = {
id: number,
created_at: string,
updated_at: string,
};
export type PurchaseReturnData = {
id: number,
created_at: string,
updated_at: string,
};
export type PurchaseReturnItemData = {
id: number,
created_at: string,
updated_at: string,
};
export type SaleData = {
id: number,
created_at: string,
updated_at: string,
};
export type SaleItemData = {
id: number,
created_at: string,
updated_at: string,
};
export type SaleReturnData = {
id: number,
created_at: string,
updated_at: string,
};
export type SaleReturnItemData = {
id: number,
created_at: string,
updated_at: string,
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
