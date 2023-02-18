# A start search algorithm

G-score: Distance travelled from start to current cell (how many steps, corners etc., not the bird's eye distance)
F-score: gScore + estimated distance to goal (guess, how far you are from the goal)


## Pseudocode 
````
// open list sorted by fscore
open = [start]

while open is not empty 
    next = node in open with lowest fScore 
    open.remove 

    if next == goal
        // done! 
        return 

    for each neighbour of next 
        new_gscore = next.gscore + distance(next,neighbour)

        if new_gscore < neighbour.gscore
            neighbour.gscore = new_gscore
            neighbour.fscore = new_gscore + estimated_distance(neighbour, goal)
            if neighbour not in open:
                open.add(neighbour)
````
            
