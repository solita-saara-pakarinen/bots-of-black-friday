import _ from "lodash";
import { PathNode } from "./astar";
import { Position } from "./types/Position";

export function initGrid(tiles: string[]): PathNode[][] {
  const grid: PathNode[][] = [];
  let nodes: PathNode[] = [];
  for (let y = 0; y < tiles.length - 1; y++) {
    nodes = [];
    for (let x = 0; x < tiles[y].length - 1; x++) {
      const position = { x: x, y: y };
      const parent = null;
      const isBlocked = tiles[y][x] === "x";
      nodes.push(createPathNode(position, parent, 0, 0, 0, isBlocked));
    }
    grid.push(nodes);
  }
  return grid;
}

function createPathNode(
  position: Position,
  parent: PathNode | null,
  g = 0,
  h = 0,
  f = 0,
  blocked = false
) {
  return {
    x: position.x,
    y: position.y,
    g: g,
    h: h,
    f: f,
    parent: parent,
    blocked: blocked,
  };
}

function createPath(currentPathNode: PathNode) {
  const path: PathNode[] = [];
  let current: PathNode | null = currentPathNode;

  while (current) {
    path.push(current);
    current = current.parent;
  }
  return path.reverse();
}

const getDistance = (PathNodeA: PathNode, PathNodeB: PathNode): number => {
  const dx = Math.abs(PathNodeA.x - PathNodeB.x);
  const dy = Math.abs(PathNodeA.y - PathNodeB.y);
  return Math.sqrt(dx * dx + dy * dy);
};

function getNodePosition(node: PathNode): Position {
  return { x: node.x, y: node.y };
}

function getNeighbours(currentPathNode: PathNode, grid: PathNode[][]) {
  const neighbours: PathNode[] = [];
  const { x, y } = currentPathNode;

  if (grid) {
    // TODO, check grid out of bounds

    // left { x: prevX-1, y: y }
    const left = grid[y][x - 1];
    // right { x: prevX+1, y: y }
    const right = grid[y][x + 1];
    // up { x: x, y: y-1 }
    const up = grid[y - 1][x];
    // down { x: x, y: y+1 }
    const down = grid[y + 1][x];

    // check from grid if the neighbour is blocked
    if (left.blocked == false) neighbours.push(left);
    if (right.blocked == false) neighbours.push(right);
    if (up.blocked == false) neighbours.push(up);
    if (down.blocked == false) neighbours.push(down);

    //console.log('neighbours',neighbours.length)}

    return neighbours;
  } else return [];
}

function reachedTarget(current: Position, end: Position) {
  return current.x - end.x === 0 && current.y - end.y === 0;
}

export function aStar2(
  start: Position,
  end: Position,
  grid: PathNode[][]
): PathNode[] | null {
  let openList: PathNode[] = [];
  const closedList: PathNode[] = [];
  const endNode = createPathNode(end, null);
  openList.push(createPathNode(start, null));

  let num = 0;

  while (openList.length > 0) {
    //while(num < 3){

    //  currentNode = find lowest f in openList
    const sorted = _.orderBy(openList, "f");
    openList = sorted;
    //openList.map(n => console.log('f:',n.f,'h:',n.h))
    const currentPathNode: PathNode | undefined = openList[0];
    if (!currentPathNode) return null;

    // if we hit the target create and return path
    if (reachedTarget(getNodePosition(currentPathNode), end)) {
      return createPath(currentPathNode);
    }

    // Normal case -- move currentNode from open to closed, process each of its neighbors

    // push the visited current Node to closed list
    closedList.push(currentPathNode);
    // remove first (the current node with lowest f-score)
    openList.shift();

    // get neighbours, count their scores, put currentPathNode as parent and push to open list

    // get all neighbours not in closed list
    const neighbours = getNeighbours(currentPathNode, grid).filter(
      (neighbour) => !closedList.includes(neighbour)
    );

    //neighbours.map(n => console.log('n:',n.y,':',n.x))

    // g-score = steps so far
    const gScore = currentPathNode.g + 1;

    // case A
    // if neighbour is not in open list => save scores and parent
    // add neighbour to open list
    const neighboursNotInOpenList = neighbours.filter(
      (neighbour) => !openList.includes(neighbour)
    );

    //console.log('neihgbours not in open list', neighboursNotInOpenList.length)

    neighboursNotInOpenList.map((neighbour) => {
      const h = getDistance(neighbour, endNode);
      //console.log(neighbour.x,':',neighbour.y, ' neighbour distance:', h)
      const fScore = gScore + h;
      neighbour.f = fScore;
      neighbour.h = h;
      neighbour.g = gScore;
      neighbour.parent = currentPathNode;
      //console.log('neighbour info: h:',neighbour.h, ' ,g:',neighbour.g)
      openList.push(neighbour);
    });

    // console.log('open list after pushing neighbours:')
    // openList.map(n => console.log('neighbour info: x/y:', n.x,'/',n.y ,' ,h:',n.h, ' ,g:',n.g))
    // case B
    // if neighbour already in open list but current g is better than existing g
    // update neighbour g, f and parent

    //   const neighboursInOpenList = neighbours.filter((neighbour) =>
    //     openList.includes(neighbour)
    //   );
    //   openList.map((node) => {
    //     if (neighboursInOpenList.includes(node)) {
    //       const h = getDistance(neighbour,  endNode);
    //       const fScore = gScore + h;
    //       node.h = h;
    //       node.f = fScore;
    //       node.g = gScore;
    //       node.parent = currentPathNode;
    //     }
    //   });

    num++;
  } // end while
  //} // end while

  return null;
}
