import { getAppIntl } from '../appIntl';
import messages from './messages';

/** The name a new section, subsection, unit or bank gets, in the application's language. */
export const getDefaultBlockName = (category) => {
  const message = {
    chapter: messages.chapter,
    sequential: messages.sequential,
    vertical: messages.vertical,
    library_content: messages.libraryContent,
    itembank: messages.itembank,
  }[category];
  return message ? getAppIntl().formatMessage(message) : '';
};

export default getDefaultBlockName;
