import { Fragment, Slice } from '@tiptap/pm/model'
import { Selection } from '@tiptap/pm/state'
import { ReplaceStep } from '@tiptap/pm/transform'

export function GetTopLevelBlockCoords(view) {
  const $pos = view.state.selection.$from
  let from = $pos.before(1)

  let coords = view.coordsAtPos(from)

  return new DOMRect(
    coords.left,
    coords.top,
    coords.right - coords.left,
    coords.bottom - coords.top,
  )
}

export function GetTableRowCoords(view) {
  const pos = view.state.selection.$from
  let depth = pos.depth
  while (depth > 1) {
    if (pos.node(depth).type.name === 'tableRow') break
    depth--
  }
  let from = pos.before(depth)
  let rect = view.nodeDOM(from).getBoundingClientRect()
  return new DOMRect(rect.x, rect.y, rect.width, rect.height)
}

export function GetTableColumnCoords(view) {
  const pos = view.state.selection.$from
  let depth = pos.depth
  let cellDepth = 0
  let tableDepth = 0
  while (depth > 0) {
    if (
      pos.node(depth).type.name == 'tableCell'
      || pos.node(depth).type.name == 'tableHeader'
    ) {
      cellDepth = depth
    }
    if (pos.node(depth).type.name === 'table') {
      tableDepth = depth
      break
    }
    depth--
  }
  if (!(tableDepth && cellDepth)) {
    return false
  }
  let cellRect = view.nodeDOM(pos.before(cellDepth)).getBoundingClientRect()
  let tableRect = view.nodeDOM(pos.before(tableDepth)).getBoundingClientRect()

  return new DOMRect(cellRect.x, tableRect.y, cellRect.width, tableRect.height)
}

export function GetTopLevelNode(view) {
  const selectionStart = view.state.selection.$from
  if (selectionStart.node(1) == null && view.lastSelectedViewDesc) {
    return view.lastSelectedViewDesc.node
  }
  return selectionStart.node(1)
}

export function GetNodeTree(view) {
  let nodes = []
  let selectionStart = view.state.selection.$from

  if (selectionStart.node(1) == null && view.lastSelectedViewDesc) {
    return [view.lastSelectedViewDesc.node.type.name]
  }

  let depth = selectionStart.depth
  while (depth >= 0) {
    nodes.push(selectionStart.node(depth).type.name)
    depth--
  }
  return nodes.reverse()
}

function mapChildren(node:, callback) {
  const array = []
  for (let i = 0; i < node.childCount; i++) {
    array.push(
      callback(node.child(i), i, node instanceof Fragment ? node : node.content),
    )
  }
  return array
}

export function DragNode({
  view,
  state,
  draggedNodePosition,
  targetNodePosition,
}) {
  let targetResolved = state.doc.resolve(targetNodePosition)
  let draggedNode = state.doc.resolve(draggedNodePosition).node(1)
  let targetNode = targetResolved.node(1) ?? targetResolved.nodeAfter

  // Get document; children; start and end – always the same!
  const parent = targetResolved.node(0)
  const parentPos = targetResolved.start(0)
  let tr = view.state.tr
  const arr = mapChildren(parent, node => node)
  let replaceStart = parentPos
  let replaceEnd = targetResolved.end(0)

  let fromIndex = arr.indexOf(draggedNode)
  let targetIndex = arr.indexOf(targetNode)

  // Index is different when target is after dragged node
  if (targetIndex > fromIndex) {
    --targetIndex
  }
  let arrItem = arr[fromIndex]

  arr.splice(fromIndex, 1)
  arr.splice(targetIndex, 0, arrItem)

  const slice = new Slice(Fragment.fromArray(arr), 0, 0)
  tr.step(new ReplaceStep(replaceStart, replaceEnd, slice, false))
  tr.setSelection(Selection.near(tr.doc.resolve(targetNodePosition)))
  view.dispatch(tr)
}

export function MoveNode({ view, dir, currentResolved }) {
  if (!currentResolved) {
    return false
  }
  let tr = view.state.tr
  const isDown = dir === 'DOWN'
  const currentNode = currentResolved.node(1) || currentResolved.nodeAfter
  const parentDepth = 0
  const parent = currentResolved.node(parentDepth)
  const parentPos = currentResolved.start(parentDepth)

  const arr = mapChildren(parent, node => node)
  let index = arr.indexOf(currentNode)

  if (index == -1) {
    return false
  }

  let swapWithIndex = isDown ? index + 1 : index - 1

  // If swap is out of bound
  if (swapWithIndex >= arr.length || swapWithIndex < 0) {
    return false
  }

  const swapWithNodeSize = arr[swapWithIndex].nodeSize;
  [arr[index], arr[swapWithIndex]] = [arr[swapWithIndex], arr[index]]

  let replaceStart = parentPos
  let replaceEnd = currentResolved.end(parentDepth)

  const slice = new Slice(Fragment.fromArray(arr), 0, 0)
  tr.step(new ReplaceStep(replaceStart, replaceEnd, slice, false))

  tr.setSelection(
    Selection.near(
      tr.doc.resolve(
        isDown
          ? currentResolved.pos + swapWithNodeSize
          : currentResolved.pos - swapWithNodeSize,
      ),
    ),
  )

  view.dispatch(tr)
}
