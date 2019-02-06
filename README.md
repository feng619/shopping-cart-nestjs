
> This is my side project with the aim of practicing jest.js and typeORM.
> All suggestions are welcome. Thank you so much.

##### &nbsp;

# **Quick Start**

start the service

```sh
$ make u
```

check if the containers are running correctly

```sh
$ docker ps -a
```

then you can try the curl examples listed below
for example, sign up and log in:

```sh
$ curl -XPOST "localhost:3000/user" -H "Content-Type:application/json" -d '{"user_name":"chien","account":"abc@gmail.com","password":"123456","credit":100}'

$ curl -XPUT "localhost:3000/user/login" -H "Content-Type:application/json" -d '{"account":"abc@gmail.com","password":"123456"}'
```

stop the service

```sh
$ make d
```

##### &nbsp;

# **Schema "public"**

### Table "public.item_entity"

```
     Column     |  Type   | Nullable | Storage  |
----------------+---------+----------+----------+
 item_id        | uuid    | not null | plain    |
 item_name      | text    | not null | extended |
 price          | integer | not null | plain    |
 items_in_stock | integer | not null | plain    |

Indexes:
    "PK_4ce5af93108b5cc934b99fcbe82" PRIMARY KEY, btree (item_id)
```


### Table "public.order_entity"

```code
    Column     |  Type   | Nullable | Storage  |
---------------+---------+----------+----------+
 order_id      | uuid    | not null | plain    |
 order_details | jsonb   | not null | extended |
 created_time  | integer | not null | plain    |
 userUserId    | uuid    |          | plain    |

Indexes:
    "PK_c09f862a01b354c12bc8c3f0c6d" PRIMARY KEY, btree (order_id)
Foreign-key constraints:
    "FK_6aafe1b4b31910c604f13cd232e" FOREIGN KEY ("userUserId") REFERENCES user_entity(user_id)
```


### Table "public.user_entity"

```code
     Column      |       Type        | Nullable | Storage  | 
-----------------+-------------------+----------+----------+
 user_id         | uuid              | not null | plain    |
 user_name       | text              | not null | extended |
 account         | character varying | not null | extended |
 password        | character varying | not null | extended |
 credit          | integer           | not null | plain    |
 cart            | jsonb             | not null | extended |
 created_time    | integer           | not null | plain    |
 last_login_time | integer           | not null | plain    |

Indexes:
    "PK_02777d5180610e45ddbb9bd5429" PRIMARY KEY, btree (user_id)
Referenced by:
    TABLE "order_entity" CONSTRAINT "FK_6aafe1b4b31910c604f13cd232e" FOREIGN KEY ("userUserId") REFERENCES user_entity(user_id)
```

##### &nbsp;

# **Curl Examples**

### item

get all items
```sh
$ curl -XGET "localhost:3000/item"
```

get an item
```sh
$ curl -XGET "localhost:3000/item/a203c201-afa2-45a8-8ce7-855ff96e5187"
```

create an item
```sh
$ curl -XPOST "localhost:3000/item" -H "Content-Type:application/json" -d '{"item_name":"mug","price":10,"items_in_stock":100}'
```

modify an item
```sh
$ curl -XPUT "localhost:3000/item" -H "Content-Type:application/json" -d '{"item_id":"a203c201-afa2-45a8-8ce7-855ff96e5187","price":15,"items_in_stock":1000}'
```

delete an item
```sh
$ curl -XDELETE "localhost:3000/item/a203c201-afa2-45a8-8ce7-855ff96e5187"
```


## user

get all users
```sh
$ curl -XGET "localhost:3000/user"
```

get a user
```sh
$ curl -XGET "localhost:3000/user/cd5ff24e-e57e-4dea-acb1-d0103e08c0ad"
```

get the order list of a user
```sh
$ curl -XGET "localhost:3000/user/cd5ff24e-e57e-4dea-acb1-d0103e08c0ad/orderlist"
```

get the shopping cart of a user
```sh
$ curl -XGET "localhost:3000/user/cd5ff24e-e57e-4dea-acb1-d0103e08c0ad/cart"
```

sign up
```sh
$ curl -XPOST "localhost:3000/user" -H "Content-Type:application/json" -d '{"user_name":"chien","account":"abc@gmail.com","password":"123456","credit":100}'

$ curl -XPOST "localhost:3000/user" -H "Content-Type:application/json" -d '{"user_name":"eric","account":"123@gmail.com","password":"asdzxc","credit":100}'
```

log in
```sh
$ curl -XPUT "localhost:3000/user/login" -H "Content-Type:application/json" -d '{"account":"abc@gmail.com","password":"123456"}'

$ curl -XPUT "localhost:3000/user/login" -H "Content-Type:application/json" -d '{"account":"123@gmail.com","password":"asdzxc"}'
```

deposit
```sh
$ curl -XPUT "localhost:3000/user/deposit" -H "Content-Type:application/json" -d '{"user_id":"cd5ff24e-e57e-4dea-acb1-d0103e08c0ad","amount":50}'
```

add to shopping cart
```sh
$ curl -XPUT "localhost:3000/user/additem" -H "Content-Type:application/json" -d '{"user_id":"cd5ff24e-e57e-4dea-acb1-d0103e08c0ad","item_id":"a203c201-afa2-45a8-8ce7-855ff96e5187","amount":1}'
```

remove from shopping cart
```sh
$ curl -XPUT "localhost:3000/user/removeitem" -H "Content-Type:application/json" -d '{"user_id":"cd5ff24e-e57e-4dea-acb1-d0103e08c0ad","item_id":"a203c201-afa2-45a8-8ce7-855ff96e5187"}'
```

checkout
```sh
$ curl -XPUT "localhost:3000/user/checkout" -H "Content-Type:application/json" -d '{"user_id":"cd5ff24e-e57e-4dea-acb1-d0103e08c0ad"}'
```


## order

get all orders
```sh
$ curl -XGET "localhost:3000/order"
```
