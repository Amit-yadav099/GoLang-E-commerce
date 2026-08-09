package controllers

import (
	"net/http"

	"shopease-backend/config"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func GetAdminStats(c *gin.Context) {
	ctx := c.Request.Context()

	totalUsers, err := config.DB.Collection("users").CountDocuments(ctx, bson.M{"role": "user"})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	totalOrders, err := config.DB.Collection("orders").CountDocuments(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	totalProducts, err := config.DB.Collection("products").CountDocuments(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	cursor, err := config.DB.Collection("orders").Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var totalRevenue float64
	for cursor.Next(ctx) {
		var doc struct {
			TotalAmount float64 `bson:"totalAmount"`
		}
		if err := cursor.Decode(&doc); err == nil {
			totalRevenue += doc.TotalAmount
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"totalOrders":   totalOrders,
		"totalUsers":    totalUsers,
		"totalProducts": totalProducts,
		"totalRevenue":  totalRevenue,
	})
}
