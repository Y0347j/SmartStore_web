#include <stdio.h>
#include <malloc.h>

#define MAX   8
#define DONTMOVE -1
#define WALL  -2
#define CLOSED  -3
#define UNDEF  -1
#define INF   0

typedef struct vertex{
  int r; // row(행)
  int c; // colum(열)
  int g; // 가중치
}VERTEX;
typedef struct queue{
  VERTEX v;
  struct queue *next;
}QUEUE;

QUEUE *Q;
// 출발점, 도착점
VERTEX s, e;
int g[MAX][MAX]; // 0으로 초기화 되어 있음
int visit[MAX][MAX]; // 방문한 좌표
int pre[MAX][MAX];
char resultpath[MAX][MAX]={0,};
int loc[4][2] = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
char firstheading;
char heading[MAX][MAX]={0,};
char move[MAX][MAX]={0,};
char headDir[4]={'N','E','S','W'};
int index;

bool empty_queue(void){
  return Q == NULL;
}

VERTEX dequeue(void){
  QUEUE * f = Q;
  VERTEX v = {0,0,0};

  if( f != NULL){
    Q = f->next;
    v.r = f->v.r;
    v.c = f->v.c;
    v.g = f->v.g;
    free(f);
    return v;
  }
  return v;
}

// 이동가능한 지점을 큐에 배정하는 부분, 삽입과 동시에 정렬이 이루어짐 (=최소값을 수월하게 찾기 위함)
void enqueue(VERTEX v){
  QUEUE *f = Q; // 현재 좌표
  QUEUE *newq = (QUEUE*)malloc(sizeof(QUEUE));
  VERTEX temp;
  int key;

  newq->next = NULL;
  newq->v  = v; // 새로 들어온 좌표

  if(f == NULL){
    Q = newq; return;
  }

  // 큐 내부를 가중치 기준으로 정렬함
  while(f->next != NULL){
    key = g[v.r][v.c];
    if( key < g[f->v.r][f->v.c]){ // 현재 좌표의 가중치 보다 새로 들어온 좌표의 가중치가 더 작으면
      temp = f->v;
      f->v = v; // 현재 좌표에 새로 들어온 좌표를 저장
      v = temp; // 새로 들어온 좌표에 현재 좌표를 저장
    }
    f = f->next; // 다음 좌표를 정렬하기 위해
  }
  newq->v = v; // 가중치가 더 큰 좌표가 들어감
  f->next = newq;
}

// 휴리스틱을 이용하여, 각 지점들에 이동하는 비용을 계산해줌
int calc_heuristic( VERTEX v, int r,int c, int *gx){
  int result = ((abs(e.r - r) + abs(e.c - c)) * 2); // h(x)
  *gx = v.g; // g(x)

  if( abs(v.r - r) == abs(v.c - c)){
    *gx = *gx + 14;
  }else{
    *gx = *gx + 10;
  }
  return result + *gx; // f(x) = g(x) + h(x)
}

// 목표점이 리스트에 들어오면 종료
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

char getHeading(char move){
  printf("headind=%c move=%c\n",heading, move);
  if(move =='R') index++;
  else if(move =='L') index--;

  if(index > 3) index=0;
  if(index < 0) index=3;
  //heading = headDir[index];
  return headDir[index];
}

void set_path(void){
  int i, j, pi, pj, backtrack;

  // 목적지 전 위치를 구함
  i  = pre[e.r][e.c] / MAX;
  j  = pre[e.r][e.c] % MAX;
  pi = e.r; pj = e.c;
  // 백트레킹을 통해서 목적지 위치에서 시작해서 출발 위치를 찾음
  while(pre[i][j] != UNDEF)
  {
    backtrack = pre[i][j];

    g[i][j] = 7;

    if(heading[pi][pj] =='N'){
      if(pj-j==0) move[i][j]='F';
      if(pi-i == 0 && pj-j > 0) move[i][j]='R';
      if(pi-i ==0 && pj-j < 0) move[i][j]='L';
      heading[i][j] = getHeading(move[i][j]);
    }else if(heading[pi][pj] =='E'){
      if(pi-i == 0) move[i][j]='F';
      if(pi-i > 0 && pj-j == 0) move[i][j]='R';
      if(pi-i < 0 && pj-j == 0) move[i][j]='L';
      heading[i][j] = getHeading(move[i][j]);
    }else if(heading[pi][pj] =='S'){
      if(pj-j==0 ) move[i][j]='F';
      if(pi-i == 0 && pj-j < 0) move[i][j]='R';
      if(pi-i == 0 && pj-j > 0) move[i][j]='L';
      heading[i][j] = getHeading(move[i][j]);
    }else if(heading[pi][pj] == 'W'){
      if(pi-i == 0) move[i][j]='F';
      if(pi-i < 0 && pj-j == 0) move[i][j]='R';
      if(pi-i > 0 && pj-j == 0) move[i][j]='L';
      heading[i][j] = getHeading(move[i][j]);
    }
    pi = i;
    pj = j;
    i  = backtrack / MAX;
    j  = backtrack % MAX;
  }

  // 경로를 설정함
  for( i = 0 ; i < MAX ; i++){
    for( j = 0 ; j < MAX ; j++)
    {
      if( i == e.r && j == e.c){
        resultpath[i][j] = 'I';
      }else if( i == s.r && j == s.c){
        resultpath[i][j] = heading[pi][pj];
      }else if(g[i][j] == 7){
        resultpath[i][j] = heading[i][j];
      }else if( visit[i][j] == -2){
        resultpath[i][j] = 'X';
      }else{
        resultpath[i][j] = 'O';
      }
    }
  }
}

// Astar 알고리즘의 메인 부분
void astar(void){
  VERTEX v;

  g[s.r][s.c]  = 0;
  pre[s.r][s.c] = UNDEF;
  s.g = 0;

  v = s;

  add_openlist(v);

  while(!empty_queue()){
    visit[v.r][v.c] = CLOSED;
    v = dequeue();
    add_openlist(v);
  }
}

int main(void){
  // 출발지
  s.r=0; s.c=7;
  //s.r=4; s.c=1;
  //s.r=2; s.c=1;
  //s.r=2; s.c=6;
  //s.r=4; s.c=6;

  // 목적지
  //e.r=4; e.c=1;
  e.r=2; e.c=1;
  //e.r=4; e.c=6;
  //e.r=2; e.c=6;
  //e.r=1; e.c=7;
  // index=2;
  // heading[e.r][e.c]=headDir[index];
  //index =2;
  //heading ='S';
  index=2;
  heading[e.r][e.c]=headDir[index];
  //index = 0;
  //heading ='N';

  // 벽 추가
  visit[2][2]=WALL;
  visit[2][5]=WALL;
  visit[4][2]=WALL;
  visit[4][5]=WALL;

  astar();
  set_path();

  printf("path: \n");
  for(int i=0;i<MAX;i++){
    for(int j=0;j<MAX;j++){
      printf("%5c",resultpath[i][j]);
    }
    printf("\n");
  }
  return 0;
}

// https://leeyongjeon.tistory.com/entry/A-A-star-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98
