/** Only a model in the selected brand's existing catalogue can enter a quote. */
export function catalogueModels(models: string): string[] {
  return models.split(", ").filter(Boolean);
}

export function vehicleQuoteSelection(brand: string, models: string, requested: string | null): string {
  return requested && catalogueModels(models).includes(requested) ? `${brand} — ${requested}` : brand;
}

export function canPrefillVehicle(value: string, previous: string | undefined): boolean {
  return !value || value === previous;
}