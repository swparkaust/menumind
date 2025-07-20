import { MenuOptions, MenuOption } from './api';

export class MenuOptionsHelper {
  private static foodTypes: MenuOption[] = [];
  private static cuisineTypes: MenuOption[] = [];
  private static situations: MenuOption[] = [];

  static setOptions(options: MenuOptions) {
    this.foodTypes = options.food_types;
    this.cuisineTypes = options.cuisine_types;
    this.situations = options.situations;
  }

  static getFoodTypeLabel(value: string): string {
    const option = this.foodTypes.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  static getCuisineTypeLabel(value: string): string {
    const option = this.cuisineTypes.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  static getSituationLabel(value: string): string {
    const option = this.situations.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  static getLabels(foodType: string, cuisineType: string, situation: string) {
    return {
      foodType: this.getFoodTypeLabel(foodType),
      cuisineType: this.getCuisineTypeLabel(cuisineType),
      situation: this.getSituationLabel(situation)
    };
  }
}