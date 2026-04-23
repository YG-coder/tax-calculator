/** @path src/app/sitemap.ts */
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://taxsim.kr',
            lastModified: new Date(),
        },
        {
            url: 'https://taxsim.kr/vat-calculator',
        },
        {
            url: 'https://taxsim.kr/income-tax-calculator',
        },
        {
            url: 'https://taxsim.kr/withholding-calculator',
        },
        {
            url: 'https://taxsim.kr/severance-calculator',
        },
        {
            url: 'https://taxsim.kr/freelancer-tax-calculator',
        },
        {
            url: 'https://taxsim.kr/insurance-calculator',
        },
    ];
}