# Image de base avec Node 20
FROM node:20

# Dossier de travail dans le conteneur
WORKDIR /app

# On copie seulement les fichiers de dépendances
COPY package*.json ./

# On installe les dépendances (npm install)
RUN npm install

# On copie tout le reste du projet
COPY . .

# On documente le port utilisé par Expo (ex: 8081)
EXPOSE 8081

# Commande lancée quand le conteneur démarre
CMD ["npx", "expo","start", "--clear", "--tunnel"]


#docker run -it -p 8081:8081   -e REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.39   -v $(pwd):/app   
