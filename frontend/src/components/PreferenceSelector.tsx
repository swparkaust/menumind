'use client';

import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { SettingsIcon } from './ui/Icons';
import { MenuOption } from '../lib/api';
import { getIconForType } from '../lib/menuIcons';

interface PreferenceSelectorProps {
  foodType: string;
  cuisineType: string;
  situation: string;
  onFoodTypeChange: (type: string) => void;
  onCuisineTypeChange: (type: string) => void;
  onSituationChange: (situation: string) => void;
  foodTypes: MenuOption[];
  cuisineTypes: MenuOption[];
  situations: MenuOption[];
}

export function PreferenceSelector({
  foodType,
  cuisineType,
  situation,
  onFoodTypeChange,
  onCuisineTypeChange,
  onSituationChange,
  foodTypes,
  cuisineTypes,
  situations,
}: PreferenceSelectorProps) {
  return (
    <Card variant="primary" className="animate-native-fade-in">
      <CardHeader>
        <div className="flex items-center justify-center gap-2">
          <SettingsIcon size="lg" color="var(--color-label-primary)" />
          <h3 
            className="text-lg font-semibold text-center"
            style={{ color: 'var(--color-label-primary)' }}
          >
            추천 설정
          </h3>
        </div>
      </CardHeader>
      
      <CardContent>
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label 
            className="block text-sm mb-3 font-semibold"
            style={{ color: 'var(--color-label-secondary)' }}
            id="food-type-label"
          >
            음식 유형
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2" role="radiogroup" aria-labelledby="food-type-label">
            {foodTypes.map((type) => {
              const Icon = getIconForType('food', type.value);
              const isSelected = foodType === type.value;
              return (
                <Button
                  key={type.value}
                  variant={isSelected ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => onFoodTypeChange(type.value)}
                  className="animate-native-bounce"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`음식 유형: ${type.label}`}
                >
                  {Icon && <Icon size="sm" aria-hidden="true" />}
                  {type.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label 
            className="block text-sm mb-3 font-semibold"
            style={{ color: 'var(--color-label-secondary)' }}
            id="cuisine-type-label"
          >
            요리 종류
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2" role="radiogroup" aria-labelledby="cuisine-type-label">
            {cuisineTypes.map((cuisine) => {
              const Icon = getIconForType('cuisine', cuisine.value);
              const isSelected = cuisineType === cuisine.value;
              return (
                <Button
                  key={cuisine.value}
                  variant={isSelected ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => onCuisineTypeChange(cuisine.value)}
                  className="animate-native-bounce"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`요리 종류: ${cuisine.label}`}
                >
                  {Icon && <Icon size="sm" aria-hidden="true" />}
                  {cuisine.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <label 
            className="block text-sm mb-3 font-semibold"
            style={{ color: 'var(--color-label-secondary)' }}
            id="situation-label"
          >
            상황
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2" role="radiogroup" aria-labelledby="situation-label">
            {situations.map((sit) => {
              const Icon = getIconForType('situation', sit.value);
              const isSelected = situation === sit.value;
              return (
                <Button
                  key={sit.value}
                  variant={isSelected ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => onSituationChange(sit.value)}
                  className="animate-native-bounce"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`상황: ${sit.label}`}
                >
                  {Icon && (
                    sit.value === 'date' ? 
                    <Icon size="sm" {...(isSelected ? { filled: true } : {})} aria-hidden="true" /> :
                    <Icon size="sm" aria-hidden="true" />
                  )}
                  {sit.label}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}