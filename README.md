"# TP3_INFO509" 

npm install

cd data

##Docker doit bien être ouvert avant
./mongo-config.sh

npm start


Sinon MANUELLEMENT:
npm install

cd data

##Docker doit bien être ouvert avant
docker-compose up -d
docker exec -i mongodb mongoimport --db td5 --collection customers --type csv --file /docker-entrypoint-initdb.d/customers.csv --headerline
docker exec -i mongodb mongoimport --db td5 --collection orders --type csv --file /docker-entrypoint-initdb.d/orders.csv --headerline
docker exec -i mongodb mongoimport --db td5 --collection products --type csv --file /docker-entrypoint-initdb.d/products.csv --headerline
docker exec -i mongodb mongoimport --db td5 --collection suppliers --type csv --file /docker-entrypoint-initdb.d/suppliers.csv --headerline


npm start