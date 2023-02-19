import { Move } from "./Move";
import { Position } from "./Position";

export function getNextMove(currentPos: Position, nextPosition: Position):Move | null{

    if(nextPosition.y > currentPos.y && nextPosition.x == currentPos.x) return "UP"
    else if(nextPosition.y < currentPos.y && nextPosition.x == currentPos.x) return "DOWN"
    else if(nextPosition.x < currentPos.x && nextPosition.y == currentPos.y) return "LEFT"
    else if(nextPosition.x > currentPos.x && nextPosition.y == currentPos.y) return "RIGHT"

    return null;
}
