import { useContext } from 'react';
import {
  closestCorners,
  type Active,
  type DndContextProps,
  type DroppableContainer,
  type Over,
} from '@dnd-kit/core';
import { COURSE_BLOCK_NAMES } from '@src/constants';
import { XBlock } from '@src/data/types';
import { act, initializeMocks, render, screen } from '@src/testUtils';
import { DragContext } from './DragContextProvider';
import DraggableList from './DraggableList';

let mockDndContextProps: DndContextProps;

jest.mock('@dnd-kit/core', () => ({
  ...jest.requireActual('@dnd-kit/core'),
  // jsdom has no layout, so the collision filter is checked through the containers it hands to closestCorners.
  closestCorners: jest.fn(() => []),
  DndContext: (props: DndContextProps) => {
    mockDndContextProps = props;
    return <>{props.children}</>;
  },
}));

const sections = [{
  id: 'section',
  category: COURSE_BLOCK_NAMES.chapter.id,
  actions: { childAddable: true },
  childInfo: {
    children: [
      {
        id: 'subsection',
        category: COURSE_BLOCK_NAMES.sequential.id,
        actions: { childAddable: true },
        childInfo: { children: [{ id: 'unit', category: COURSE_BLOCK_NAMES.vertical.id }] },
      },
      {
        id: 'other-subsection',
        category: COURSE_BLOCK_NAMES.sequential.id,
        actions: { childAddable: true },
        childInfo: { children: [] },
      },
    ],
  },
}] as unknown as XBlock[];

const container = (id: string, category: string): DroppableContainer => ({
  id,
  key: id,
  disabled: false,
  data: { current: { category, childAddable: true } },
  node: { current: null },
  rect: { current: null },
});

const activeUnit = (data: Record<string, unknown>): Active => ({
  id: 'unit',
  data: { current: data },
  rect: { current: { initial: null, translated: null } },
});

const emptyRect = { width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 };

const OverId = () => <span data-testid="over-id">{useContext(DragContext).overId}</span>;

const restoreSectionList = jest.fn();
const handleUnitDragAndDrop = jest.fn();

const renderComponent = () =>
  render(
    <DraggableList
      items={sections}
      // Run the updaters: the drop handlers are called from inside them.
      setSections={(update) => (typeof update === 'function' ? update([...sections]) : update)}
      restoreSectionList={restoreSectionList}
      handleSectionDragAndDrop={jest.fn()}
      handleSubsectionDragAndDrop={jest.fn()}
      handleUnitDragAndDrop={handleUnitDragAndDrop}
    >
      <OverId />
    </DraggableList>,
  );

const dragEvent = (target: Over | null) => ({
  active: activeUnit({ category: COURSE_BLOCK_NAMES.vertical.id }),
  over: target,
  activatorEvent: new Event('pointerdown'),
  collisions: null,
  delta: { x: 0, y: 0 },
});

const over = (id: string, category: string): Over => ({
  id,
  rect: emptyRect,
  disabled: false,
  data: { current: { category } },
});

const dragUnitOverOtherSubsection = () => {
  act(() => {
    mockDndContextProps.onDragOver?.(dragEvent(over('other-subsection', COURSE_BLOCK_NAMES.sequential.id)));
  });
};

describe('<DraggableList />', () => {
  beforeEach(() => {
    initializeMocks();
  });

  it('does not offer sections to a dragged unit once its card unmounts', () => {
    renderComponent();
    const section = container('section', COURSE_BLOCK_NAMES.chapter.id);
    const subsection = container('other-subsection', COURSE_BLOCK_NAMES.sequential.id);
    const unit = container('other-unit', COURSE_BLOCK_NAMES.vertical.id);

    // dnd-kit passes empty data when the dragged unit has moved into a collapsed subsection.
    mockDndContextProps.collisionDetection?.({
      active: activeUnit({}),
      collisionRect: emptyRect,
      droppableRects: new Map(),
      droppableContainers: [section, subsection, unit],
      pointerCoordinates: null,
    });

    expect(closestCorners).toHaveBeenLastCalledWith(
      expect.objectContaining({ droppableContainers: [subsection, unit] }),
    );
  });

  it('clears the drop target and restores the outline when a drag is cancelled', () => {
    renderComponent();
    dragUnitOverOtherSubsection();
    expect(screen.getByTestId('over-id')).toHaveTextContent('other-subsection');

    act(() => {
      mockDndContextProps.onDragCancel?.(dragEvent(null));
    });

    expect(screen.getByTestId('over-id')).toBeEmptyDOMElement();
    expect(restoreSectionList).toHaveBeenCalledTimes(1);
  });

  it('forgets the original parent of a cancelled drag', () => {
    renderComponent();
    dragUnitOverOtherSubsection();
    act(() => {
      mockDndContextProps.onDragCancel?.(dragEvent(null));
    });

    // Dropped back on itself: nothing to save unless a stale parent from the cancelled drag is left over.
    act(() => {
      mockDndContextProps.onDragEnd?.(dragEvent(over('unit', COURSE_BLOCK_NAMES.vertical.id)));
    });

    expect(handleUnitDragAndDrop).not.toHaveBeenCalled();
  });

  it('clears the drop target when a drag ends outside any target', () => {
    renderComponent();
    dragUnitOverOtherSubsection();

    act(() => {
      mockDndContextProps.onDragEnd?.(dragEvent(null));
    });

    expect(screen.getByTestId('over-id')).toBeEmptyDOMElement();
  });
});
