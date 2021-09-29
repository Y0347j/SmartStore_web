// 벽이 없는 경우

#include <iostream>
#include <queue>
#include <functional>
#define INF 1987654321
using namespace std;

typedef pair<int, int> ii;
typedef pair<int, ii> iii;

int loc[4][2] = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};

ii start = {4, 1};
ii goal = {1,7};

int h(ii now) {
	return 2 * (abs(now.first - goal.first) + abs(now.second - goal.second));
}

int g[8][8];

int main() {

	for (int i = 0; i < 8; ++i){
    for (int j = 0; j < 8; ++j){
    g[i][j] = INF;
    }
  }


	priority_queue<iii, vector<iii>, greater<iii>> pq;
	pq.push({h(start), start});
	g[start.first][start.second] = 0;

	while (!pq.empty()) {
		iii poped = pq.top(); pq.pop();

		int f = poped.first;
		ii now = poped.second;
    cout << "now first: " << now.first << " now Second: "<< now.second << endl;
		if (now == goal) break;

		int nowg = f - h(now);
		if (nowg > g[now.first][now.second]) continue;
		nowg++;


		for (int k = 0; k < 4; ++k) {
			int nextx = now.first + loc[k][0];
			int nexty = now.second + loc[k][1];
			if (nextx < 0 || nextx >= 10 || nexty < 0 || nexty >= 20) continue;

			if (nowg < g[nextx][nexty]) {
				g[nextx][nexty] = nowg;
				pq.push({nowg + h({nextx, nexty}), {nextx, nexty}});
			}
		}
	}

	cout << g[goal.first][goal.second] << '\n';
}

//https://www.secmem.org/blog/2020/04/19/astar/
