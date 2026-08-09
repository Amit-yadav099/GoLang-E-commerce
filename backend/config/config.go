package config

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	DB         *mongo.Database
	Cloudinary *cloudinary.Cloudinary
	JWTSecret  string
)

func LoadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}
	JWTSecret = os.Getenv("JWT_SECRET")
}

func ConnectDB() {
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal("MONGO_URI environment variable is required")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	if err = client.Ping(ctx, nil); err != nil {
		log.Fatal("Failed to ping MongoDB:", err)
	}

	dbName := os.Getenv("MONGO_DB")
	if dbName == "" {
		if parsed, parseErr := url.Parse(uri); parseErr == nil {
			dbName = strings.TrimPrefix(parsed.Path, "/")
		}
	}
	if dbName == "" {
		dbName = "test"
	}

	DB = client.Database(dbName)
	fmt.Printf("MongoDB connected successfully (database: %s)\n", dbName)
}

func InitCloudinary() {
	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	if cloudName == "" || apiKey == "" || apiSecret == "" {
		log.Println("Warning: Cloudinary credentials not set — image uploads will fail")
		return
	}

	cld, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		log.Fatal("Failed to initialize Cloudinary:", err)
	}
	Cloudinary = cld
	fmt.Println("Cloudinary initialized successfully")
}

func GetPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		return "5000"
	}
	return port
}
