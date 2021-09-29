drop table employee;
drop table checkin;
drop table checkout;
drop table commute;

select * from employee;
select * from checkin;
select * from checkout;
select * from commute;

CREATE TABLE `employee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `login_id` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `gender` varchar(2) NOT NULL,
  `phoneNumber` varchar(50),
  `email` varchar(200),
  `accountNumber` varchar(50),
  `bank` varchar(50),
  `address` varchar(200),
  `position` varchar(50),
  `date` date NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `employee` VALUES (1,'백지민','inbdni','1111','여','01011112222','123456@gmail.com','1111222233334444','우리','서울 동작구 상도동1','대리','2020-09-12');
INSERT INTO `employee` VALUES (2,'공유진','yj','2222','여','01022223333','67890@gmail.com','2222333344445555','농협','서울 동작구 상도동2','대리','2017-03-02');
INSERT INTO `employee` VALUES (3,'윤익준','
Ikjun','3333','남','01033334444','123789@gmail.com','3333444455556666','KB국민','서울 관악구 ','차장','2015-09-01');

 -- CREATE TABLE `checkin`(
 --    `id` int(11) NOT NULL AUTO_INCREMENT,
 --    `date` date,
 --    `intime`time,
 --    `name` varchar(20) NOT NULL,
 --    PRIMARY KEY (`id`)
 -- );

 -- INSERT INTO `checkin` VALUES (1,'2020-09-12','12:10:11','백지민');
 -- INSERT INTO `checkin` VALUES (2,'2020-09-14','12:01:10','백지민');
 -- INSERT INTO `checkin` VALUES (3,'2020-09-16','12:00:14','백지민');
 -- INSERT INTO `checkin` VALUES (4,'2020-09-13','13:03:15','공유진');
 -- INSERT INTO `checkin` VALUES (5,'2020-09-15','13:31:03','공유진');
 -- INSERT INTO `checkin` VALUES (6,'2020-09-17','13:01:45','공유진');
 -- INSERT INTO `checkin` VALUES (7,'2020-09-12', '09:31:03','윤익준');
 -- INSERT INTO `checkin` VALUES (8,'2020-09-13', '09:03:11','윤익준');
 -- INSERT INTO `checkin` VALUES (9,'2020-09-14', '09:10:03','윤익준');

 CREATE TABLE `checkin`(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `Idate` datetime,
    `Iname` varchar(20) NOT NULL,
    PRIMARY KEY (`id`)
 );

 INSERT INTO `checkin` VALUES (1,'2020-09-12 12:10:11','백지민');
 INSERT INTO `checkin` VALUES (2,'2020-09-14 12:01:10','백지민');
 INSERT INTO `checkin` VALUES (3,'2020-09-16 12:00:14','백지민');
 INSERT INTO `checkin` VALUES (4,'2020-09-13 13:03:15','공유진');
 INSERT INTO `checkin` VALUES (5,'2020-09-15 13:31:03','공유진');
 INSERT INTO `checkin` VALUES (6,'2020-09-17 13:01:45','공유진');
 INSERT INTO `checkin` VALUES (7,'2020-09-12 09:31:03','윤익준');
 INSERT INTO `checkin` VALUES (8,'2020-09-13 09:03:11','윤익준');
 INSERT INTO `checkin` VALUES (9,'2020-09-14 09:10:03','윤익준');
 INSERT INTO `checkin` VALUES (10,'2020-10-31 13:00:00','공유진');
 INSERT INTO `checkin` VALUES (11,'2020-10-31 09:00:00','윤익준');
 INSERT INTO `checkin` VALUES (12,'2020-10-31 12:00:00','백지민');
 INSERT INTO `checkin` VALUES (13,'2020-11-01 13:00:00','공유진');
 INSERT INTO `checkin` VALUES (14,'2020-11-01 09:00:00','윤익준');
 INSERT INTO `checkin` VALUES (15,'2020-11-01 12:00:00','백지민');

 -- CREATE TABLE `checkout`(
 --    `id` int(11) NOT NULL AUTO_INCREMENT,
 --    `date` date,
 --    `outtime` time,
 --    `name` varchar(20) NOT NULL,
 --    PRIMARY KEY (`id`)
 -- );

 -- INSERT INTO `checkout` VALUES (1,'2020-09-12', '20:09:11','백지민');
 -- INSERT INTO `checkout` VALUES (2,'2020-09-14', '20:21:45','백지민');
 -- INSERT INTO `checkout` VALUES (3,'2020-09-16', '20:15:11','백지민');
 -- INSERT INTO `checkout` VALUES (4,'2020-09-13', '21:23:15','공유진');
 -- INSERT INTO `checkout` VALUES (5,'2020-09-15', '21:31:03','공유진');
 -- INSERT INTO `checkout` VALUES (6,'2020-09-17', '21:10:45','공유진');
 -- INSERT INTO `checkout` VALUES (7,'2020-09-12', '17:31:10','윤익준');
 -- INSERT INTO `checkout` VALUES (8,'2020-09-13', '17:00:14','윤익준');
 -- INSERT INTO `checkout` VALUES (9,'2020-09-14', '17:15:12','윤익준');

 CREATE TABLE `checkout`(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `Odate` datetime,
    `Oname` varchar(20) NOT NULL,
    PRIMARY KEY (`id`)
 );

 INSERT INTO `checkout` VALUES (1,'2020-09-12 20:09:11','백지민');
 INSERT INTO `checkout` VALUES (2,'2020-09-14 20:21:45','백지민');
 INSERT INTO `checkout` VALUES (3,'2020-09-16 20:15:11','백지민');
 INSERT INTO `checkout` VALUES (4,'2020-09-13 21:23:15','공유진');
 INSERT INTO `checkout` VALUES (5,'2020-09-15 21:31:03','공유진');
 INSERT INTO `checkout` VALUES (6,'2020-09-17 21:10:45','공유진');
 INSERT INTO `checkout` VALUES (7,'2020-09-12 17:31:10','윤익준');
 INSERT INTO `checkout` VALUES (8,'2020-09-13 17:00:14','윤익준');
 INSERT INTO `checkout` VALUES (9,'2020-09-14 17:15:12','윤익준');
 INSERT INTO `checkout` VALUES (10,'2020-10-31 21:00:00','공유진');
 INSERT INTO `checkout` VALUES (11,'2020-10-31 17:30:00','윤익준');
 INSERT INTO `checkout` VALUES (12,'2020-10-31 20:00:00','백지민');
 INSERT INTO `checkout` VALUES (13,'2020-11-01 21:00:00','공유진');
 INSERT INTO `checkout` VALUES (14,'2020-11-01 17:30:00','윤익준');
 INSERT INTO `checkout` VALUES (15,'2020-11-01 20:00:00','백지민');

CREATE Table `commute`(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `checkin` time,
    `checkout` time,
    `name` varchar(20) NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `commute` VALUES (1,'12:00:00',"20:00:00",'백지민');
INSERT INTO `commute` VALUES (2,'13:20:00',"21:10:00",'공유진');
INSERT INTO `commute` VALUES (3,'09:30:00',"17:00:00",'윤익준');

-- 재고 관리 database
drop table display;
drop table work;

select * from display;
select * from work;

UPDATE display SET sState='caused' WHERE Dalpha='A';
UPDATE work SET login_id='', name='' WHERE Walpha='A';

UPDATE display SET sState='accept' WHERE Dalpha='C';
UPDATE work SET login_id='inbdni', name='백지민' WHERE Walpha='C';


UPDATE display SET sState='caused' WHERE Dalpha='D';

CREATE TABLE `display`(
  `id`int(11) NOT NULL AUTO_INCREMENT,
  `Dalpha` varchar(20),
  `sNum` int(11),
  `wNum` int(11),
  `sState` varchar(20),
  `wState` varchar(20),
  PRIMARY KEY(`id`)
);

-- 재고가 부족하면 sState에 caused update;
INSERT INTO `display` VALUES(1,'A',10,100,'done','done');
INSERT INTO `display` VALUES(2,'B',10,100,'done','done');
INSERT INTO `display` VALUES(3,'C',10,100,'done','done');
INSERT INTO `display` VALUES(4,'D',10,100,'done','done');
INSERT INTO `display` VALUES(5,'E',10,100,'done','done');
INSERT INTO `display` VALUES(6,'F',10,100,'done','done');
INSERT INTO `display` VALUES(7,'G',10,100,'done','done');
INSERT INTO `display` VALUES(8,'H',10,100,'done','done');

CREATE TABLE `work`(
  `id`int(11) NOT NULL AUTO_INCREMENT,
  `Walpha` varchar(20),
  `login_id`varchar(20),
  `name`varchar(20),
  PRIMARY KEY(`id`)
);

INSERT INTO `work` VALUES(1,'A','','');
INSERT INTO `work` VALUES(2,'B','','');
INSERT INTO `work` VALUES(3,'C','','');
INSERT INTO `work` VALUES(4,'D','','');
INSERT INTO `work` VALUES(5,'E','','');
INSERT INTO `work` VALUES(6,'F','','');
INSERT INTO `work` VALUES(7,'G','','');
INSERT INTO `work` VALUES(8,'H','','');

-- 로봇 database
drop table robot;

select * from robot;

CREATE TABLE `robot`(
  `id`int(11) NOT NULL AUTO_INCREMENT,
  `rState`varchar(20),
  `rPos`varchar(20),
  PRIMARY KEY(`id`)
);

INSERT INTO `robot` VALUES(1,'store','S0103');

-- CREATE TABLE `inventory` (
--   `id` int(11) NOT NULL AUTO_INCREMENT,
--   `date` datetime NOT NULL,
--   `storeNum` int(50),
--   `warehouseNum` int(50),
--   PRIMARY KEY (`id`)
-- );
--
-- INSERT INTO `inventory` VALUES (1,'2020-09-14 09:10:10',200, 500);
-- INSERT INTO `inventory` VALUES (2,'2020-09-14 20:00:00',150, 500);
-- INSERT INTO `inventory` VALUES (3,'2020-09-15 09:20:20',150, 500);
-- INSERT INTO `inventory` VALUES (4,'2020-09-15 21:00:00',200, 300);
--
CREATE TABLE `product`(
  `id`int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `price` int(255) NOT NULL,
  `rfid` varchar(500),
  `sDisplay` varchar(10),
  `wDisplay` varchar(10),
  PRIMARY KEY (`id`)
);

INSERT INTO `product` VALUES (1,'생수',1000,'3903F3C2','a','a');

-- -- rfid 읽어서 삼품 추가하기
-- INSERT INTO `product` VALUES (1,'생수',1000,'123','a','a');
-- INSERT INTO `product` VALUES (2,'감자침',2000,'234','b','b');
-- INSERT INTO `product` VALUES (3,'건전지',6000,'345','c','c');
-- INSERT INTO `product` VALUES (4,'삼푸',3000,'456','d','d');
-- INSERT INTO `product` VALUES (5,'린스',3000,'567','d','d');
-- INSERT INTO `product` VALUES (6,'신라면',1200,'678','e','e');
-- INSERT INTO `product` VALUES (7,'휴지',5000,'789','f','f');
-- INSERT INTO `product` VALUES (8,'비누',1000,'890','g','g');
-- INSERT INTO `product` VALUES (9,'파워에이드',1000,'901','a','a');
-- INSERT INTO `product` VALUES (10,'진라면',1500,'012','e','e');
-- INSERT INTO `product` VALUES (11,'계란',1000,'234','h','h');

-- 리스트 database
CREATE TABLE `topic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(30) NOT NULL,
  `description` text,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `topic` VALUES (1,'employee','employeeDB','2020-09-12 20:56:00');
-- INSERT INTO `topic` VALUES (2,'customer', 'customerDB','2020-09-12 20:56:30');
INSERT INTO `topic` VALUES (2,'product', 'product','2020-09-12 20:57:00');


-- 고객 database
-- CREATE TABLE `customer` (
--   `id` int(11) NOT NULL AUTO_INCREMENT,
--   `name` varchar(30) NOT NULL,
--   `password` varchar(200) NOT NULL,
--   `phoneNumber` varchar(50),
--   `email` varchar(200),
--   `cPay` varchar(50),
--   PRIMARY KEY (`id`)
-- );
--
-- INSERT INTO `customer` VALUES (1,'백지민','1111','010-1111-2222','123456@gmail.com','1111-2222-3333-4444');
-- INSERT INTO `customer` VALUES (2,'공유진','2222','010-2222-3333','67890@gmail.com','2222-3333-4444-5555');
-- INSERT INTO `customer` VALUES (3,'윤익준','3333','010-3333-4444','123789@gmail.com','3333-4444-5555-6666');
--
-- CREATE TABLE `payment`(
--   `id` int(11) NOT NULL AUTO_INCREMENT,
--   `item` text,
--   `paytime` datetime NOT NULL,
--   `allPrice` int(255),
--   `customer_id` int(11)DEFAULT NULL,
--   `refund` varchar(5),
--   PRIMARY KEY(`id`)
-- );
--
-- INSERT INTO `payment` VALUES (1,'생수,1000,감자칩,2000','2020-09-12 14:09:11',0,1,'x');
-- INSERT INTO `payment` VALUES (2,'건전지,6000','2020-09-14 16:21:45',0,1,'x');
-- INSERT INTO `payment` VALUES (3,'샴푸,3000,린스,3000','2020-09-16 13:15:11',0,1,'x');
-- INSERT INTO `payment` VALUES (4,'신라면,1200','2020-09-13 16:23:15',0,2,'x');
-- INSERT INTO `payment` VALUES (5,'휴지,5000','2020-09-15 17:31:03',0,2,'x');
-- INSERT INTO `payment` VALUES (6,'비누,1000','2020-09-17 19:10:45',0,2,'x');
-- INSERT INTO `payment` VALUES (7,'파워에이드,2000','2020-09-12 11:31:10',0,3,'x');
-- INSERT INTO `payment` VALUES (8,'진라면,1500,계란,1000','2020-09-13 15:00:14',0,3,'x');
-- INSERT INTO `payment` VALUES (9,'샴푸,3000,휴지,5000','2020-09-14 16:15:12',0,3,'x');
