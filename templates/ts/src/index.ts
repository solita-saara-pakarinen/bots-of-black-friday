//import { start } from "repl";
import { move, register, getMap, getGameState } from "./api";
import { GameMap } from "./types/GameMap";
import { Item } from "./types/Item";
import { Move } from "./types/Move";
import { Player } from "./types/Player";
import { Position } from "./types/Position";
import _ from "lodash";
import { aStar, PathNode } from "./astar";
import { getRandomValues } from "crypto";
import { getNextMove } from "./types/Helpers";
import { GameState } from "./types/GameState";
import { aStar2, initGrid } from "./aStar2";

const playerName = "tapirbot";

const exit: Item = {
  price: 0,
  discountPercent: 0,
  position: { x: 9, y: 4 },
  type: "JUST_SOME_JUNK",
  isUsable: true,
};

async function awaitGameState() {
  const state = await getGameState();
  return state;
}

async function awaitGameMap() {
  const map = await getMap();
  return map;
}

function positionInItems(x: number, y: number, items: Item[]) {
  const found = items.filter(
    (item) => item.position.x === x && item.position.y === y
  );
  //console.log('found',found)
  return found.length > 0 ? true : false;
}

function getTileSymbol(x: number, y: number, map: GameMap) {
  const symbol = map.tiles && map.tiles[y][x];
  return symbol;
}

function getPlayerInfo(players: Player[], playerName: string): Player {
  const allMatchingPlayers = players.filter((player) => {
    player.name === playerName;
  });
  return allMatchingPlayers[0];
}

function getMapTiles(gameMap: GameMap) {
  return gameMap.tiles;
}

function getData(gameState: GameState) {
  const items = gameState.items;
  const players = gameState.players;
  return { items, players };
}

function a(
  gameState: GameState,
  targetPosition: Position,
  gameMapTiles: PathNode[][]
) {
  const items = gameState.items;
  const players = gameState.players;
  const player: Player = players && getPlayerInfo(players, playerName);
  const currentPos: Position = player && player.position;
  const itemsSortedByPrice = _.orderBy(items, ["price"], "desc");

  const mostExpensiveItemPosition = items && itemsSortedByPrice[0].position;

  const x = players[0].position.x;
  const y = players[0].position.y;
  //y,x

  // if target has changed then recalculate
  // TEST values
  //item position: { x: 89, y: 13 }
  //player position: { x: 21, y: 12 }

  const path = aStar2(players[0].position, targetPosition, gameMapTiles);

  //console.log("path:", path);

  return path;
}

function targetChanged(current: Position, end: Position) {
  return current.x - end.x === 0 && current.y - end.y === 0;
}

export const main = async (gameMapTiles: PathNode[][]) => {
  // Look in the api.ts file for api calls
  // First you need to register your bot to the game server.
  // When registering, you will receive an id for your bot.
  // This will be used to control your bot.

  // You need to wait one second between each action.

  // Below is example code for a bot that after
  // being registered moves randomly to left and right.
  // You can use this code as a starting point for your own implementation.

  const startingInformation = await register(playerName);

  let target: Position = { x: 89, y: 13 };
  let previousTargetPos: Position = { x: 0, y: 0 };
  let path: PathNode[] | null = null;
  let playerPosition: Position | null = null;

  setInterval(() => {
    const statePromise = awaitGameState();
    Promise.resolve(statePromise).then((state) => {
      // handle highest item change
      playerPosition = state.players[0].position
      target = exit.position; // TODO get highest price

      if (targetChanged(target, previousTargetPos)) {
        path = a(state, target, gameMapTiles);
        path?.map(p => console.log('p (x/y):',p.x,'/',p.y))
      }
      //console.log("player position:",state.players[0].position)
      previousTargetPos = target;
    });

    if (path && path.length > 0) {
      // TODO !!!!!!!!!! here is a bug
      const nextMove =
        path && playerPosition &&
        getNextMove(playerPosition, { x: path[0].x, y: path[0].y });
      path && path.shift();

      if (nextMove) {
        move(startingInformation.id, nextMove);
      }
      else {

        console.log('player position', playerPosition )
          const moves: Move[] = ["LEFT", "RIGHT"];
          move(
            startingInformation.id,
            moves[Math.floor(Math.random() * moves.length)]
            //"UP"
          );
        }
    } else {

    console.log('player position', playerPosition )
      const moves: Move[] = ["LEFT", "RIGHT"];
      move(
        startingInformation.id,
        moves[Math.floor(Math.random() * moves.length)]
        //"UP"
      );
    }

    
  }, 1000);
};

if (require.main === module) {
  const mapPromise = awaitGameMap();
  Promise.resolve(mapPromise).then((map) => {
    const gameMapTiles: PathNode[][] = initGrid(getMapTiles(map));

    main(gameMapTiles);
  });
}
