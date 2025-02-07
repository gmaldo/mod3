#Getting the base imagen:
FROM node:18-alpine  

#Setting Working directory .
WORKDIR /app
   
#Copy the package.json file to working directory
COPY package*.json ./
    
#installing the dependencies in the container
RUN npm install
    
#copy all the source code into the container directory
COPY . .

#Exposed port
EXPOSE 8080

# Healthcheck (opcional, pero recomendado)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
        
#Command to start the aplication (defined in package.json)
CMD [ "npm", "start"]