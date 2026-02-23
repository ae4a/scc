# Stage 1: Build frontend
FROM node:latest AS frontend-builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Build Go backend
FROM golang:latest AS go-builder

WORKDIR /app

COPY go.* ./
RUN go mod download

COPY ./cmd ./cmd
RUN CGO_ENABLED=0 GOOS=linux go build -o /build/customizer ./cmd/*.go

# Stage 3: Runtime
FROM alpine:latest AS runner

WORKDIR /app

# Copy Go binary
COPY --from=go-builder /build/customizer /app/customizer
COPY --from=frontend-builder /app/dist /app/dist

# Copy configs
COPY ./public/configs /app/public/configs

EXPOSE 8080

ENTRYPOINT ["/app/customizer"]
