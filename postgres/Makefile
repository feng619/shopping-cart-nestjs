image = postgres:10
host = cart101

r:
	docker container run \
	--name $(host) \
	-d \
	-p 5432:5432 \
	-e POSTGRES_PASSWORD=pw \
	$(image)

r2:
	docker run -it --rm \
	$(image) \
	psql -h $(host) -U postgres

e:
	docker container exec $(image) psql -U postgres -l

bash:
	docker exec -it $(host) /bin/bash

rm:
	docker rm -f $(host)

# insert
i:
	cat DatabaseCreation.sql \
	| docker exec -i $(host) psql -U postgres