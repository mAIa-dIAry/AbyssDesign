import commonNavigation from './pl-PL/common/navigation';
import uiAppLock from './pl-PL/ui/appLock';
import uiDatePicker from './pl-PL/ui/datePicker';
import uiDialog from './pl-PL/ui/dialog';
import uiInput from './pl-PL/ui/input';
import uiKeybind from './pl-PL/ui/keybind';
import uiKeypad from './pl-PL/ui/keypad';
import uiMarkdown from './pl-PL/ui/markdown';
import uiNotify from './pl-PL/ui/notify';
import uiPinInput from './pl-PL/ui/pinInput';
import uiTable from './pl-PL/ui/table';

const plPL = {
  common: {
    navigation: commonNavigation,
  },
  ui: {
    appLock: uiAppLock,
    datePicker: uiDatePicker,
    dialog: uiDialog,
    input: uiInput,
    keybind: uiKeybind,
    keypad: uiKeypad,
    markdown: uiMarkdown,
    notify: uiNotify,
    pinInput: uiPinInput,
    table: uiTable,
  },
};

/** Minimalne komunikaty i18n wymagane przez komponenty Abyss Design. */
export const abyssI18nMessages = {
  'pl-PL': plPL,
} as const;

export default abyssI18nMessages;
