#include "AstarPath.h"

int main(){
  AstarPath ap(0,1,4,1);
  int d = ap.direction();
  printf("%d\n",d);
  if(d ==  -1){
    printf("W");
  }else if(d == 1){
    printf("E");
  }else if(d == -8){
    printf("S");
  }else if(d == 8){
    printf("N");
  }
}
