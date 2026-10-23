import { StudioFooterSlot } from '@edx/frontend-component-footer';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Alert,
  Container,
  Form,
  Button,
  StatefulButton,
  ActionRow,
} from '@openedx/paragon';
import { Formik, FormikProps } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { REGEX_RULES } from '../../constants';
import Header from '../../header';
import FormikControl from '../../generic/FormikControl';
import FormikErrorFeedback from '../../generic/FormikErrorFeedback';
import { useOrganizationListData } from '../../generic/data/apiHooks';
import SubHeader from '../../generic/sub-header/SubHeader';
import { useStudioHome } from '../../studio-home/hooks';
import { useCreateLibraryV2 } from './data/apiHooks';
import messages from './messages';

interface CreateLibraryFormValues {
  title: string;
  org: string;
  slug: string;
}

/**
 * The server answers 400 with a `slug` error when the org already has a library with that ID.
 * The form only submits slugs that pass the server's own slug format check, so a `slug` error
 * here always means the ID is taken.
 */
const isLibraryIdTaken = (error: unknown) => {
  const { response } = (error ?? {}) as { response?: { status?: number; data?: { slug?: unknown; }; }; };
  return response?.status === 400 && !!response.data?.slug;
};

const CreateLibrary = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const { noSpaceRule, specialCharsRule } = REGEX_RULES;
  const validSlugIdRegex = /^[a-zA-Z\d]+(?:[\w-]*[a-zA-Z\d]+)*$/;

  // The org + ID pair the server rejected as already taken. It stays invalid until either changes.
  const [takenLibraryKey, setTakenLibraryKey] = useState<{ org: string; slug: string } | null>(null);
  const formikRef = useRef<FormikProps<CreateLibraryFormValues>>(null);

  const {
    mutate,
    data,
    isLoading,
    isError,
    error,
  } = useCreateLibraryV2();

  const {
    data: allOrganizations,
    isLoading: isOrganizationListLoading,
  } = useOrganizationListData();

  const {
    studioHomeData: {
      allowedOrganizationsForLibraries,
      allowToCreateNewOrg,
    },
  } = useStudioHome();

  const organizations = (
    allowToCreateNewOrg
      ? allOrganizations
      : allowedOrganizationsForLibraries
  ) || [];

  const handleOnClickCancel = () => {
    navigate('/libraries');
  };

  useEffect(() => {
    // Re-validate against the current values, so a late response doesn't flag an ID the user has
    // already changed.
    if (takenLibraryKey) {
      formikRef.current?.validateForm();
    }
  }, [takenLibraryKey]);

  if (data) {
    navigate(`/library/${data.id}`);
  }

  return (
    <>
      <Header isHiddenMainMenu />
      <Container size="xl" className="p-4 mt-3">
        <SubHeader
          title={intl.formatMessage(messages.createLibrary)}
        />
        <Formik<CreateLibraryFormValues>
          innerRef={formikRef}
          initialValues={{
            title: '',
            org: '',
            slug: '',
          }}
          validationSchema={
            Yup.object().shape({
              title: Yup.string()
                .required(intl.formatMessage(messages.requiredFieldError)),
              org: Yup.string()
                .required(intl.formatMessage(messages.requiredFieldError))
                .matches(
                  specialCharsRule,
                  intl.formatMessage(messages.disallowedCharsError),
                )
                .matches(noSpaceRule, intl.formatMessage(messages.noSpaceError)),
              slug: Yup.string()
                .required(intl.formatMessage(messages.requiredFieldError))
                .matches(
                  validSlugIdRegex,
                  intl.formatMessage(messages.invalidSlugError),
                )
                .test(
                  'library-id-not-taken',
                  intl.formatMessage(messages.slugAlreadyExistsError),
                  (slug, context) => !(
                    takenLibraryKey
                    && takenLibraryKey.slug === slug
                    && takenLibraryKey.org === context.parent.org
                  ),
                ),
            })
          }
          onSubmit={(values) => mutate(values, {
            onError: (createError) => {
              if (isLibraryIdTaken(createError)) {
                setTakenLibraryKey({ org: values.org, slug: values.slug });
              }
            },
          })}
        >
          {(formikProps) => (
            <Form onSubmit={formikProps.handleSubmit}>
              <FormikControl
                name="title"
                label={<Form.Label>{intl.formatMessage(messages.titleLabel)}</Form.Label>}
                value={formikProps.values.title}
                placeholder={intl.formatMessage(messages.titlePlaceholder)}
                help={intl.formatMessage(messages.titleHelp)}
                className=""
                controlClasses="pb-2"
              />
              <Form.Group>
                <Form.Label>{intl.formatMessage(messages.orgLabel)}</Form.Label>
                <Form.Autosuggest
                  name="org"
                  isLoading={isOrganizationListLoading}
                  onChange={(event) => formikProps.setFieldValue(
                    'org',
                    allowToCreateNewOrg
                      ? (event.selectionId || event.userProvidedText)
                      : event.selectionId,
                  )}
                  placeholder={intl.formatMessage(messages.orgPlaceholder)}
                >
                  {organizations.map((org) => (
                    <Form.AutosuggestOption key={org} id={org}>{org}</Form.AutosuggestOption>
                  ))}
                </Form.Autosuggest>
                <FormikErrorFeedback name="org">
                  <Form.Text>{intl.formatMessage(messages.orgHelp)}</Form.Text>
                </FormikErrorFeedback>
              </Form.Group>
              <FormikControl
                name="slug"
                label={<Form.Label>{intl.formatMessage(messages.slugLabel)}</Form.Label>}
                value={formikProps.values.slug}
                placeholder={intl.formatMessage(messages.slugPlaceholder)}
                help={intl.formatMessage(messages.slugHelp)}
                className=""
                controlClasses="pb-2"
              />
              <ActionRow className="justify-content-start">
                <Button
                  variant="outline-primary"
                  onClick={handleOnClickCancel}
                >
                  {intl.formatMessage(messages.cancelCreateLibraryButton)}
                </Button>
                <StatefulButton
                  type="submit"
                  variant="primary"
                  className="action btn-primary"
                  state={isLoading ? 'disabled' : 'enabled'}
                  disabledStates={['disabled']}
                  labels={{
                    enabled: intl.formatMessage(messages.createLibraryButton),
                    disabled: intl.formatMessage(messages.createLibraryButtonPending),
                  }}
                />
              </ActionRow>
            </Form>
          )}
        </Formik>
        {isError && !isLibraryIdTaken(error) && (
          <Alert variant="danger" className="mt-3">
            {intl.formatMessage(messages.createLibraryError)}
          </Alert>
        )}
      </Container>
      <StudioFooterSlot />
    </>
  );
};

export default CreateLibrary;
