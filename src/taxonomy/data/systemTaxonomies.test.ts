import { localizeTaxonomy } from './systemTaxonomies';
import type { TaxonomyData } from './types';

const taxonomy = (overrides: Partial<TaxonomyData>) => ({
  id: -1,
  name: 'Languages',
  description: 'Languages that are enabled on this system.',
  ...overrides,
} as TaxonomyData);

describe('localizeTaxonomy', () => {
  it('keeps the text the platform wrote when the language is English', () => {
    expect(localizeTaxonomy(taxonomy({}))).toEqual(taxonomy({}));
  });

  it('leaves another taxonomy as it is', () => {
    const other = taxonomy({ id: 5, name: 'Languages' });

    expect(localizeTaxonomy(other)).toBe(other);
  });

  it('shows a name an administrator changed as it is', () => {
    const renamed = taxonomy({ name: 'Мови курсу', description: 'Свій опис' });

    expect(localizeTaxonomy(renamed)).toEqual(renamed);
  });
});
