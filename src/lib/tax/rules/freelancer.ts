// src/lib/tax/rules/freelancer.ts
//
// 사업소득 원천징수 3.3% (소득세법 §129 3% + 지방소득세 0.3%)

export type FreelancerWithholding = {
    incomeTax: number;
    localTax: number;
    totalTax: number;
    net: number;
};

export function freelancerWithholding(amount: number): FreelancerWithholding {
    if (amount <= 0) return { incomeTax: 0, localTax: 0, totalTax: 0, net: 0 };

    const incomeTax = Math.floor(amount * 0.03);
    const localTax = Math.floor(amount * 0.003);
    const totalTax = incomeTax + localTax;
    return { incomeTax, localTax, totalTax, net: amount - totalTax };
}
