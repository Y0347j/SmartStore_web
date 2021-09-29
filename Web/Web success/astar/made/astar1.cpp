#include <stdio.h>
#include <malloc.h>

#define MAX   8
#define DONTMOVE -1
#define WALL  -2
#define CLOSED  -3
#define UNDEF  -1
#define INF   0

typedef struct vertex{
  int c;
  int r;
  int g;
}VERTEX;

typedef struct queue{
  VERTEX v;
  struct queue *next;
}QUEUE;

void astar( void);
void add_openlist( VERTEX);
int calc_heuristic( VERTEX, int, int);
void enqueue( VERTEX);
VERTEX dequeue( void);
int empty_queue( void);
void print_character( void);
void print_weights( void);

QUEUE *Q;
VERTEX s, e;
int g[MAX][MAX];
int visit[MAX][MAX];
int pre[MAX][MAX];
int loc[4][2] = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};

int main( void)
{
  scanf("%d%d", &s.r, &s.c);
  scanf("%d%d", &e.r, &e.c);

  visit[2][2]=WALL;
  visit[2][5]=WALL;
  visit[4][2]=WALL;
  visit[4][5]=WALL;

  astar();

  //print_weights();
  //printf("\n\n");
  print_character();

  return 0;
}

/*
print_character()
with back tracking, display the shortest root.
*/
void print_character( void)
{
  printf("print_character\n");
  int i, j, backtrack;

  // to back track, calculate the coordinate.
  i  = pre[e.r][e.c] / MAX;
  j  = pre[e.r][e.c] % MAX;

  // continuously calculate the previous coordinates.
  while( pre[i][j] != UNDEF)
  {
    backtrack = pre[i][j];

    g[i][j] = 7;

    i  = backtrack / MAX;
    j  = backtrack % MAX;
  }

  // display the root as characters.
  for( i = 0 ; i < MAX ; i ++)
  {
    for( j = 0 ; j < MAX ; j++)
    {
      if( i == e.r && j == e.c)
      {
        printf("%5s", "E");
      }
      else if( i == s.r && j == s.c)
      {
        printf("%5s", "S");
      }
      else if( g[i][j] == 7 )
      {
        printf("%5s", "P");
      }
      else if( visit[i][j] == -2)
      {
        printf("%5s", "X");
      }
      else
      {
        printf("%5s", "O");
      }
    }
    printf("\n");
  }
}

/*
print_weights()
display the weights of each vertexs.
*/

void print_weights( void)
{
  int i, j;
  for( i = 0 ; i < MAX ; i ++)
  {
    for( j = 0 ; j < MAX ; j ++)
    {
      printf("%5d", pre[i][j]);
    }

    printf("\n");
  }
  for( i = 0 ; i < MAX ; i ++)
  {
    for( j = 0 ; j < MAX ; j ++)
    {
      printf("%5d", g[i][j]);
    }

    printf("\n");
  }
}


/*
empty_queue()
this function examine whether the queue is empty.
*/
int empty_queue( void)
{
  return Q == NULL;
}

/*
dequeue()
it give back the point that stored the first time.
*/
VERTEX dequeue( void)
{
  QUEUE *f = Q;
  VERTEX v = {0,0,0};

  if( f != NULL)
  {
    Q = f->next;

    v.c = f->v.c;
    v.r = f->v.r;
    v.g = f->v.g;

    free(f);

    return v;
  }

  return v;
}

/*
enqueue()
it is used as the list for the open list.
it processes the insertion-sort
*/
void enqueue( VERTEX v)
{
  QUEUE *f = Q;
  QUEUE *newq = (QUEUE*)malloc(sizeof(QUEUE));
  VERTEX temp;
  int cnt  = 0;
  int key;

  newq->next = NULL;
  newq->v  = v;

  if( f == NULL)
  {
    Q = newq;
    return;
  }

  // with insertion-sort, begin sorting process.
  while( f->next != NULL)
  {
    key = g[v.r][v.c];

    if( key < g[f->v.r][f->v.c])
    {
      temp = f->v;
      f->v = v;
      v  = temp;
    }

    f = f->next;
  }

  newq->v = v;
  f->next = newq;
}

/*
calc_heuristic()
calculate the weight with the heuristic
according to the heuristic, A star algorithm has different performance.
*/
int calc_heuristic( VERTEX v, int r, int c, int *gx)
{
  int result;

  // calculate h(x) value.
  result = ((abs(e.c - c) + abs(e.r - r)) * 2);

  // get g(x) value of previous vertex.
  *gx = v.g;

  // examine whether this point is located on the diagonal.
  // increase the count of moving
  if( abs(v.c - c) == abs(v.r - r))
  {
    *gx = *gx + 14;
  }
  else
  {
    *gx = *gx + 10;
  }

  return result + *gx;
}

/*
add_openlist()
this function add the adjacency points to the queue.
*/
void add_openlist( VERTEX v){
  VERTEX temp;
  int i, j, w, gx;

  for (int k = 0; k < 4; ++k) {
    i = v.r + loc[k][0];
    j = v.c + loc[k][1];
    if (i < 0 || i >= MAX || j < 0 || j >= MAX || (i == v.r && j == v.c) ||
    visit[i][j] <= DONTMOVE) continue;

    w = calc_heuristic(v, i, j, &gx);

    if( w < g[i][j] || g[i][j] == INF){ // 초기 가중치 값은 모두 0임
      g[i][j]  = w; // 가중치 업데이트
      pre[i][j] = (v.r * MAX) + v.c; // 상하좌우 좌표 중 가중치가 가장 작은 좌표에 이전 좌표값(현재 좌표값)을 넣어둠

      // 목적지면 끝남
      if( e.r == i && e.c == j){
        Q = NULL; return;
      }
    }

    temp.r = i; temp.c = j; temp.g = gx;
    // 상하좌우 중 가중치가 가장 작은 위치를 큐에 넣음
    enqueue(temp);
  }
}
/*
astar()
it is related with Dijkstra algorithm and
can find the shortest root about 8-ways.
*/
void astar( void)
{
  VERTEX v;

  g[s.r][s.c]  = 0; // init weight on the starting point.
  pre[s.r][s.c] = UNDEF; // the starting point don't have previous root.
  s.g    = 0; // it means that the number of moving.

  v = s; // make the starting point as current point.

  // add adjacency vertexs to the open list.
  add_openlist( v);

  while( !empty_queue())
  {
    // add current vertex to the closed list.
    visit[v.r][v.c] = CLOSED;
    // update current vertex
    v = dequeue();
    // add adjacency vertexs to the open list.
    add_openlist( v);
  }
}

// https://leeyongjeon.tistory.com/entry/A-A-star-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98
