package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func main() {
	// Load configuration
	cfg, err := LoadConfig()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to load config: %v\n", err)
		os.Exit(1)
	}

	// Initialize logger
	logger := initLogger(cfg.LogLevel)
	defer logger.Sync()

	logger.Info("Starting server",
		zap.String("port", cfg.Port),
		zap.String("dist_dir", cfg.DistDir),
		zap.String("configs_dir", cfg.ConfigsDir),
	)

	// Set Gin mode
	gin.SetMode(cfg.GinMode)

	// Load available configs
	availablePages, err := loadAvailableConfigs(cfg.ConfigsDir)
	if err != nil {
		logger.Fatal("Failed to load configs", zap.Error(err))
	}
	logger.Info("Loaded page configs", zap.Strings("pages", availablePages))

	// Setup router
	r := gin.New()
	r.Use(ginLogger(logger), gin.Recovery())

	// Serve static files (assets, favicon, etc.)
	r.Static("/assets", filepath.Join(cfg.DistDir, "assets"))
	r.Static("/colors", filepath.Join(cfg.DistDir, "colors"))
	r.Static("/fonts", filepath.Join(cfg.DistDir, "fonts"))
	r.Static("/img", filepath.Join(cfg.DistDir, "img"))
	r.StaticFile("/favicon.ico", filepath.Join(cfg.DistDir, "favicon.ico"))

	// Serve configs directory
	r.Static("/configs", cfg.ConfigsDir)

	// Root path - serve gallery
	r.GET("/", func(c *gin.Context) {
		c.File(filepath.Join(cfg.DistDir, "frontend", "html", "gallary.html"))
	})

	// Single segment: could be language code or page name
	r.GET("/:segment", func(c *gin.Context) {
		segment := c.Param("segment")

		// Check if this is a known page name (config exists)
		isKnownPage := false
		for _, page := range availablePages {
			if segment == page {
				isKnownPage = true
				break
			}
		}

		if isKnownPage {
			// It's a page name, serve editor
			c.File(filepath.Join(cfg.DistDir, "frontend", "html", "editor.html"))
		} else {
			// Assume it's a language code, serve gallery
			c.File(filepath.Join(cfg.DistDir, "frontend", "html", "gallary.html"))
		}
	})

	// Two segments: language + page (e.g., /en/edward, /ru/sheep, /fr/horntail)
	r.GET("/:segment/:page", func(c *gin.Context) {
		c.File(filepath.Join(cfg.DistDir, "frontend", "html", "editor.html"))
	})

	// 404 handler for all other routes
	r.NoRoute(func(c *gin.Context) {
		c.File(filepath.Join(cfg.DistDir, "frontend", "html", "404.html"))
	})

	// Start server
	logger.Info("Server listening", zap.String("address", ":"+cfg.Port))
	if err := r.Run(":" + cfg.Port); err != nil {
		logger.Fatal("Failed to start server", zap.Error(err))
	}
}

func initLogger(level string) *zap.Logger {
	var zapLevel zapcore.Level
	switch level {
	case "debug":
		zapLevel = zapcore.DebugLevel
	case "info":
		zapLevel = zapcore.InfoLevel
	case "warn":
		zapLevel = zapcore.WarnLevel
	case "error":
		zapLevel = zapcore.ErrorLevel
	default:
		zapLevel = zapcore.InfoLevel
	}

	config := zap.NewProductionConfig()
	config.Level = zap.NewAtomicLevelAt(zapLevel)
	config.EncoderConfig.TimeKey = "time"
	config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder

	logger, _ := config.Build()
	return logger
}

func loadAvailableConfigs(configsDir string) ([]string, error) {
	var pages []string

	entries, err := os.ReadDir(configsDir)
	if err != nil {
		return nil, fmt.Errorf("failed to read configs directory: %w", err)
	}

	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".json") {
			// Remove .json extension to get page name
			pageName := strings.TrimSuffix(entry.Name(), ".json")
			pages = append(pages, pageName)
		}
	}

	return pages, nil
}

func ginLogger(logger *zap.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		logger.Info("request",
			zap.String("method", c.Request.Method),
			zap.String("path", c.Request.URL.Path),
			zap.Int("status", c.Writer.Status()),
			zap.String("ip", c.ClientIP()),
		)
	}
}
