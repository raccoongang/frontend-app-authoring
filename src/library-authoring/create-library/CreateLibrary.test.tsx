import React from 'react';
import type MockAdapter from 'axios-mock-adapter';
import userEvent from '@testing-library/user-event';

import {
  act,
  fireEvent,
  initializeMocks,
  render,
  screen,
  waitFor,
} from '../../testUtils';
import { studioHomeMock } from '../../studio-home/__mocks__';
import { getStudioHomeApiUrl } from '../../studio-home/data/api';
import { getApiWaffleFlagsUrl } from '../../data/api';
import { CreateLibrary } from '.';
import { getContentLibraryV2CreateApiUrl } from './data/api';
import messages from './messages';

const mockNavigate = jest.fn();
let axiosMock: MockAdapter;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../generic/data/apiHooks', () => ({
  ...jest.requireActual('../../generic/data/apiHooks'),
  useOrganizationListData: () => ({
    data: ['org1', 'org2', 'org3', 'org4', 'org5'],
    isLoading: false,
  }),
}));

describe('<CreateLibrary />', () => {
  beforeEach(() => {
    axiosMock = initializeMocks().axiosMock;
    axiosMock
      .onGet(getApiWaffleFlagsUrl(undefined))
      .reply(200, {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    axiosMock.restore();
  });

  test('call api data with correct data', async () => {
    axiosMock.onGet(getStudioHomeApiUrl()).reply(200, studioHomeMock);
    axiosMock.onPost(getContentLibraryV2CreateApiUrl()).reply(200, {
      id: 'library-id',
    });

    render(<CreateLibrary />);

    const titleInput = await screen.findByRole('textbox', { name: /library name/i });
    userEvent.click(titleInput);
    userEvent.type(titleInput, 'Test Library Name');

    const orgInput = await screen.findByRole('combobox', { name: /organization/i });
    userEvent.click(orgInput);
    userEvent.type(orgInput, 'org1');
    act(() => userEvent.tab());

    const slugInput = await screen.findByRole('textbox', { name: /library id/i });
    userEvent.click(slugInput);
    userEvent.type(slugInput, 'test_library_slug');

    fireEvent.click(await screen.findByRole('button', { name: /create/i }));
    await waitFor(() => {
      expect(axiosMock.history.post.length).toBe(1);
      expect(axiosMock.history.post[0].data).toBe(
        '{"description":"","title":"Test Library Name","org":"org1","slug":"test_library_slug"}',
      );
      expect(mockNavigate).toHaveBeenCalledWith('/library/library-id');
    });
  });

  test('cannot create new org unless allowed', async () => {
    axiosMock.onGet(getStudioHomeApiUrl()).reply(200, studioHomeMock);
    axiosMock.onPost(getContentLibraryV2CreateApiUrl()).reply(200, {
      id: 'library-id',
    });

    render(<CreateLibrary />);

    const titleInput = await screen.findByRole('textbox', { name: /library name/i });
    userEvent.click(titleInput);
    userEvent.type(titleInput, 'Test Library Name');

    // We cannot create a new org, and so we're restricted to the allowed list
    const orgOptions = screen.getByTestId('autosuggest-iconbutton');
    userEvent.click(orgOptions);
    expect(screen.getByText('org1')).toBeInTheDocument();
    ['org2', 'org3', 'org4', 'org5'].forEach((org) => expect(screen.queryByText(org)).not.toBeInTheDocument());

    const orgInput = await screen.findByRole('combobox', { name: /organization/i });
    userEvent.click(orgInput);
    userEvent.type(orgInput, 'NewOrg');
    act(() => userEvent.tab());

    const slugInput = await screen.findByRole('textbox', { name: /library id/i });
    userEvent.click(slugInput);
    userEvent.type(slugInput, 'test_library_slug');

    fireEvent.click(await screen.findByRole('button', { name: /create/i }));
    await waitFor(() => {
      expect(axiosMock.history.post.length).toBe(0);
    });
    expect(await screen.findByText('Required field.')).toBeInTheDocument();
  });

  test('can create new org if allowed', async () => {
    axiosMock.onGet(getStudioHomeApiUrl()).reply(200, {
      ...studioHomeMock,
      allow_to_create_new_org: true,
    });
    axiosMock.onPost(getContentLibraryV2CreateApiUrl()).reply(200, {
      id: 'library-id',
    });

    render(<CreateLibrary />);

    const titleInput = await screen.findByRole('textbox', { name: /library name/i });
    userEvent.click(titleInput);
    userEvent.type(titleInput, 'Test Library Name');

    // We can create a new org, so we're also allowed to use any existing org
    const orgOptions = screen.getByTestId('autosuggest-iconbutton');
    userEvent.click(orgOptions);
    ['org1', 'org2', 'org3', 'org4', 'org5'].forEach((org) => expect(screen.queryByText(org)).toBeInTheDocument());

    const orgInput = await screen.findByRole('combobox', { name: /organization/i });
    userEvent.click(orgInput);
    userEvent.type(orgInput, 'NewOrg');
    act(() => userEvent.tab());

    const slugInput = await screen.findByRole('textbox', { name: /library id/i });
    userEvent.click(slugInput);
    userEvent.type(slugInput, 'test_library_slug');

    fireEvent.click(await screen.findByRole('button', { name: /create/i }));
    await waitFor(() => {
      expect(axiosMock.history.post.length).toBe(1);
      expect(axiosMock.history.post[0].data).toBe(
        '{"description":"","title":"Test Library Name","org":"NewOrg","slug":"test_library_slug"}',
      );
      expect(mockNavigate).toHaveBeenCalledWith('/library/library-id');
    });
  });

  const fillForm = async ({ org = 'org1', slug = 'test_library_slug' } = {}) => {
    const titleInput = await screen.findByRole('textbox', { name: /library name/i });
    userEvent.click(titleInput);
    userEvent.type(titleInput, 'Test Library Name');

    const orgInput = await screen.findByTestId('autosuggest-textbox-input');
    userEvent.click(orgInput);
    userEvent.type(orgInput, org);
    act(() => userEvent.tab());

    const slugInput = await screen.findByRole('textbox', { name: /library id/i });
    userEvent.click(slugInput);
    userEvent.type(slugInput, slug);
    return { titleInput, orgInput, slugInput };
  };

  test('shows a plain error message, without the raw response, when creation fails', async () => {
    axiosMock.onGet(getStudioHomeApiUrl()).reply(200, studioHomeMock);
    axiosMock.onPost(getContentLibraryV2CreateApiUrl()).reply(500, {
      detail: 'Internal server error',
    });
    render(<CreateLibrary />);

    await fillForm();
    fireEvent.click(await screen.findByRole('button', { name: /create/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(messages.createLibraryError.defaultMessage);
    expect(axiosMock.history.post.length).toBe(1);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.queryByText(/status code/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Internal server error/)).not.toBeInTheDocument();
    expect(screen.queryByText(messages.slugAlreadyExistsError.defaultMessage)).not.toBeInTheDocument();
  });

  test('shows a taken library ID under the Library ID field and recovers when the ID changes', async () => {
    axiosMock.onGet(getStudioHomeApiUrl()).reply(200, studioHomeMock);
    axiosMock.onPost(getContentLibraryV2CreateApiUrl())
      .replyOnce(400, { slug: 'A library with that ID already exists.' })
      .onPost(getContentLibraryV2CreateApiUrl())
      .reply(200, { id: 'library-id' });
    render(<CreateLibrary />);

    const { titleInput, orgInput, slugInput } = await fillForm({ slug: 'taken_slug' });
    fireEvent.click(await screen.findByRole('button', { name: /create/i }));

    const slugError = await screen.findByText(messages.slugAlreadyExistsError.defaultMessage);
    // The message is the field's description, so screen readers announce it with the field.
    expect(slugInput).toHaveAttribute('aria-describedby', slugError.closest('.pgn__form-control-description')?.id);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText(/status code/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/already exists\.$/)).not.toBeInTheDocument();
    expect(titleInput).toHaveValue('Test Library Name');
    expect(orgInput).toHaveValue('org1');
    expect(slugInput).toHaveValue('taken_slug');
    expect(mockNavigate).not.toHaveBeenCalled();

    // The same org + ID is known to be taken, so submitting it again doesn't reach the server.
    fireEvent.click(await screen.findByRole('button', { name: /create/i }));
    await waitFor(() => expect(screen.getByText(messages.slugAlreadyExistsError.defaultMessage)).toBeInTheDocument());
    expect(axiosMock.history.post.length).toBe(1);

    userEvent.click(slugInput);
    userEvent.type(slugInput, '2');
    act(() => userEvent.tab());
    await waitFor(() => {
      expect(screen.queryByText(messages.slugAlreadyExistsError.defaultMessage)).not.toBeInTheDocument();
    });

    fireEvent.click(await screen.findByRole('button', { name: /create/i }));
    await waitFor(() => {
      expect(axiosMock.history.post.length).toBe(2);
      expect(JSON.parse(axiosMock.history.post[1].data)).toMatchObject({ org: 'org1', slug: 'taken_slug2' });
      expect(mockNavigate).toHaveBeenCalledWith('/library/library-id');
    });
  });

  test('does not flag an ID the user changed while the rejected request was in flight', async () => {
    axiosMock.onGet(getStudioHomeApiUrl()).reply(200, studioHomeMock);
    let rejectRequest: () => void = () => {};
    axiosMock.onPost(getContentLibraryV2CreateApiUrl()).replyOnce(() => new Promise((resolve) => {
      rejectRequest = () => resolve([400, { slug: 'A library with that ID already exists.' }]);
    }));
    render(<CreateLibrary />);

    const { slugInput } = await fillForm({ slug: 'taken_slug' });
    fireEvent.click(await screen.findByRole('button', { name: /create/i }));
    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    userEvent.click(slugInput);
    userEvent.type(slugInput, '2');
    act(() => userEvent.tab());
    act(() => rejectRequest());

    expect(await screen.findByRole('button', { name: 'Create' })).toBeEnabled();
    expect(screen.queryByText(messages.slugAlreadyExistsError.defaultMessage)).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // Going back to the rejected ID shows the conflict without another request.
    userEvent.clear(slugInput);
    userEvent.type(slugInput, 'taken_slug');
    act(() => userEvent.tab());
    expect(await screen.findByText(messages.slugAlreadyExistsError.defaultMessage)).toBeInTheDocument();
    expect(axiosMock.history.post.length).toBe(1);
  });

  test('allows the same library ID in another organization', async () => {
    axiosMock.onGet(getStudioHomeApiUrl()).reply(200, {
      ...studioHomeMock,
      allowed_organizations_for_libraries: ['org1', 'org2'],
    });
    axiosMock.onPost(getContentLibraryV2CreateApiUrl())
      .replyOnce(400, { slug: 'A library with that ID already exists.' })
      .onPost(getContentLibraryV2CreateApiUrl())
      .reply(200, { id: 'library-id' });
    render(<CreateLibrary />);

    const { orgInput } = await fillForm({ slug: 'taken_slug' });
    fireEvent.click(await screen.findByRole('button', { name: /create/i }));
    await screen.findByText(messages.slugAlreadyExistsError.defaultMessage);

    userEvent.clear(orgInput);
    userEvent.type(orgInput, 'org2');
    act(() => userEvent.tab());
    await waitFor(() => {
      expect(screen.queryByText(messages.slugAlreadyExistsError.defaultMessage)).not.toBeInTheDocument();
    });

    fireEvent.click(await screen.findByRole('button', { name: /create/i }));
    await waitFor(() => {
      expect(axiosMock.history.post.length).toBe(2);
      expect(JSON.parse(axiosMock.history.post[1].data)).toMatchObject({ org: 'org2', slug: 'taken_slug' });
      expect(mockNavigate).toHaveBeenCalledWith('/library/library-id');
    });
  });

  test('cancel creating library navigates to libraries page', async () => {
    render(<CreateLibrary />);

    fireEvent.click(await screen.findByRole('button', { name: /cancel/i }));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/libraries');
    });
  });
});
