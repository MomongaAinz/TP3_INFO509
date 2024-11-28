#!/bin/bash

# Vérifie si le dépôt de données est déjà cloné
if [ ! -d "./data/git-data" ]; then
  echo "Clonage des données depuis le dépôt Git..."
  git clone https://github.com/MomongaAinz/test_database.git ./data/git-data
else
  echo "Les données sont déjà clonées."
fi

# Copier les fichiers CSV dans le répertoire de données
echo "Copie des fichiers CSV dans ./data..."
cp ./data/git-data/*.csv ./data/

# Lancer MongoDB avec Docker Compose
echo "Lancement de MongoDB avec Docker Compose..."
docker-compose up -d

# Attendre que MongoDB démarre
echo "Attente du démarrage de MongoDB..."
sleep 10

# Importer les fichiers CSV dans MongoDB
echo "Importation des fichiers CSV dans MongoDB..."
docker exec -i mongodb mongoimport --db td5 --collection customers --type csv --file /docker-entrypoint-initdb.d/customers.csv --headerline
docker exec -i mongodb mongoimport --db td5 --collection orders --type csv --file /docker-entrypoint-initdb.d/orders.csv --headerline
docker exec -i mongodb mongoimport --db td5 --collection products --type csv --file /docker-entrypoint-initdb.d/products.csv --headerline
docker exec -i mongodb mongoimport --db td5 --collection suppliers --type csv --file /docker-entrypoint-initdb.d/suppliers.csv --headerline

echo "Initialisation et importation terminées."
