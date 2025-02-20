# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos essenciais
COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

# Gera os tipos do Prisma e compila o TypeScript
RUN npx prisma generate
RUN npm run build

# Etapa 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Copia apenas os arquivos necessários do builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

# Executa prisma generate no post build
RUN npx prisma generate

CMD ["node", "dist/index.js"]