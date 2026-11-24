import { defineMessages } from '@edx/frontend-platform/i18n';
import { getAppIntl } from '../../generic/appIntl';
import type { TaxonomyData } from './types';

// The name and the description of a system taxonomy are rows the platform writes in English, so the
// catalogue cannot reach them. They are translated here by taxonomy id, and only while the stored text
// is still the one the platform wrote: a name an administrator changed is shown as it is.
const messages = defineMessages({
  languagesName: {
    id: 'course-authoring.taxonomy.system.languages.name',
    defaultMessage: 'Languages',
    description: 'Name of the system taxonomy of the languages enabled on the platform',
  },
  languagesDescription: {
    id: 'course-authoring.taxonomy.system.languages.description',
    defaultMessage: 'Languages that are enabled on this system.',
    description: 'Description of the system taxonomy of the languages enabled on the platform',
  },
});

const LANGUAGES_TAXONOMY_ID = -1;

const SYSTEM_TAXONOMIES = {
  [LANGUAGES_TAXONOMY_ID]: { name: messages.languagesName, description: messages.languagesDescription },
};

export const localizeTaxonomy = (taxonomy: TaxonomyData): TaxonomyData => {
  const system = SYSTEM_TAXONOMIES[taxonomy?.id];
  if (!system) {
    return taxonomy;
  }
  const intl = getAppIntl();
  return {
    ...taxonomy,
    name: taxonomy.name === system.name.defaultMessage
      ? intl.formatMessage(system.name)
      : taxonomy.name,
    description: taxonomy.description === system.description.defaultMessage
      ? intl.formatMessage(system.description)
      : taxonomy.description,
  };
};
