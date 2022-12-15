FROM mongo:latest

VOLUME [ "db:/data/db" ]

EXPOSE 27017
   