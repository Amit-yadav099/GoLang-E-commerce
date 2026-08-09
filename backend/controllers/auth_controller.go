package controllers

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"shopease-backend/config"
	"shopease-backend/models"
	"shopease-backend/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type registerRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type verifyEmailRequest struct {
	Email string `json:"email"`
	OTP   string `json:"otp"`
}

func RegisterUser(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Please provide all required fields"})
		return
	}

	if req.Name == "" || req.Email == "" || req.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Please provide all required fields"})
		return
	}

	ctx := c.Request.Context()
	collection := config.DB.Collection("users")

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	var existing models.User
	err := collection.FindOne(ctx, bson.M{"email": req.Email}).Decode(&existing)
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "User with this email already exits"})
		return
	}
	if err != mongo.ErrNoDocuments {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal Server error"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 10)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal Server error"})
		return
	}

	otp := utils.RandomOTP()
	otpExpires := time.Now().Add(5 * time.Minute)
	now := time.Now()

	user := models.User{
		ID:         primitive.NewObjectID(),
		Name:       strings.TrimSpace(req.Name),
		Email:      req.Email,
		Password:   string(hashedPassword),
		Role:       "user",
		OTP:        otp,
		OTPExpires: &otpExpires,
		IsVerified: false,
		CreatedAt:  now,
		UpdatedAt:  now,
	}

	_, err = collection.InsertOne(ctx, user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal Server error"})
		return
	}

	message := fmt.Sprintf(`
            <h2>Welcome to our E-commerce Platform, %s!</h2>
            <p>Thank you for registeration.</p>
            <p>Your one-time verification/discount OTP is: <strong>%s</strong></p>`, user.Name, otp)

	if err := utils.SendEmail(user.Email, "Welcome to E-commerece Platform- Your OTP for Registration", message); err != nil {
		_, _ = collection.DeleteOne(ctx, bson.M{"_id": user.ID})
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to send verification email"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "OTP sent successully , please verify it through your email",
		"email":   user.Email,
	})
}

func LoginUser(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid email or password 1"})
		return
	}

	ctx := c.Request.Context()
	collection := config.DB.Collection("users")

	var user models.User
	err := collection.FindOne(ctx, bson.M{"email": strings.ToLower(strings.TrimSpace(req.Email))}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid email or password 1"})
		return
	}

	if !user.IsVerified {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Please verify your email before logging in"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid email or password"})
		return
	}

	token, err := utils.GenerateToken(user.ID.Hex())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"_id":   user.ID,
		"name":  user.Name,
		"email": user.Email,
		"role":  user.Role,
		"token": token,
	})
}

func GetUsers(c *gin.Context) {
	ctx := c.Request.Context()
	collection := config.DB.Collection("users")

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var users []models.User
	if err := cursor.All(ctx, &users); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	if users == nil {
		users = []models.User{}
	}

	c.JSON(http.StatusOK, users)
}

func VerifyEmail(c *gin.Context) {
	var req verifyEmailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	ctx := c.Request.Context()
	collection := config.DB.Collection("users")

	var user models.User
	err := collection.FindOne(ctx, bson.M{"email": strings.ToLower(strings.TrimSpace(req.Email))}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	if user.IsVerified {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Email already verified"})
		return
	}

	if user.OTP != req.OTP {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid OTP"})
		return
	}

	if user.OTPExpires == nil || user.OTPExpires.Before(time.Now()) {
		c.JSON(http.StatusBadRequest, gin.H{"message": "OTP expired"})
		return
	}

	_, err = collection.UpdateOne(ctx, bson.M{"_id": user.ID}, bson.M{
		"$set": bson.M{
			"isVerified": true,
			"updatedAt":  time.Now(),
		},
		"$unset": bson.M{
			"otp":        "",
			"otpExpires": "",
		},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal server error"})
		return
	}

	token, err := utils.GenerateToken(user.ID.Hex())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Email verified successfully",
		"token":   token,
		"user": gin.H{
			"_id":   user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}