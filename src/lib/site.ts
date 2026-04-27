export const SITE = {
    url: 'https://taxsim.kr',
    name: '세금계산기',          // ← 변경
    title: '세금계산기',
    operatorName: 'Incomelab',
    operatorEmail: 'support@taxsim.kr',
    description:
        '부가세, 종합소득세, 원천징수, 프리랜서 3.3%, 양도소득세, 증여세, 상속세를 쉽게 계산할 수 있는 무료 세금 계산기입니다.',
} as const;

export const BASE_URL = SITE.url;