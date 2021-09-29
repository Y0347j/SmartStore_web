const MAX = 8;
const DONTMOVE = -1;
const WALL = -2;
const CLOSED =-3;
const UNDEF = -1;
const INF = 0;

class deque {
  constructor() {
    this.data = [];
    this.rear = 0;
  }

  push_front(element) {
    this.data.unshift(element);
    this.rear = this.rear + 1;
  }

  push_back(element) {
    this.data[this.rear] = element;
    this.rear = this.rear + 1;
  }

  pop_front() {
    if (this.isEmptydeque() === false) {
      this.rear = this.rear - 1;
      return this.data.shift();
    }

    return false;
  }

  pop_back() {
    if (this.isEmptydeque() === false) {
      this.rear = this.rear - 1;
      return this.data.pop();
    }

    return false;
  }

  length() {
    return this.rear;
  }

  isEmptydeque() {
    return this.rear === 0;
  }

  getFront() {
    if (this.isEmptydeque() === false) {
      return this.data[0];
    }

    return false;
  }

  getLast() {
    if (this.isEmptydeque() === false) {
      return this.data[this.rear - 1];
    }

    return false;
  }

  print() {
    for (let i = 0; i < this.rear; i++) {
      console.log(this.data[i]);
    }
  }
}

function queue (r, c, g, next){
  this.r = r;
  this.c = c;
  this.g = g;
  this.next = next;
}

function create2DArray(rows, columns) {
    var arr = new Array(rows);
    for (var i = 0; i < rows; i++) {
        arr[i] = new Array(columns);
        for(var j=0;j<columns;j++){
          arr[i][j]=INF;
        }
    }
    return arr;
}

function empty_queue(){
  console.log("empty_queue");
  //if(q == undefined) q = new queue();
  return (Q.r == null || Q.c == null);
}

function dequeue(){
  console.log("dequeue");
  var f = new queue(null,null,null,null);
  f = Q;
  var v = new queue(null,null,null,null);
  v.r=0; v.c=0; v.g=0;
  if(f.r != null && f.c != null){
    Q = f.next;
    v.r = f.r;
    v.c = f.c;
    v.g = f.g;
    delete f;
    return v;
  }
  return v;
}

function enqueue(v){
  console.log("enqueue");
  var f = new queue(null,null,null,null);
  f=Q;

  var newq = new queue(null,null,null,null);
  var temp = new queue(null,null,null,null);
  var key;

  newq.next = null;
  newq.r = v.r;
  newq.c = v.c;
  newq.g = v.g;

  if(f.r == null && f.c == null){
    Q = newq;
    return;
  }

  while(f.next != null){
    key = g[v.r][v.c];
    if(key < g[f.r][f.c]){
      tempR =f.r;
      tempC = f.c;
      tempG = f.g;
      f.r = v.r;
      f.c = v.c;
      f.g = v.g;
      v.r = tempR;
      v.c = tempC;
      v.g = tempG;
    }
    f = f.next;
  }
  newq.r = v.r;
  newq.c = v.c;
  newq.g = v.g;
  f.next = newq;
}

function calc_heuristic(v,r,c){
  console.log("calc_heuristic");
  var result = ((Math.abs(E.c-c)+Math.abs(E.r-r))*2);
  var  gx = v.g;

  if(Math.abs(v.c-c) == Math.abs(v.r - r)){
    gx = gx +14;
  }else{
    gx = gx +10;
  }
  return [result + gx, gx];
}

function add_openlist(v){
  console.log("add_openlist");
  var temp = new queue(null,null,null,null);
  var i,j,w;
  for(var k =0; k< 4;k++){
    i = v.r + loc[k][0];
    j = v.c + loc[k][1];
    if (i < 0 || i >= MAX || j < 0 || j >= MAX || (i == v.r && j == v.c) ||visit[i][j] <= DONTMOVE) continue;

    w = calc_heuristic(v, i, j);
    if( w < g[i][j] || g[i][j] == INF){
      g[i][j]  = w[0];
      pre[i][j] = (v.r * MAX) + v.c;
      console.log("pre: " + pre[i][j]);
      if( E.r == i && E.c == j){
        Q.r = null; Q.c = null; return;
      }
    }

    temp.r = i; temp.c = j; temp.g = w[1];
    enqueue(temp);
  }
}

function astar(){
  console.log("astar");
  var v = new queue(null,null,null,null);
  g[S.r][S.c] =0;
  pre[S.r][S.c] = UNDEF;
  S.g = 0;
  v = S;
  add_openlist(v);
  while(!empty_queue()){
    visit[v.r][v.c] = CLOSED;
    v = dequeue();
    add_openlist(v);
  }
}

function print_weights(){
  var i, j;
  console.log("pre: ");
  for( i = 0 ; i < MAX ; i ++)
  {
    for( j = 0 ; j < MAX ; j ++)
    {
      console.log(pre[i][j]);
    }
  }

  // console.log("g: ");
  // for( i = 0 ; i < MAX ; i ++)
  // {
  //   for( j = 0 ; j < MAX ; j ++)
  //   {
  //     console.log(g[i][j]);
  //   }
  // }
}

function get_path(){
  console.log("get_path");
  var i,j,backtrack;
  resultpath.push_front(E.r*MAX+E.c);
  resultpath.push_front(pre[E.r][E.c]);
  i = parseInt(pre[E.r][E.c] / MAX);
  j = pre[E.r][E.c] % MAX;

  while( pre[i][j] != UNDEF){
    resultpath.push_front(pre[i][j]);
    backtrack = pre[i][j];

    g[i][j] = 7;
    i = parseInt(backtrack / MAX);
    j = backtrack % MAX;
  }
}

var resultpath = new deque();
var Q = new queue(null,null,null,null);

var g = create2DArray(MAX,MAX);
var visit = create2DArray(MAX,MAX);
var pre = create2DArray(MAX,MAX);

var loc = [[0,1],[0,-1],[1,0],[-1,0]];
var S, E;

function direction(sr,sc,er,ec){
S = new queue(sr,sc,null,null);
E = new queue(er,ec,null,null);

visit[2][2]=WALL;
visit[2][5]=WALL;
visit[4][2]=WALL;
visit[4][5]=WALL;

astar();
print_weights();
get_path();
console.log("d find");
console.log(resultpath);
//for(var i=0;i <resultpath.lenght;i++){

//}
//var d = resultpath.data[1] - resultpath.data[0];
//console.log(d);
}

direction(0,7,5,1)

;
//var d = resultpath[1] - resultpath[0]
//console.log(d);
