//import { start } from "repl";
import { move, register, getMap, getGameState } from "./api";
import { GameMap } from "./types/GameMap";
import { Item } from "./types/Item";
import { Move } from "./types/Move";
import { Player } from "./types/Player";
import { Position } from "./types/Position";
import _ from "lodash";
import { aStar, initGrid, PathNode } from "./astar";


const exit: Item = {
  price: 0,
  discountPercent: 0,
  position: { x: 9, y: 4 },
  type: "JUST_SOME_JUNK",
  isUsable: true,
};

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

function getPlayerInfo(players: Player[], playerName: string): Player{
  const allMatchingPlayers = players.filter(player => {player.name === playerName})
  return allMatchingPlayers[0];
}

export const main = async () => {
  // Look in the api.ts file for api calls
  // First you need to register your bot to the game server.
  // When registering, you will receive an id for your bot.
  // This will be used to control your bot.

  // You need to wait one second between each action.

  // Below is example code for a bot that after
  // being registered moves randomly to left and right.
  // You can use this code as a starting point for your own implementation.

  const playerName = "tapirbot";
  const startingInformation = await register(playerName);
  const statePromise = getGameState();
  const mapPromise = getMap();

  const moves: Move[] = ["LEFT", "RIGHT"];
  console.log('moves:',moves[Math.floor(Math.random() * moves.length)])

  Promise.all([statePromise, mapPromise]).then((values) => {
    const items = values[0].items;
    const gameMapTiles = values[1].tiles;
    const player: Player = getPlayerInfo(values[0].players, playerName);
    const currentPos: Position = player.position;
    const itemsSortedByPrice = _.orderBy(items, ["price"], "desc");
    const mostExpensiveItemPosition = itemsSortedByPrice[0].position;

    const gameMap = initGrid(gameMapTiles);
    
    
    const path = aStar(currentPos, mostExpensiveItemPosition, gameMap);

    setInterval(() => {
      const moves: Move[] = ["LEFT", "RIGHT"];
      console.log('moves:',moves[Math.floor(Math.random() * moves.length)])
      move(
        startingInformation.id,
        moves[Math.floor(Math.random() * moves.length)]
      );
    }, 1000);

  });
 
};

if (require.main === module) {
  main();
}


