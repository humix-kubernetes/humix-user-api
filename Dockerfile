# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json . 

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json . 

RUN npm ci --only=production

# Copia os arquivos do Prisma corretamente
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/prisma ./prisma

COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]
