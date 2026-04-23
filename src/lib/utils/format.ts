export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('ko-KR').format(Math.floor(value));
}