import { useRef } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import { uniqueId } from 'lodash';

import messages from './messages';

/**
 * Paragon's TextFilter with a translatable label: Paragon writes
 * `Search ${header}` in English and has no prop for it.
 */
const SearchFilter = ({
  column: {
    filterValue, setFilter, Header,
  },
}) => {
  const intl = useIntl();
  const controlId = useRef(uniqueId('search-filter-'));
  const header = typeof Header === 'function' ? Header() : Header;
  const label = intl.formatMessage(messages.searchColumn, {
    column: typeof header === 'string' ? header.toLowerCase() : '',
  });

  return (
    <Form.Group controlId={controlId.current}>
      <Form.Label className="sr-only">{label}</Form.Label>
      <Form.Control
        value={filterValue || ''}
        type="text"
        onChange={(e) => setFilter(e.target.value || undefined)}
        placeholder={label}
      />
    </Form.Group>
  );
};

SearchFilter.propTypes = {
  column: PropTypes.shape({
    filterValue: PropTypes.string,
    setFilter: PropTypes.func.isRequired,
    Header: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  }).isRequired,
};

export default SearchFilter;
