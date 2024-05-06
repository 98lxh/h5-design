import type { MaterialComponent } from "@h5-designer/material";

let currentComponent: null | MaterialComponent = null
let currentDropEventListener: null | ((evt:DragEvent) => void) = null

function onDragenter(evt: DragEvent) {
  evt.dataTransfer!.dropEffect = 'move';
}

function onDragover(evt: DragEvent) {
  evt.preventDefault();
}

function onDragleave(evt: DragEvent) {
  evt.dataTransfer!.dropEffect = 'none';
}

function generateDropEventListener(context: DesignerContext) {
  return function (evt: DragEvent) {
    if (!currentComponent || !context) {
      return;
    }

    context.setSimulatorBlocks([
      ...context.simulatorData.value.blocks,
      {
        top: evt.offsetY,
        left: evt.offsetX,
        key: currentComponent.key,
        focus: false,
        zIndex: 1
      }
    ])

    currentComponent = null;
  }
}

export function onDragstart(_: DragEvent, context?: DesignerContext, component?: MaterialComponent) {
  const simulator = context?.simulatorRef.value;

  if (!simulator || !component || !context) {
    return
  }

  simulator.addEventListener('dragenter', onDragenter);
  simulator.addEventListener('dragover', onDragover);
  simulator.addEventListener('dragleave', onDragleave);

  currentDropEventListener = generateDropEventListener(context);
  simulator.addEventListener('drop', currentDropEventListener);
  currentComponent = component;
}


export function onDragend(_: DragEvent, context?: DesignerContext) {
  const simulator = context?.simulatorRef.value;

  if (!simulator || !currentDropEventListener) {
    return
  }

  simulator.removeEventListener('dragenter', onDragenter);
  simulator.removeEventListener('dragover', onDragover);
  simulator.removeEventListener('dragleave', onDragleave);
  simulator.removeEventListener('drop', currentDropEventListener);
  currentDropEventListener = null;
}

