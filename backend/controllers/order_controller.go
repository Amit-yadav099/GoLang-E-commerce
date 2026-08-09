package controllers

import (
	"fmt"
	"net/http"
	"time"

	"shopease-backend/config"
	"shopease-backend/middleware"
	"shopease-backend/models"
	"shopease-backend/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type createOrderRequest struct {
	Items       []models.OrderItemInput `json:"items"`
	TotalAmount float64                 `json:"totalAmount"`
	Address     models.OrderAddress     `json:"address"`
	PaymentID   string                  `json:"paymentId"`
}

func CreateOrder(c *gin.Context) {
	var req createOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if len(req.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "No order items"})
		return
	}

	user := middleware.GetUser(c)
	now := time.Now()

	orderItems := make([]models.OrderItem, 0, len(req.Items))
	for _, item := range req.Items {
		productID, err := primitive.ObjectIDFromHex(item.ProductID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid product ID in order items"})
			return
		}

		qty := item.Quantity
		if qty == 0 {
			qty = item.Qty
		}
		if qty == 0 {
			qty = 1
		}

		orderItems = append(orderItems, models.OrderItem{
			ProductID: productID,
			Quantity:  qty,
			Price:     item.Price,
		})
	}

	order := models.Order{
		ID:          primitive.NewObjectID(),
		UserID:      user.ID,
		Items:       orderItems,
		TotalAmount: req.TotalAmount,
		Address:     req.Address,
		PaymentID:   req.PaymentID,
		Status:      "Pending",
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	ctx := c.Request.Context()
	_, err := config.DB.Collection("orders").InsertOne(ctx, order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	message := fmt.Sprintf(`
        <h2>Order Confirmation</h2>
        <p>Hello %s,</p>
        <p>Your order has been successfully placed! Order ID: <strong>%s</strong></p>
        <p>Total Amount Paid: $%.2f</p>
        <p>It will be shipped to: %s, %s</p>
        <p>Thank you for shopping with our platfomr. Hope to see you soon again!</p>
      `, user.Name, order.ID.Hex(), req.TotalAmount, req.Address.Street, req.Address.City)

	_ = utils.SendEmail(user.Email, "E-commerce- Order confirmation", message)

	c.JSON(http.StatusCreated, gin.H{
		"message": "order created successfully",
		"order":   order,
	})
}

func GetOrders(c *gin.Context) {
	ctx := c.Request.Context()

	cursor, err := config.DB.Collection("orders").Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching orders", "error": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var orders []models.Order
	if err := cursor.All(ctx, &orders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching orders", "error": err.Error()})
		return
	}

	if orders == nil {
		orders = []models.Order{}
	}

	populated := make([]models.OrderWithUser, 0, len(orders))
	for _, order := range orders {
		var user models.User
		_ = config.DB.Collection("users").FindOne(ctx, bson.M{"_id": order.UserID}).Decode(&user)

		populated = append(populated, models.OrderWithUser{
			ID:          order.ID,
			UserID:      models.PopulatedUser{ID: user.ID, Name: user.Name},
			Items:       order.Items,
			TotalAmount: order.TotalAmount,
			Address:     order.Address,
			PaymentID:   order.PaymentID,
			Status:      order.Status,
			CreatedAt:   order.CreatedAt,
			UpdatedAt:   order.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, populated)
}

func MyOrders(c *gin.Context) {
	user := middleware.GetUser(c)
	ctx := c.Request.Context()

	cursor, err := config.DB.Collection("orders").Find(ctx, bson.M{"userId": user.ID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "error fetching orders", "error": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var orders []models.Order
	if err := cursor.All(ctx, &orders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "error fetching orders", "error": err.Error()})
		return
	}

	if orders == nil {
		orders = []models.Order{}
	}

	populated := make([]models.OrderWithProducts, 0, len(orders))
	for _, order := range orders {
		populatedItems := make([]models.OrderItemPopulated, 0, len(order.Items))
		for _, item := range order.Items {
			var product models.Product
			_ = config.DB.Collection("products").FindOne(ctx, bson.M{"_id": item.ProductID}).Decode(&product)

			populatedItems = append(populatedItems, models.OrderItemPopulated{
				ProductID: models.PopulatedProduct{
					ID:    product.ID,
					Name:  product.Name,
					Price: product.Price,
				},
				Quantity: item.Quantity,
				Price:    item.Price,
			})
		}

		populated = append(populated, models.OrderWithProducts{
			ID:          order.ID,
			UserID:      order.UserID,
			Items:       populatedItems,
			TotalAmount: order.TotalAmount,
			Address:     order.Address,
			PaymentID:   order.PaymentID,
			Status:      order.Status,
			CreatedAt:   order.CreatedAt,
			UpdatedAt:   order.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, populated)
}

type updateStatusRequest struct {
	Status string `json:"status"`
}

func UpdateOrderStatus(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "order not found"})
		return
	}

	var req updateStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	ctx := c.Request.Context()
	collection := config.DB.Collection("orders")

	var order models.Order
	err = collection.FindOne(ctx, bson.M{"_id": id}).Decode(&order)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusBadRequest, gin.H{"message": "order not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	order.Status = req.Status
	order.UpdatedAt = time.Now()

	_, err = collection.ReplaceOne(ctx, bson.M{"_id": id}, order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "order status updated",
		"order":   order,
	})
}
