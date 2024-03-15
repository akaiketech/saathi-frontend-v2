FROM node:20-slim
WORKDIR /app
COPY [".", "./"]
RUN node --version
RUN npm install -g npm@10 --legacy-peer-deps
RUN npm install --legacy-peer-deps
RUN npm install serve --legacy-peer-deps
ENV NODE_ENV=production
RUN npm run build
EXPOSE 3020
CMD ["npm", "run", "start"]
