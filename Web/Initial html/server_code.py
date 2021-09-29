import socket
from datatime import datatime

count =0

def run_server(port=4000):
	now = datatime.now()
	print(now)
	global count
	count = count+1
	print(count)
	host = '192.168.124.128'
	with socket.socket(socket.AF_INET,socket.SOCK_STREAM) as s:
	s.bind((host,port))
	s.listen()
	conn, addr = s.accept()
	msg = conn.recv(1024)
	print(msg)
	conn.sendall(msg)
	conn.close()

while True:
	run_server()
