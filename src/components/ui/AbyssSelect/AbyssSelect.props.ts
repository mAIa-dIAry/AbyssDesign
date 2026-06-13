import type { ValidationRule } from 'quasar';

export interface AbyssSelectProps {
  modelValue?: unknown;
  options?: unknown[];
  multiple?: boolean;
  displayValue?: string | number;
  displayValueHtml?: boolean;
  optionsHtml?: boolean;
  emitValue?: boolean;
  mapOptions?: boolean;
  optionValue?: string | ((option: unknown) => unknown);
  optionLabel?: string | ((option: unknown) => string);
  optionDisable?: string | ((option: unknown) => boolean);
  optionsCover?: boolean;
  optionsDense?: boolean;
  optionsSelectedClass?: string;
  useInput?: boolean;
  useChips?: boolean;
  fillInput?: boolean;
  hideSelected?: boolean;
  hideDropdownIcon?: boolean;
  clearable?: boolean;
  maxValues?: number | string;
  newValueMode?: 'add' | 'add-unique' | 'toggle';
  loading?: boolean;
  label?: string;
  hint?: string;
  error?: boolean;
  errorMessage?: string;
  rules?: ValidationRule[];
  lazyRules?: boolean | 'ondemand';
  hideBottomSpace?: boolean;
  counter?: boolean;
  disable?: boolean;
  readonly?: boolean;
  autofocus?: boolean;
  dense?: boolean;
  size?: 'normal' | 'small';
  flat?: boolean;
  prefix?: string;
  suffix?: string;
  tabindex?: number | string;
  forAttr?: string;
  name?: string;
  autocomplete?: string;
  behavior?: 'default' | 'menu' | 'dialog';
  popupNoRouteDismiss?: boolean;
  disableTabSelection?: boolean;
  virtualScrollSliceSize?: number | string;
  virtualScrollSliceRatioBefore?: number | string;
  virtualScrollSliceRatioAfter?: number | string;
  virtualScrollItemSize?: number | string;
  virtualScrollStickySizeStart?: number | string;
  virtualScrollStickySizeEnd?: number | string;
  virtualScrollHorizontal?: boolean;
  style?: string | Record<string, string>;
  class?:
    | string
    | Record<string, boolean>
    | Array<string | Record<string, boolean>>;
}
