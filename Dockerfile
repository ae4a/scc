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

# Stage 3: Creating previews
FROM alpine:latest AS image-processor

WORKDIR /images

# Install ImageMagick
RUN apk add --no-cache imagemagick

# Copy images directly from source
COPY ./public/imgs /images/imgs

# Process all back.JPG/back.jpg images in toys directories
RUN find /images/imgs/toys -type f \( -name "back.JPG" -o -name "back.jpg" \) | while read img; do \
    dir=$(dirname "$img"); \
    magick "$img" -resize 200x200 -gaussian-blur 0.05 -quality 50 "$dir/back-preview.jpg"; \
    echo "Processed: $img -> $dir/back-preview.jpg"; \
    done

# Stage 4: Runtime
FROM alpine:latest AS runner

WORKDIR /app

# Copy Go binary
COPY --from=go-builder /build/customizer /app/customizer

# Copy built frontend
COPY --from=frontend-builder /app/dist /app/dist

# Copy configs
COPY ./public/configs /app/public/configs

# Copy processed images (with previews) from image-processor
COPY --from=image-processor /images/imgs /app/public/imgs

EXPOSE 8080

ENTRYPOINT ["/app/customizer"]
