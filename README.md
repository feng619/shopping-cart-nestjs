
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

finally, delete the images you just created

```sh
$ make rmi
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

# **API List**

### item

get all items
```
GET /item

success 200
[
    {
        item_id,
        item_name,
        price,
        items_in_stock
    }
]
```

get an item
```
GET /item/{item_id}

success 200
{
    item_name,
    price,
    items_in_stock
}
```

create an item
```
POST /item
{
    item_name,
    price,
    items_in_stock
}

success 201
```

modify an item
```
PUT /item
{
    item_id,
    price,
    items_in_stock
}

success 200
```

delete an item
```
DELETE /item/{item_id}

success 200
```


## user

get all users
```
GET /user

success 200
[
    {
        user_id,
        user_name,
        account,
        password,
        credit,
        cart,
        created_time,
        last_login_time
    }
]
```

get a user
```
GET /user/{user_id}

success 200
{
    account,
    user_name,
    credit,
    created_time,
    last_login_time
}
```

get the order list of a user
```
GET /user/{user_id}/orderlist

success 200
{
    account,
    name,
    order_list: [
        {
            order_id,
            item_list: [
                {
                    item_id,
                    item_name,
                    item_price,
                    amount,
                    subtotal
                }
            ],
            created_time,
            total
        }
    ]
}
```

get the shopping cart of a user
```
GET /user/{user_id}/cart

success 200
{
    total,
    item_list: [
        {
            item_id,
            item_name,
            item_price,
            amount,
            subtotal
        }
    ]
}
```

sign up
```
POST /user
{
    user_name,
    account,
    password,
    credit
}

success 201
```

log in
```
POST /user
{
    account,
    password
}

success 200
{
    user_id,
    user_name
}
```

deposit
```
PUT user/deposit
{
    user_id,
    amount
}

success 200
{
    user_id,
    user_name
}
```

add to shopping cart
```
PUT /user/additem
{
    user_id,
    item_id,
    amount
}

success 200
failure 409
```

remove from shopping cart
```
PUT /user/removeitem
{
    user_id,
    item_id
}

success 200
failure 409
```

checkout
```
PUT /user/checkout
{
    user_id
}

success 200
```


## order

get all orders
```
GET /order

success 200
[
    {
        order_id,
        order_details: [
            {
                amount,
                item_id
            }
        ],
        created_time
    }
]
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
$ curl -XGET "localhost:3000/item/f41e69f2-3958-4ca4-be09-7e8058c15036"
```

create an item
```sh
$ curl -XPOST "localhost:3000/item" -H "Content-Type:application/json" -d '{"item_name":"mug","price":10,"items_in_stock":100}'
```

modify an item
```sh
$ curl -XPUT "localhost:3000/item" -H "Content-Type:application/json" -d '{"item_id":"f41e69f2-3958-4ca4-be09-7e8058c15036","price":15,"items_in_stock":1000}'
```

delete an item
```sh
$ curl -XDELETE "localhost:3000/item/f41e69f2-3958-4ca4-be09-7e8058c15036"
```


## user

get all users
```sh
$ curl -XGET "localhost:3000/user"
```

get a user
```sh
$ curl -XGET "localhost:3000/user/85a73471-807a-42ad-8020-3094435574f6"
```

get the order list of a user
```sh
$ curl -XGET "localhost:3000/user/85a73471-807a-42ad-8020-3094435574f6/orderlist"
```

get the shopping cart of a user
```sh
$ curl -XGET "localhost:3000/user/85a73471-807a-42ad-8020-3094435574f6/cart"
```

sign up
```sh
$ curl -XPOST "localhost:3000/user" -H "Content-Type:application/json" -d '{"user_name":"chien","account":"abc@gmail.com","password":"123456","credit":100}'
```

log in
```sh
$ curl -XPUT "localhost:3000/user/login" -H "Content-Type:application/json" -d '{"account":"abc@gmail.com","password":"123456"}'
```

deposit
```sh
$ curl -XPUT "localhost:3000/user/deposit" -H "Content-Type:application/json" -d '{"user_id":"85a73471-807a-42ad-8020-3094435574f6","amount":50}'
```

add to shopping cart
```sh
$ curl -XPUT "localhost:3000/user/additem" -H "Content-Type:application/json" -d '{"user_id":"85a73471-807a-42ad-8020-3094435574f6","item_id":"f41e69f2-3958-4ca4-be09-7e8058c15036","amount":1}'
```

remove from shopping cart
```sh
$ curl -XPUT "localhost:3000/user/removeitem" -H "Content-Type:application/json" -d '{"user_id":"85a73471-807a-42ad-8020-3094435574f6","item_id":"f41e69f2-3958-4ca4-be09-7e8058c15036"}'
```

checkout
```sh
$ curl -XPUT "localhost:3000/user/checkout" -H "Content-Type:application/json" -d '{"user_id":"85a73471-807a-42ad-8020-3094435574f6"}'
```


## order

get all orders
```sh
$ curl -XGET "localhost:3000/order"
```


##### &nbsp;

# **Tests**

start a postgres instance

```sh
$ cd postgres
$ make r

# wait for a second, then
$ make i
```

install all dependencies

```sh
$ cd ../server
$ npm i
```

run the tests

```sh
$ npm run test-e2e
```

remove the postgres instance

```sh
$ cd ../postgres
$ make rm
```
