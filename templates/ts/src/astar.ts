// This implementation takes a start and end PathNode, as well as a grid of PathNodes that represent the map of the environment in which the pathfinding takes place.
// The start and end PathNodes represent the starting and ending points of the path, respectively.

import { Position } from "./types/Position";

// The aStar function implements the A* algorithm, which starts by adding the start PathNode to the openList.
// It then enters a loop that continues until the openList is empty. In each iteration of the loop, the algorithm selects the PathNode with the lowest f score from the openList,
// and checks if it is the end PathNode. If it is, it builds the path from the start PathNode to the end PathNode by following the parent pointers of each PathNode in the path, and returns

export type PathNode = {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent: PathNode | null;
  blocked: boolean;
};

export function initGrid(tiles: string[]): PathNode[][] {
  const grid: PathNode[][] = [];
  for (let x = 0; x < tiles.length; x++) {
    for (let y = 0; y < tiles[x].length; y++) {
      const position = { x: x, y: y };
      const parent = null;
      const isBlocked = tiles[x][y] === "x";
      grid[x][y] = createPathNode(position, parent, 0, 0, 0, isBlocked);
    }
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

const getDistance = (PathNodeA: PathNode, PathNodeB: PathNode): number => {
  const dx = Math.abs(PathNodeA.x - PathNodeB.x);
  const dy = Math.abs(PathNodeA.y - PathNodeB.y);
  return Math.sqrt(dx * dx + dy * dy);
};

const getNeighbors = (PathNode: PathNode, grid: PathNode[][]): PathNode[] => {
  const neighbors: PathNode[] = [];
  const { x, y } = PathNode;

  const left = x - 1;
  const right = x + 1;
  const up = y - 1;
  const down = y + 1;

  for (let i = left; i <= right; i++) {
    for (let j = up; j <= down; j++) {
      if (i >= 0 && j >= 0 && i < grid.length && j < grid[0].length) {
        if (i !== x || j !== y) {
          if (grid[i][j].blocked == false) {
            neighbors.push(grid[i][j]);
          }
        }
      }
    }
  }

  return neighbors;
};

export function aStar(
  start: Position,
  end: Position,
  grid: PathNode[][]
): PathNode[] | null {
  const openList: PathNode[] = [createPathNode(start, null)];
  const closedList: PathNode[] = [];

  while (openList.length > 0) {
    let currentPathNode: PathNode | undefined = openList[0];

    for (let i = 1; i < openList.length; i++) {
      if (openList[i].f < currentPathNode.f) {
        currentPathNode = openList[i];
      }
    }

    if (!currentPathNode) {
      return null;
    }

    if (currentPathNode === end) {
      const path: PathNode[] = [];
      let current: PathNode | null = currentPathNode;

      while (current) {
        path.push(current);
        current = current.parent;
      }

      return path.reverse();
    }

    openList.splice(openList.indexOf(currentPathNode), 1);
    closedList.push(currentPathNode);

    const neighbors: PathNode[] = getNeighbors(currentPathNode, grid);

    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];

      if (closedList.includes(neighbor)) {
        continue;
      }

      const tentativeGScore =
        currentPathNode.g + getDistance(currentPathNode, neighbor);

      if (!openList.includes(neighbor)) {
        openList.push(neighbor);
      } else if (tentativeGScore >= neighbor.g) {
        continue;
      }

      neighbor.parent = currentPathNode;
      neighbor.g = tentativeGScore;
      neighbor.h = getDistance(neighbor, createPathNode(end, null));
      neighbor.f = neighbor.g + neighbor.h;
    }
  }

  return null;
}
