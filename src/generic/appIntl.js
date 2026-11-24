import { createIntl, getLocale, getMessages } from '@edx/frontend-platform/i18n';

/**
 * An `intl` for code that runs outside a component (redux thunks, event handlers
 * that build data), in the language the application is showing.
 *
 * Falls back to English defaults when the application has not configured i18n
 * (unit tests, tools): `defaultMessage` is then what formatMessage returns.
 */
export const getAppIntl = () => {
  try {
    return createIntl({ locale: getLocale(), messages: getMessages(), onError: () => {} });
  } catch (error) {
    try {
      return createIntl({ locale: 'en', onError: () => {} });
    } catch (fallbackError) {
      // Nothing to format with (i18n is replaced in some tests): the English text is the answer.
      return {
        formatMessage: (message, values = {}) => message.defaultMessage.replace(
          /\{(\w+)\}/g,
          (placeholder, name) => (name in values ? String(values[name]) : placeholder),
        ),
      };
    }
  }
};

export default getAppIntl;
