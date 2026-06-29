import { THEME_GRADIENT_COLORS } from '@/defines/gradient-colors';
import { type CssColor, type GradientPreset } from '@/types/color';

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    label: 'Default',
    colors: [...THEME_GRADIENT_COLORS],
  },
  {
    label: 'Gold',
    colors: [
      'hsl(48, 100%, 77%)' as CssColor,
      'hsl(18, 100%, 69%)' as CssColor,
    ],
  },
  {
    label: 'Sakura',
    colors: [
      'hsl(291, 86%, 85%)' as CssColor,
      'hsl(235, 100%, 72%)' as CssColor,
    ],
  },
  {
    label: 'Garden',
    colors: [
      'hsl(85, 100%, 69%)' as CssColor,
      'hsl(133, 90%, 45%)' as CssColor,
    ],
  },
  {
    label: 'WojtkunFrozen',
    colors: [
      'hsl(197, 82%, 64%)' as CssColor,
      'hsl(246, 56%, 48%)' as CssColor,
    ],
  },
  {
    label: 'WojtkunMorning',
    colors: [
      'hsl(223, 49%, 88%)' as CssColor,
      'hsl(358, 81%, 75%)' as CssColor,
    ],
  },
  {
    label: 'NeonCircuit',
    colors: [
      'hsl(148, 100%, 62%)' as CssColor,
      'hsl(188, 82%, 40%)' as CssColor,
    ],
  },
  {
    label: 'PeachFizz',
    colors: ['hsl(28, 90%, 78%)' as CssColor, 'hsl(350, 75%, 42%)' as CssColor],
  },
  {
    label: 'RoyalInk',
    colors: [
      'hsl(44, 100%, 68%)' as CssColor,
      'hsl(248, 70%, 42%)' as CssColor,
    ],
  },
  {
    label: 'StormPurple',
    colors: [
      'hsl(278, 70%, 55%)' as CssColor,
      'hsl(265, 55%, 42%)' as CssColor,
    ],
  },
  {
    label: 'CrimsonDepth',
    colors: [
      'hsl(350, 75%, 48%)' as CssColor,
      'hsl(330, 55%, 32%)' as CssColor,
    ],
  },
  {
    label: 'IronClad',
    colors: ['hsl(32, 18%, 72%)' as CssColor, 'hsl(225, 28%, 34%)' as CssColor],
  },
  {
    label: 'MossStone',
    colors: ['hsl(28, 34%, 81%)' as CssColor, 'hsl(30, 9%, 38%)' as CssColor],
  },
  {
    label: 'TropicalStorm',
    colors: [
      'hsl(88, 100%, 55%)' as CssColor,
      'hsl(290, 75%, 44%)' as CssColor,
    ],
  },
  {
    label: 'JadeEmber',
    colors: ['hsl(38, 85%, 62%)' as CssColor, 'hsl(168, 50%, 44%)' as CssColor],
  },
  {
    label: 'EmberViolet',
    colors: [
      'hsl(28, 100%, 58%)' as CssColor,
      'hsl(275, 75%, 42%)' as CssColor,
    ],
  },
  {
    label: 'NorthernFire',
    colors: ['hsl(140, 70%, 48%)' as CssColor, 'hsl(15, 85%, 44%)' as CssColor],
  },
];

export const DEFAULT_GRADIENT_PRESET = GRADIENT_PRESETS[0] as GradientPreset;

export function findGradientPresetByLabel(
  label: string,
): GradientPreset | undefined {
  return GRADIENT_PRESETS.find((preset) => preset.label === label);
}
