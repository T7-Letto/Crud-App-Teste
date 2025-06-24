
FROM node:18 AS build_dependencies
WORKDIR /tmp/app_deps
COPY package*.json ./
RUN echo "Conteúdo de /tmp/app_deps antes da instalação:" && ls -la
RUN echo "Conteúdo de package.json:" && cat package.json
RUN npm install && npm install exceljs --save && echo "Conteúdo de node_modules/exceljs após a instalação:" && ls -la node_modules/exceljs


FROM node:18
WORKDIR /app
COPY --from=build_dependencies /tmp/app_deps/node_modules ./node_modules
COPY . .
EXPOSE 3001
CMD ["node", "app.js"]
