package middleware

import (
	"net/http"
	"strings"

	"shopease-backend/config"
	"shopease-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Claims struct {
	ID string `json:"id"`
	jwt.RegisteredClaims
}

func Protect() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Not authorized token failed"})
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
			return []byte(config.JWTSecret), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Not authorized, token failed"})
			return
		}

		objID, err := primitive.ObjectIDFromHex(claims.ID)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Not authorized, token failed"})
			return
		}

		var user models.User
		err = config.DB.Collection("users").FindOne(c.Request.Context(), bson.M{"_id": objID}).Decode(&user)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Not authorized, token failed"})
				return
			}
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
			return
		}

		c.Set("user", user)
		c.Next()
	}
}

func Admin() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := c.Get("user")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Not authorized token failed"})
			return
		}
		u := user.(models.User)
		if u.Role != "admin" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"message": "Access denied, admin only"})
			return
		}
		c.Next()
	}
}

func GetUser(c *gin.Context) models.User {
	return c.MustGet("user").(models.User)
}
