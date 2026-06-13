import commonNavigation from './pl-PL/common/navigation';
import uiDatePicker from './pl-PL/ui/datePicker';
import uiTable from './pl-PL/ui/table';

const plPL = {
  common: {
    navigation: commonNavigation,
  },
  ui: {
    datePicker: uiDatePicker,
    table: uiTable,
  },
};

/** Minimalne komunikaty i18n wymagane przez komponenty Abyss Design. */
export const abyssI18nMessages = {
  'pl-PL': plPL,
} as const;

export default abyssI18nMessages;
