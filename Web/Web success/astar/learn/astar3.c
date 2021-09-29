#include <stdio.h>
#include <stdlib.h>

#define MAX 0x0fffffff

#define NONE -1
#define CHECK 1

#define NUM_CITY 20


enum {Arad=0,Bucharest=1,Cralova=2,Dobreta=3,Eforie=4,
Fagaras=5,Giurgiu=6,Hirsova=7,Iasi=8,Lugoj=9,Mechadia=10,
Neamt=11,Oradea=12,PiEvaluatei=13,Rimnicu=14,Sibiu=15,Timisoara=16,
Vaslui=17,Zerind=18,Uriziceni=19 };


//GRAPH 이동경로 알고리즘은 완화와 초기화의 연산을 해서 구한다.

//실제 노드 간의 주어진 거리 G (시작노드에서 노드 N 사이의 직선거리,최단거리라고도 함 )
int cityDist[NUM_CITY][NUM_CITY];
//추정 거리 H (목적노드에서 노드 N의 직선거리)
int cityHeuristic[NUM_CITY];
//평가 거리 F
int cityEvaluateDist[NUM_CITY];
//최대 적합 경로
int bestPath[NUM_CITY];
//각 노드 간에 부모 표시
int parent[NUM_CITY];

//노드 집합
int openList[NUM_CITY];
int closeList[NUM_CITY];

//도시 정보 입력
void printParent(int goal)
{
	int city=goal;
	int cnt=0;

	while(parent[city]!= -1)
	{
		printf("level %d : %d node\n",cnt,parent[city]);
		cnt++; city = parent[city];
	}


}
void printBestPath()
{
	int i=0;

	for(i=0; i<NUM_CITY; i++)
	{
		if(bestPath[i] > 0 )
			printf("%d. %d node  \n",i,bestPath[i]);
	}
}
int isOpenListEmpty()
{
	int i=0;
	for(i=0; i<NUM_CITY; i++)
	{
		if(openList[i]!=NONE)
			return 0;
	}
	return 1;
}
void init()
{
	int i,j;


	for(i=0; i<NUM_CITY; i++)
	{
		for(j=0;j<NUM_CITY; j++)
		{
			cityDist[i][j]=MAX;
		}
	}
	for(i=0; i<NUM_CITY; i++)
		cityHeuristic[i]=MAX;

	for(i=0; i<NUM_CITY; i++)
	{
		openList[i]=NONE; closeList[i] = NONE;
		parent[i] = NONE;
	}


	//dist자료 입력
	cityDist[Arad][Zerind]=75;
	cityDist[Arad][Timisoara]=118;
	cityDist[Arad][Sibiu]=140;
	cityDist[Timisoara][Lugoj]=111;
	cityDist[Zerind][Oradea]=71;
	cityDist[Oradea][Sibiu]=151;
	cityDist[Sibiu][Fagaras]=99;
	cityDist[Sibiu][Rimnicu]=80;
	cityDist[Rimnicu][PiEvaluatei]=97;
	cityDist[Fagaras][Bucharest]=211;

	cityDist[Lugoj][Mechadia]=70;
	cityDist[Mechadia][Dobreta]=75;
	cityDist[Dobreta][Cralova]=120;
	cityDist[Cralova][Rimnicu]=146;
	cityDist[Cralova][PiEvaluatei]=138;
	cityDist[PiEvaluatei][Bucharest]=101;
	cityDist[Bucharest][Giurgiu]=90;
	cityDist[Bucharest][Uriziceni]=85;
	cityDist[Uriziceni][Vaslui]=142;
	cityDist[Uriziceni][Hirsova]=98;
	cityDist[Vaslui][Iasi]=92;
	cityDist[Iasi][Neamt]=87;
	cityDist[Hirsova][Eforie]=86;

	//비방향성이므로
	for(i=0; i<NUM_CITY; i++)
	{
		for(j=0; j<NUM_CITY; j++)
		{
			if(cityDist[i][j] < MAX && cityDist[j][i]==MAX )
			{
				cityDist[j][i] = cityDist[i][j];

			}
		}
	}
	for(i=0; i<NUM_CITY; i++)
		cityDist[i][i]=0;
	//heurstie 자료 입력
	cityHeuristic[Arad]=366;
	cityHeuristic[Bucharest]=0;
	cityHeuristic[Cralova]=160;
	cityHeuristic[Dobreta]=242;
	cityHeuristic[Eforie]=161;
	cityHeuristic[Fagaras]=178;
	cityHeuristic[Giurgiu]=77;
	cityHeuristic[Hirsova]=151;
	cityHeuristic[Iasi]=226;
	cityHeuristic[Lugoj]=244;
	cityHeuristic[Mechadia]=241;
	cityHeuristic[Neamt]=234;
	cityHeuristic[Oradea]=380;
	cityHeuristic[PiEvaluatei]=98;
	cityHeuristic[Rimnicu]=193;
	cityHeuristic[Sibiu]=253;
	cityHeuristic[Timisoara]=329;
	cityHeuristic[Uriziceni]=80;
	cityHeuristic[Vaslui]=199;
	cityHeuristic[Zerind]=374;
}
//A스타 알고리즘 작성//
void main(void)
{
	int start = Arad;
	int goal = Bucharest;

	int curNode;
	int visit,min,index;
	int seq=0;
	int i;
	int level=0;


	//초기화
	init();
	//첫시작 - 시작점 셋팅
	cityEvaluateDist[start] = cityHeuristic[start] + cityDist[start][start];
	curNode = start;
	openList[start] = CHECK;

	while( !isOpenListEmpty() )
	{
		min = MAX;
		index = -1;

		//제일 작은 값을 가지는 것을 현재 노드로 선택 - 가능성있는 노드 찾는다
		//노드 이동
		for(visit=0; visit<NUM_CITY; visit++)
		{
			if(openList[visit]==CHECK)
			{
				if(visit==goal)
				{
					index=goal;
					break;
				}
				if(min > cityEvaluateDist[visit])
				{
					min = cityEvaluateDist[visit];
					index = visit;
				}
			}
		}
		curNode = index;
		//출력하기 위해 데이터 체크
		bestPath[seq] = cityEvaluateDist[index];  seq++;

		if(curNode==goal)
			break;
		//오픈리스트에서 제거함
		openList[curNode] = NONE;
		//현재 노드를 닫힌 리스트로 넣음
		closeList[curNode] = CHECK;

		//인접노드 방문

		for(visit=0; visit<NUM_CITY; visit++)
		{


			//닫힌 리스트에 있을 경우
			if(closeList[visit]==CHECK)
				continue;
			//오픈 리스트에 있을 경우
			 if(openList[visit]==CHECK)
			{
				//노드 정보를 구한다
				//완화 시킨다 - 실제 맵 갱신
				for(i=0; i<NUM_CITY; i++)
				{
					if(openList[i]==CHECK && cityDist[start][i]  > cityDist[start][visit] + cityDist[visit][i])
					{
						cityDist[start][i] = cityDist[start][visit] + cityDist[visit][i];
						cityEvaluateDist[i] = cityHeuristic[i] + cityDist[start][i];
						parent[i] = visit;
					}
				}
			}
			else
			{
				//인접하지 않는 노드는 건너뛴다
				if(cityDist[curNode][visit] == MAX)
					continue;
				//새로 방문하게 될 노드의 정보를 구하고 테이블을 갱신한다.
				if(cityDist[start][visit] > cityDist[start][curNode]+cityDist[curNode][visit])
				{
					cityDist[start][visit] =  cityDist[start][curNode]+cityDist[curNode][visit];
					parent[visit] = curNode;
				}
				cityEvaluateDist[visit] = cityDist[start][visit] + cityHeuristic[visit];
				//오픈리스트에 넣음
				openList[visit]=CHECK;
			} //ELSE 종료
		}//FOR문 종료
	level++;
	}//WHILE문 종료
	printBestPath();
	printf("tree level : %d \n",level);
	printParent(goal);
}

//http://slaveofcod.egloos.com/v/815292
