#include <stdio.h>
#include <malloc.h>
#include <deque>
#include <vector>

using namespace std;

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
void enqueue(VERTEX);
VERTEX dequeue(void);
int empty_queue(void);
void get_path(void);

QUEUE *Q;
deque<int> resultpath;
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
  get_path();
  printf("%d %d\n",resultpath[0],resultpath[1]);
  return 0;
}

void get_path(void)
{
  int i, j, backtrack;

  // to back track, calculate the coordinate.
  resultpath.push_front(e.r*MAX+e.c);
  resultpath.push_front(pre[e.r][e.c]);
  i  = pre[e.r][e.c] / MAX;
  j  = pre[e.r][e.c] % MAX;

  // continuously calculate the previous coordinates.
  while( pre[i][j] != UNDEF)
  {
    resultpath.push_front(pre[i][j]);
    backtrack = pre[i][j];

    g[i][j] = 7;

    i  = backtrack / MAX;
    j  = backtrack % MAX;
  }
}

int empty_queue( void){
  return Q == NULL;
}

VERTEX dequeue( void){
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

void enqueue( VERTEX v){
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

    if( key < g[f->v.r][f->v.c]){
      temp = f->v;
      f->v = v;
      v  = temp;
    }

    f = f->next;
  }

  newq->v = v;
  f->next = newq;
}

int calc_heuristic( VERTEX v, int r, int c, int *gx)
{
  int result = ((abs(e.c - c) + abs(e.r - r)) * 2);

  *gx = v.g;

  if( abs(v.c - c) == abs(v.r - r)){
    *gx = *gx + 14;
  }
  else{
    *gx = *gx + 10;
  }

  return result + *gx;
}

void add_openlist( VERTEX v){
  VERTEX temp;
  int i, j, w, gx;

  for (int k = 0; k < 4; ++k) {
    i = v.r + loc[k][0];
    j = v.c + loc[k][1];
    if (i < 0 || i >= MAX || j < 0 || j >= MAX || (i == v.r && j == v.c) ||
    visit[i][j] <= DONTMOVE) continue;

    w = calc_heuristic(v, i, j, &gx);

    if( w < g[i][j] || g[i][j] == INF){
      g[i][j]  = w;
      pre[i][j] = (v.r * MAX) + v.c;
      if( e.r == i && e.c == j){
        Q = NULL; return;
      }
    }

    temp.r = i; temp.c = j; temp.g = gx;
    enqueue(temp);
  }
}

void astar( void)
{
  VERTEX v;
  g[s.r][s.c]  = 0;
  pre[s.r][s.c] = UNDEF;
  s.g = 0;
  v = s;

  add_openlist( v);
  while( !empty_queue())
  {
    visit[v.r][v.c] = CLOSED;
    v = dequeue();
    add_openlist( v);
  }
}
