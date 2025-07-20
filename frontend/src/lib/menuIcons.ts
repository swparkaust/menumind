import {
  GlobeIcon,
  ForkKnifeIcon,
  BowlIcon,
  CookieIcon,
  UserIcon,
  UsersIcon,
  HeartIcon,
  HomeIcon,
  StarIcon,
  PizzaIcon,
  SushiIcon,
  NoodlesIcon,
  TacoIcon,
  BaguetteIcon,
  SpiceIcon,
  BurgerIcon,
  OliveIcon,
  RiceIcon,
  CoffeeIcon,
  PlateIcon,
  CalendarIcon,
  SunIcon,
} from '@/components/ui/Icons';
import { ComponentType } from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

type IconComponent = ComponentType<IconProps>;
type IconWithFilled = ComponentType<IconProps & { filled?: boolean }>;

export const foodTypeIcons: Record<string, IconComponent | IconWithFilled> = {
  'all': GlobeIcon,
  'meal': PlateIcon,
  'dish': ForkKnifeIcon,
  'snack': CookieIcon,
};

export const cuisineTypeIcons: Record<string, IconComponent | IconWithFilled> = {
  'all': GlobeIcon,
  'Korean': RiceIcon,
  'Chinese': NoodlesIcon,
  'Japanese': SushiIcon,
  'Italian': PizzaIcon,
  'Asian': BowlIcon,
  'Mexican': TacoIcon,
  'French': BaguetteIcon,
  'Thai': SpiceIcon,
  'Indian': SpiceIcon,
  'Middle_Eastern': OliveIcon,
  'American': BurgerIcon,
  'Mediterranean': OliveIcon,
};

export const situationIcons: Record<string, IconComponent | IconWithFilled> = {
  'all': GlobeIcon,
  'solo dining': UserIcon,
  'family dinner': HomeIcon,
  'casual outing': SunIcon,
  'date': HeartIcon,
  'group gathering': UsersIcon,
};

export const getIconForType = (
  type: 'food' | 'cuisine' | 'situation',
  value: string
): IconComponent | IconWithFilled | null => {
  const iconMaps = {
    food: foodTypeIcons,
    cuisine: cuisineTypeIcons,
    situation: situationIcons,
  };

  return iconMaps[type]?.[value] || null;
};