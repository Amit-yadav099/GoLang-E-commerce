package main

import (
	"fmt"
	"log"
	"net/url"
	"strings"

	"shopease-backend/config"
	"shopease-backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func isAllowedOrigin(origin string) bool {
	if origin == "" {
		return true
	}

	parsed, err := url.Parse(origin)
	if err != nil {
		return false
	}

	host := strings.ToLower(parsed.Hostname())
	switch host {
	case "localhost", "127.0.0.1", "[::1]":
		return true
	default:
		return strings.HasPrefix(host, "192.168.") || strings.HasPrefix(host, "10.")
	}
}

func main() {
	config.LoadEnv()
	config.ConnectDB()
	config.InitCloudinary()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOriginFunc:  isAllowedOrigin,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.GET("/", func(c *gin.Context) {
		c.String(200, "e-commerence working properly")
	})

	api := r.Group("/api")
	routes.RegisterAuthRoutes(api)
	routes.RegisterProductRoutes(api)
	routes.RegisterOrderRoutes(api)
	routes.RegisterAnalyticsRoutes(api)
	routes.RegisterPaymentRoutes(api)

	port := config.GetPort()
	fmt.Printf("Server is running on port %s\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
