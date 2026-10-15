import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { inspectCopy } from '../scripts/ui-copy-checks.mjs';
import { load, uiHarness } from './render-support.mjs';
test('양도세는 기존 공제액을 명시해야 계산하고 지우면 결과를 숨긴다',()=>{
 const {default:C}=load('src/app/capital-gains-tax-calculator/CapitalGainsTaxClient.tsx');const view=uiHarness(C);
 for(const [key,value] of Object.entries({transferPrice:'500000000',acquisitionPrice:'300000000',expenses:'0',acquisitionDate:'2020-01-01',transferDate:'2026-01-01'}))view.change(key,value);
 assert.equal(view.props('ResultActions'),undefined);
 view.change('basicDeductionUsed','0');assert.ok(view.props('ResultActions'));
 inspectCopy(view.html(),'양도세 결과');
 view.change('basicDeductionUsed','');assert.equal(view.props('ResultActions'),undefined);
});
test('연말정산 선납 지방소득세 빈칸은 추정하지 않고 보류한다',()=>{
 const {default:C}=load('src/app/year-end-tax-calculator/YearEndTaxClient.tsx');const view=uiHarness(C);
 const set=(id: string,value: string)=>view.nodes().find((node: {props: {id?: string}})=>node.props.id===id)!.props.onChange(value);
 for(const [key,value] of Object.entries({'ye-annualPay':'30000000','ye-nonTaxablePay':'0','ye-prepaidIncomeTax':'0'}))set(key,value);
 assert.equal(view.props('Result'),undefined);
 set('ye-prepaidLocalTax','0');assert.ok(view.props('Result'));
 inspectCopy(view.html(),'연말정산 결과');assert.match(view.html(),/입력하지 않은 공제 항목/);
 set('ye-prepaidLocalTax','');assert.equal(view.props('Result'),undefined);
});
test('실제 계산기 렌더 텍스트에 내부 식별자가 없다',()=>{
 for(const dir of readdirSync('src/app')){
  const files=(()=>{try{return readdirSync(`src/app/${dir}`)}catch{return []}})();
  for(const file of files.filter(name=>name.endsWith('Client.tsx'))){const {default:C}=load(`src/app/${dir}/${file}`);inspectCopy(uiHarness(C).html(),file);}
 }
});

test('연말정산 방식은 선택한 버튼만 눌림 상태를 제공한다',()=>{
 const {default:C}=load('src/app/year-end-tax-calculator/YearEndTaxClient.tsx');const view=uiHarness(C);
 const buttons=()=>view.nodes().filter((node: {type: unknown;props: Record<string,unknown>})=>node.type==='button'&&typeof node.props['aria-pressed']==='boolean');
 assert.equal(buttons().filter((node: {props: Record<string,unknown>})=>node.props['aria-pressed']).length,1);
 buttons()[2].props.onClick();
 assert.equal(buttons()[2].props['aria-pressed'],true);
 assert.equal(buttons()[0].props['aria-pressed'],false);
});
