from queue import PriorityQueue as PQ
import matplotlib.pyplot as plt
import matplotlib.patches as pts
import random
import numpy as np
GRIDSIZE = 50

grid = np.array([[0 for col in range(GRIDSIZE)] for row in range(GRIDSIZE)])
path = [[0 for col in range(GRIDSIZE)] for row in range(GRIDSIZE)]
# 비용의 초기값은 항상 계산된 cost보다 커야함
cost = np.array([[GRIDSIZE*GRIDSIZE for col in range(GRIDSIZE)] for row in range(GRIDSIZE)])
dx = [-1,0,0,1,-1,-1,1,1]
dy = [0,1,-1,0,-1,1,-1,1]
dCost = [1,1,1,1,1.414,1.414,1.414,1.414]
goal = [45,45]
plotStep = 10
plotcheck = 0
# 탐색 결과 plot
def plotPath(start,goal):
    global path
    node = goal
    start = [0,0]
    while node != start:
        nextNode = path[node[0]][node[1]]
        # print(node)
        plt.plot([node[0],nextNode[0]],[node[1],nextNode[1]],color='r',linewidth=3)
        node = nextNode

def dijkstra(start):
    global grid, plotcheck,path,plotStep,fname
    plt.scatter(goal[0],goal[1],marker='+')
    Q = PQ()
    Q.put((1,start))
    cost[start[0]][start[1]] = 1
    plt.scatter(start[0],start[1],color='r',s=1)
    found = False
    while not Q.empty():
        if found:
            break
        current = Q.get()[1]
        for i in range(8):
            next = [current[0]+dx[i],current[1]+dy[i]]
            if next[0] >= 0 and next[1] >= 0 and next[0] < GRIDSIZE and next[1] < GRIDSIZE:
                    if grid[next[0]][next[1]] == 0:
                        if cost[next[0]][next[1]] > cost[current[0]][current[1]] + dCost[i]:
                            path[next[0]][next[1]] = current
                            cost[next[0]][next[1]] = cost[current[0]][current[1]] + dCost[i]
                            Q.put((cost[next[0]][next[1]],next))
                            plt.scatter(next[0],next[1],color='r',s=1)
                            if next == goal:
                                found = True
        if plotcheck > plotStep:
            plotcheck = 0
            plt.pause(0.0001)
            plotStep = plotStep + 1
        plotcheck = plotcheck + 1

def randomObstacle(num,max,min):
    global grid
    for i in range(num):
        size = random.randrange(min,max)
        startPointX = random.randrange(GRIDSIZE-size)
        startPointY = random.randrange(GRIDSIZE-size)
        for x in range(size):
            for y in range(size):
                grid[startPointX+x][startPointY+y] = 1
        # visualize obstacles
        rect = pts.Rectangle((startPointX,startPointY-1),size,size,facecolor='k')
        plt.gca().add_patch(rect)

def main():
    #visualize grid
    plt.scatter([-1]*(GRIDSIZE+1),range((GRIDSIZE+1)),color='k',s=1)
    plt.scatter([(GRIDSIZE+1)]*(GRIDSIZE+1),range((GRIDSIZE+1)),color='k',s=1)
    plt.scatter(range((GRIDSIZE+1)),[-1]*(GRIDSIZE+1),color='k',s=1)
    plt.scatter(range((GRIDSIZE+1)),[(GRIDSIZE+1)]*(GRIDSIZE+1),color='k',s=1)
    randomObstacle(10,20,5)
    dijkstra([0,0])
    plotPath([0,0],goal)
    print('end')
    plt.show()


if __name__ == "__main__":
    main()
