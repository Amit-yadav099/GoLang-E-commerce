package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type OrderAddress struct {
	FullName   string `json:"fullName" bson:"fullName"`
	Street     string `json:"street" bson:"street"`
	City       string `json:"city" bson:"city"`
	PostalCode string `json:"postalCode" bson:"postalCode"`
	Country    string `json:"country" bson:"country"`
}

type OrderItem struct {
	ProductID  primitive.ObjectID `json:"productId" bson:"productId"`
	Quantity   int                `json:"quantity" bson:"quantity"`
	Price      float64            `json:"price" bson:"price"`
}

type OrderItemInput struct {
	ProductID string  `json:"productId"`
	Quantity  int     `json:"quantity"`
	Qty       int     `json:"qty"`
	Price     float64 `json:"price"`
	Name      string  `json:"name"`
}

type Order struct {
	ID          primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	UserID      primitive.ObjectID `json:"userId" bson:"userId"`
	Items       []OrderItem        `json:"items" bson:"items"`
	TotalAmount float64            `json:"totalAmount" bson:"totalAmount"`
	Address     OrderAddress       `json:"address" bson:"address"`
	PaymentID   string             `json:"paymentId,omitempty" bson:"paymentId,omitempty"`
	Status      string             `json:"status" bson:"status"`
	CreatedAt   time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt   time.Time          `json:"updatedAt" bson:"updatedAt"`
}

type PopulatedUser struct {
	ID   primitive.ObjectID `json:"_id" bson:"_id"`
	Name string             `json:"name" bson:"name"`
}

type PopulatedProduct struct {
	ID    primitive.ObjectID `json:"_id" bson:"_id"`
	Name  string             `json:"name" bson:"name"`
	Price float64            `json:"price" bson:"price"`
}

type OrderItemPopulated struct {
	ProductID PopulatedProduct `json:"productId" bson:"productId"`
	Quantity  int              `json:"quantity" bson:"quantity"`
	Price     float64          `json:"price" bson:"price"`
}

type OrderWithUser struct {
	ID          primitive.ObjectID `json:"_id" bson:"_id"`
	UserID      PopulatedUser      `json:"userId" bson:"userId"`
	Items       []OrderItem        `json:"items" bson:"items"`
	TotalAmount float64            `json:"totalAmount" bson:"totalAmount"`
	Address     OrderAddress       `json:"address" bson:"address"`
	PaymentID   string             `json:"paymentId,omitempty" bson:"paymentId,omitempty"`
	Status      string             `json:"status" bson:"status"`
	CreatedAt   time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt   time.Time          `json:"updatedAt" bson:"updatedAt"`
}

type OrderWithProducts struct {
	ID          primitive.ObjectID   `json:"_id" bson:"_id"`
	UserID      primitive.ObjectID   `json:"userId" bson:"userId"`
	Items       []OrderItemPopulated `json:"items" bson:"items"`
	TotalAmount float64              `json:"totalAmount" bson:"totalAmount"`
	Address     OrderAddress         `json:"address" bson:"address"`
	PaymentID   string               `json:"paymentId,omitempty" bson:"paymentId,omitempty"`
	Status      string               `json:"status" bson:"status"`
	CreatedAt   time.Time            `json:"createdAt" bson:"createdAt"`
	UpdatedAt   time.Time            `json:"updatedAt" bson:"updatedAt"`
}
