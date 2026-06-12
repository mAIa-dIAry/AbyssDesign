export interface DesktopShortcutKeyboardInput {
  altKey: boolean;
  altGraphKey?: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  code: string;
  key: string;
}

const MODIFIER_CODES = new Set([
  'AltLeft',
  'AltRight',
  'ControlLeft',
  'ControlRight',
  'MetaLeft',
  'MetaRight',
  'ShiftLeft',
  'ShiftRight',
]);

const SPECIAL_CODE_MAP: Record<string, string> = {
  ArrowDown: 'Down',
  ArrowLeft: 'Left',
  ArrowRight: 'Right',
  ArrowUp: 'Up',
  Backquote: '`',
  Backslash: '\\',
  Backspace: 'Backspace',
  BracketLeft: '[',
  BracketRight: ']',
  Comma: ',',
  Delete: 'Delete',
  End: 'End',
  Enter: 'Enter',
  Equal: '=',
  Escape: 'Esc',
  Home: 'Home',
  Insert: 'Insert',
  Minus: '-',
  NumpadAdd: 'NumAdd',
  NumpadDecimal: 'NumDec',
  NumpadDivide: 'NumDiv',
  NumpadMultiply: 'NumMult',
  NumpadSubtract: 'NumSub',
  PageDown: 'PageDown',
  PageUp: 'PageUp',
  Period: '.',
  Quote: "'",
  Semicolon: ';',
  Slash: '/',
  Space: 'Space',
  Tab: 'Tab',
};

function resolveMainKey(input: DesktopShortcutKeyboardInput): string | null {
  if (MODIFIER_CODES.has(input.code)) {
    return null;
  }

  if (/^Key[A-Z]$/.test(input.code)) {
    return input.code.replace('Key', '');
  }

  if (/^Digit[0-9]$/.test(input.code)) {
    return input.code.replace('Digit', '');
  }

  if (/^Numpad[0-9]$/.test(input.code)) {
    return input.code.replace('Numpad', 'Num');
  }

  if (/^F([1-9]|1\d|2[0-4])$/.test(input.code)) {
    return input.code;
  }

  return SPECIAL_CODE_MAP[input.code] ?? null;
}

export function resolveDesktopShortcutFromKeyboardInput(
  input: DesktopShortcutKeyboardInput,
): string | null {
  const modifiers: string[] = [];
  const hasCtrlModifier = input.ctrlKey || input.altGraphKey === true;
  const hasAltModifier = input.altKey || input.altGraphKey === true;

  if (hasCtrlModifier) {
    modifiers.push('Ctrl');
  }

  if (hasAltModifier) {
    modifiers.push('Alt');
  }

  if (input.shiftKey) {
    modifiers.push('Shift');
  }

  if (input.metaKey) {
    modifiers.push('Super');
  }

  const mainKey = resolveMainKey(input);

  if (!mainKey || modifiers.length === 0) {
    return null;
  }

  return [...modifiers, mainKey].join('+');
}
