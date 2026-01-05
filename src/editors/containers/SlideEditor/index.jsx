import {
  useRef, useEffect, useMemo, useCallback, useReducer,
} from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Row, Col, Stack, IconButtonWithTooltip, Form, Button,
  IconButton, Dropdown, Spinner, ModalDialog, ActionRow, useToggle,
} from '@openedx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Delete as IconDelete,
  TextFields as IconTextFields,
  DrawShapes as IconDrawShapes,
  Rotate90DegreesCw as IconRotate90DegreesCw,
  LibraryAdd as IconLibraryAdd,
} from '@openedx/paragon/icons';
import {
  AssetsListProvider,
  AssetsList,
  ModalWrapper,
} from '@jigsaw-plugins/frontend-app-assets-library';

import { actions, selectors } from '../../data/redux';
import EditorContainer from '../EditorContainer';
import { RequestKeys } from '../../data/constants/requests';
import useSlideBlocksManager from './hooks/useSlideBlocksManager';
import useBlockTransformManager from './hooks/useBlockTransformManager';
import {
  COLOR_MAP,
  DEFAULT_SHAPE_FILL_COLOR,
  SHAPE_SUBTYPES,
  EDITOR_BLOCK_TYPES,
  RESIZE_HANDLES,
  MENUS,
} from './constants';
import { getColorOptions } from './utils';
import { AssetBlock, TextBlock, ShapeBlock } from './blocks';
import messages from './messages';

import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/textcolor';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/content/default/content.min.css';

import './index.scss';

const colorOptions = getColorOptions(COLOR_MAP);

function menusReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_TEXT':
      return state.open === MENUS.TEXT ? { open: MENUS.NONE } : { open: MENUS.TEXT };

    case 'TOGGLE_SHAPE':
      return state.open === MENUS.SHAPE ? { open: MENUS.NONE } : { open: MENUS.SHAPE };

    case 'OPEN_TEXT':
      return { open: MENUS.TEXT };

    case 'OPEN_SHAPE':
      return { open: MENUS.SHAPE };

    case 'CLOSE_ALL':
      return { open: MENUS.NONE };

    default:
      return state;
  }
}

const SlideEditor = ({
  onClose,
  returnFunction,
  // redux
  blockValue,
  blockFinished,
  // inject
  intl,
}) => {
  const slideRef = useRef(null);
  const initialBlocks = useMemo(
    () => blockValue?.data?.metadata?.blocks || [],
    [blockValue],
  );
  const placeholder = intl.formatMessage(messages.textPlaceholder);
  const [isOpenAssetModal, openAssetModal, closeAssetModal] = useToggle(false);

  const [{ open: openMenu }, menuDispatch] = useReducer(menusReducer, { open: MENUS.NONE });

  const isTextMenuOpen = openMenu === MENUS.TEXT;
  const isShapeMenuOpen = openMenu === MENUS.SHAPE;

  const {
    blocks,
    activeBlock,
    activeBlockId,
    isEditing,
    setActiveBlockId,
    setIsEditing,
    addBlock,
    deleteActive,
    updateBlock,
    copyPasteHandler,
    handleAssetInsert,
  } = useSlideBlocksManager({ initialBlocks, placeholder, closeAssetModal });

  useEffect(() => {
    if (slideRef.current && !isEditing && activeBlockId) {
      slideRef.current.focus({ preventScroll: true });
    }
  }, [activeBlockId, isEditing]);

  useEffect(() => {
    if (!activeBlock) {
      menuDispatch({ type: 'CLOSE_ALL' });
      return;
    }

    if (activeBlock.type === EDITOR_BLOCK_TYPES.TEXT_BLOCK) {
      menuDispatch({ type: 'OPEN_TEXT' });
      return;
    }

    if (activeBlock.type === EDITOR_BLOCK_TYPES.SHAPE_BLOCK) {
      menuDispatch({ type: 'OPEN_SHAPE' });
      return;
    }

    menuDispatch({ type: 'CLOSE_ALL' });
  }, [activeBlock, menuDispatch]);

  const {
    handleDragStart,
    handleResizeStart,
    handleTailMouseDown,
    handleMouseMove,
    endInteraction,
    handleRotationChange,
  } = useBlockTransformManager({ slideRef, updateBlock, activeBlockId });

  const toolbarDisabled = !activeBlock;
  const getContent = useCallback(() => ({ blocks }), [blocks]);

  const handleShapeColorChange = useCallback((color) => {
    if (!activeBlockId) {
      return;
    }
    updateBlock(activeBlockId, { fill: color });
  }, [activeBlockId, updateBlock]);

  const toggleTextMenu = useCallback(() => {
    menuDispatch({ type: 'TOGGLE_TEXT' });
  }, [menuDispatch]);

  const toggleShapeMenu = useCallback(() => {
    menuDispatch({ type: 'TOGGLE_SHAPE' });
  }, [menuDispatch]);

  const handleOpenAssetModal = useCallback(() => {
    menuDispatch({ type: 'CLOSE_ALL' });
    openAssetModal();
  }, [openAssetModal]);

  const footerActions = (
    <ActionRow>
      <ModalDialog.CloseButton variant="tertiary">
        {messages.assetLibraryModalCloseBtn.defaultMessage}
      </ModalDialog.CloseButton>
    </ActionRow>
  );

  return (
    <>
      <ModalWrapper
        isOpen={isOpenAssetModal}
        close={closeAssetModal}
        title={messages.assetLibraryModalTitle.defaultMessage}
        description={messages.assetLibraryModalDescription.defaultMessage}
        footerActions={footerActions}
        size="xl"
      >
        <AssetsListProvider>
          <AssetsList isSlideEditor onInsertAsset={handleAssetInsert} />
        </AssetsListProvider>
      </ModalWrapper>

      <EditorContainer
        getContent={getContent}
        onClose={onClose}
        returnFunction={returnFunction}
        isDirty={/* istanbul ignore next */ () => true}
        size="fullscreen"
        className="slide-editor"
      >
        <div className="d-flex flex-row flex-nowrap">
          {!blockFinished ? (
            <div className="text-center p-6">
              <Spinner
                animation="border"
                className="m-3"
                screenreadertext={intl.formatMessage(messages.loading)}
              />
            </div>
          ) : (
            <div className="slide-editor-wrapper w-100 p-0">
              <Row>
                <Col xs={8} className="px-0">
                  <div className="tools-row d-flex justify-content-start">
                    <Stack direction="horizontal" gap={1} className="tools-row-buttons">
                      <IconButton
                        src={IconTextFields}
                        size="sm"
                        onClick={toggleTextMenu}
                        isActive={isTextMenuOpen}
                        aria-pressed={isTextMenuOpen}
                      />
                      <IconButton
                        src={IconDrawShapes}
                        size="sm"
                        onClick={toggleShapeMenu}
                        isActive={isShapeMenuOpen}
                        aria-pressed={isShapeMenuOpen}
                      />
                      <IconButtonWithTooltip
                        src={IconLibraryAdd}
                        size="sm"
                        onClick={handleOpenAssetModal}
                        tooltipContent={<div>{intl.formatMessage(messages.assetLibraryAddBtn)}</div>}
                      >
                        {messages.buttonAddAsset.defaultMessage}
                      </IconButtonWithTooltip>
                    </Stack>

                    <Stack direction="horizontal" gap={2} className="tools-row-actions">
                      {isTextMenuOpen && (
                        <Dropdown align="end">
                          <Dropdown.Toggle as={Button} variant="tertiary" size="sm">
                            {intl.formatMessage(messages.buttonAddText)}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => addBlock(EDITOR_BLOCK_TYPES.TEXT_BLOCK, 'textTitle')}>
                              {intl.formatMessage(messages.typeTextTitle)}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => addBlock(EDITOR_BLOCK_TYPES.TEXT_BLOCK, 'textHeading')}>
                              {intl.formatMessage(messages.typeTextHeading)}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => addBlock(EDITOR_BLOCK_TYPES.TEXT_BLOCK, 'textNormal')}>
                              {intl.formatMessage(messages.typeTextNormal)}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}

                      {isShapeMenuOpen && (
                        <Dropdown align="end">
                          <Dropdown.Toggle as={Button} variant="tertiary" size="sm">
                            {intl.formatMessage(messages.buttonAddShape)}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => addBlock(EDITOR_BLOCK_TYPES.SHAPE_BLOCK, SHAPE_SUBTYPES.SOFT_SQUARE)}
                            >
                              {intl.formatMessage(messages.softSquare)}
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => addBlock(EDITOR_BLOCK_TYPES.SHAPE_BLOCK, SHAPE_SUBTYPES.SOFT_RECTANGLE)}
                            >
                              {intl.formatMessage(messages.softRectangle)}
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => addBlock(EDITOR_BLOCK_TYPES.SHAPE_BLOCK, SHAPE_SUBTYPES.ELLIPSE)}
                            >
                              {intl.formatMessage(messages.ellipse)}
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => addBlock(EDITOR_BLOCK_TYPES.SHAPE_BLOCK, SHAPE_SUBTYPES.SPEECH_BUBBLE)}
                            >
                              {intl.formatMessage(messages.speechBubble)}
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => addBlock(EDITOR_BLOCK_TYPES.SHAPE_BLOCK, SHAPE_SUBTYPES.THOUGHT_BUBBLE)}
                            >
                              {intl.formatMessage(messages.thoughtBubble)}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}

                      {activeBlock && (
                        <>
                          <Dropdown align="end" className="rotation-dropdown">
                            <Dropdown.Toggle
                              className="dropdown-rotate-tool"
                              as={Button}
                              iconAfter={IconRotate90DegreesCw}
                              variant="tertiary"
                              size="sm"
                            >
                              {intl.formatMessage(messages.buttonRotateActiveBlock)}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <div className="toolbar d-flex align-items-center">
                                <div className="rotation-control d-flex align-items-center">
                                  <span>{intl.formatMessage(messages.rotate)}</span>
                                  <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={activeBlock ? activeBlock.rotation : 0}
                                    disabled={toolbarDisabled}
                                    onChange={handleRotationChange}
                                  />
                                  <span className="rotation-value text-right">
                                    {activeBlock ? `${activeBlock.rotation}°` : '0°'}
                                  </span>
                                </div>
                              </div>
                            </Dropdown.Menu>
                          </Dropdown>
                          <Button
                            variant="tertiary"
                            iconAfter={IconDelete}
                            onClick={deleteActive}
                            disabled={toolbarDisabled}
                            size="sm"
                          >
                            {intl.formatMessage(messages.buttonDeleteActiveBlock)}
                          </Button>
                        </>
                      )}

                      {activeBlock && activeBlock.type === EDITOR_BLOCK_TYPES.SHAPE_BLOCK && (
                        <div className="shape-color-control d-flex align-items-center ml-3 mr-1">
                          <span className="shape-color-title mr-2 text-nowrap">
                            {intl.formatMessage(messages.shapeColor)}
                          </span>
                          <Dropdown>
                            <Dropdown.Toggle variant="tertiary" size="sm" disabled={toolbarDisabled}>
                              <div
                                className="color-swatch"
                                style={{
                                  backgroundColor: activeBlock.fill || DEFAULT_SHAPE_FILL_COLOR,
                                }}
                              />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {colorOptions.map((option) => (
                                <Dropdown.Item
                                  key={option.value}
                                  onClick={() => handleShapeColorChange(option.value)}
                                >
                                  <div className="d-flex align-items-center">
                                    <div
                                      className="color-swatch in-dropdown"
                                      style={{
                                        backgroundColor: option.value,
                                      }}
                                    />
                                    {intl.formatMessage(option.label)}
                                  </div>
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      )}

                      <div id="editor-toolbar-container" />
                    </Stack>
                  </div>
                  <div className="slide-wrapper d-flex flex-column">
                    {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                    <div
                      className="slide position-relative"
                      ref={slideRef}
                      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                      tabIndex={0}
                      onKeyDown={copyPasteHandler}
                      onMouseMove={handleMouseMove}
                      onMouseUp={endInteraction}
                      onMouseLeave={endInteraction}
                    >
                      {blocks.map((block) => (
                        <div
                          key={block.id}
                          className={classNames('text-block-wrapper', 'position-absolute', {
                            active: block.id === activeBlockId,
                          })}
                          style={{
                            left: block.left,
                            top: block.top,
                            width: block.width,
                            height: block.height,
                            minWidth: block.minWidth,
                            minHeight: block.minHeight,
                            transform: `rotate(${block.rotation}deg)`,
                          }}
                          onClick={() => setActiveBlockId(block.id)}
                        >
                          {!isEditing && (
                            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                            <div
                              className="drag-handle overlay"
                              onMouseDown={(e) => handleDragStart(e, block)}
                            >
                              ⠿
                            </div>
                          )}

                          {block.type === EDITOR_BLOCK_TYPES.TEXT_BLOCK && (
                            <TextBlock
                              isEditing={isEditing}
                              block={block}
                              updateBlock={updateBlock}
                              setActiveBlockId={setActiveBlockId}
                              setIsEditing={setIsEditing}
                            />
                          )}

                          {block.type === EDITOR_BLOCK_TYPES.SHAPE_BLOCK && (
                            <ShapeBlock
                              block={block}
                              activeBlockId={activeBlockId}
                              handleTailMouseDown={handleTailMouseDown}
                            />
                          )}

                          {block.type === EDITOR_BLOCK_TYPES.ASSET_BLOCK && (
                            <AssetBlock block={block} />
                          )}

                          {!isEditing && block.id === activeBlockId && (
                            <>
                              {RESIZE_HANDLES.map(({ cls, dir }) => (
                                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                                <div
                                  key={dir}
                                  className={classNames('resize-handle', cls, 'position-absolute')}
                                  onMouseDown={(e) => handleResizeStart(e, block, dir)}
                                />
                              ))}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Col>
                <Col xs={4} className="px-0">
                  <div className="slide-notes h-100">
                    <div className="slide-notes-top" />
                    <div className="slide-notes-text h-100">
                      <Form.Control
                        as="textarea"
                        floatingLabel="Enter teacher’s notes..."
                        className="slide-notes-textarea h-100 m-0"
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </EditorContainer>
    </>
  );
};

SlideEditor.defaultProps = {
  blockValue: null,
  returnFunction: null,
};

SlideEditor.propTypes = {
  onClose: PropTypes.func.isRequired,
  returnFunction: PropTypes.func,
  // redux
  blockValue: PropTypes.shape({
    data: PropTypes.shape({
      metadata: PropTypes.shape({}),
    }),
  }),
  blockFinished: PropTypes.bool.isRequired,
  // inject
  intl: intlShape.isRequired,
};

export const mapStateToProps = (state) => ({
  blockValue: selectors.app.blockValue(state),
  blockFinished: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchBlock }),
});

export const mapDispatchToProps = {
  initializeEditor: actions.app.initializeEditor,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SlideEditor));
