# 构建阶段
FROM node:21.5.0 as builder

WORKDIR /src

RUN which corepack || npm install -g --force corepack@0.10.0
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm build-only

# 运行阶段
FROM nginx:1.25

COPY --from=builder /src/dist /usr/share/nginx/html

VOLUME ["/etc/nginx"]

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
