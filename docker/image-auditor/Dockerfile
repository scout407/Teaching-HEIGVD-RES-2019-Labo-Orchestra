FROM node:4.3.1
MAINTAINER Bouyiatiotis Stéphane <stephane.bouyiatiotis@heig-vd.ch>

COPY src /opt/app/

WORKDIR /opt/app/
RUN ["npm", "install", "moment", "--save"]
ENTRYPOINT ["node", "/opt/app/Auditor.js"]