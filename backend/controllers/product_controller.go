package controllers

import (
	"net/http"
	"strconv"
	"time"

	"shopease-backend/config"
	"shopease-backend/models"
	"shopease-backend/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetProducts(c *gin.Context) {
	ctx := c.Request.Context()
	collection := config.DB.Collection("products")

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		return
	}
	defer cursor.Close(ctx)

	var products []models.Product
	if err := cursor.All(ctx, &products); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		return
	}

	if products == nil {
		products = []models.Product{}
	}

	c.JSON(http.StatusCreated, products)
}

func GetProductByID(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "product not found"})
		return
	}

	ctx := c.Request.Context()
	var product models.Product
	err = config.DB.Collection("products").FindOne(ctx, bson.M{"_id": id}).Decode(&product)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"message": "product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		return
	}

	c.JSON(http.StatusCreated, product)
}

func CreateProduct(c *gin.Context) {
	name := c.PostForm("name")
	description := c.PostForm("description")
	priceStr := c.PostForm("price")
	category := c.PostForm("category")
	stockStr := c.PostForm("stock")

	price, err := strconv.ParseFloat(priceStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid price"})
		return
	}

	stock, err := strconv.Atoi(stockStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid stock"})
		return
	}

	imageURL := ""
	file, err := c.FormFile("image")
	if err == nil && file != nil {
		imageURL, err = utils.UploadToCloudinary(file)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			return
		}
	}

	now := time.Now()
	product := models.Product{
		ID:          primitive.NewObjectID(),
		Name:        name,
		Description: description,
		Price:       price,
		Category:    category,
		ImageURL:    imageURL,
		Stock:       stock,
		Rating:      0,
		RatingsCount: 0,
		NumReviews:  "0",
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	ctx := c.Request.Context()
	_, err = config.DB.Collection("products").InsertOne(ctx, product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, product)
}

func UpdateProduct(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Product not found"})
		return
	}

	ctx := c.Request.Context()
	collection := config.DB.Collection("products")

	var product models.Product
	err = collection.FindOne(ctx, bson.M{"_id": id}).Decode(&product)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"message": "Product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	if name := c.PostForm("name"); name != "" {
		product.Name = name
	}
	if description := c.PostForm("description"); description != "" {
		product.Description = description
	}
	if priceStr := c.PostForm("price"); priceStr != "" {
		if price, parseErr := strconv.ParseFloat(priceStr, 64); parseErr == nil && price > 0 {
			product.Price = price
		}
	}
	if category := c.PostForm("category"); category != "" {
		product.Category = category
	}
	if stockStr := c.PostForm("stock"); stockStr != "" {
		if stock, parseErr := strconv.Atoi(stockStr); parseErr == nil {
			product.Stock = stock
		}
	}

	file, err := c.FormFile("image")
	if err == nil && file != nil {
		imageURL, uploadErr := utils.UploadToCloudinary(file)
		if uploadErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": uploadErr.Error()})
			return
		}
		product.ImageURL = imageURL
	}

	product.UpdatedAt = time.Now()

	_, err = collection.ReplaceOne(ctx, bson.M{"_id": id}, product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, product)
}

func DeleteProduct(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "product not found"})
		return
	}

	ctx := c.Request.Context()
	result, err := config.DB.Collection("products").DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "product not found"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Product deleted"})
}
