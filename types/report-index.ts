export type OperationType = '+' | '-' | '*' | '/';

export type RPNExpression = Array<OperationType | number | string>;

export interface ReportIndexSchema {
  /** 筛选标识符 id */
  id: string;

  /** 筛选项名称 */
  title?: string;

  /** 中缀表达式 */
  expression?: string;

  /** 逆波兰表达式 */
  RPN?: RPNExpression;

  /** 限制 */
  limit?: [number | undefined, number | undefined];

  /** 亿/万/无单位 */
  limitUnit?: 'y' | 'w';
}

export type ReportIndexUnit = '%' | 'none';

export interface ReportIndicator {
  /** 筛选标识符 id */
  id: string;

  /** 筛选项名称 */
  title?: string;

  /** 中缀表达式 */
  expression?: string;

  /** 逆波兰表达式 */
  RPN?: RPNExpression;

  /** 单位 */
  unit?: ReportIndexUnit;
}

export interface ReportIndicatorGroup {
  id: string;
  title: string;
  indicators: ReportIndicator[];
}
