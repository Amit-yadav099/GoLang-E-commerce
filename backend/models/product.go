package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Product struct {
	ID            primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name          string             `json:"name" bson:"name"`
	Description   string             `json:"description" bson:"description"`
	Price         float64            `json:"price" bson:"price"`
	Category      string             `json:"category" bson:"category"`
	ImageURL      string             `json:"imageUrl" bson:"imageUrl"`
	Brand         string             `json:"brand,omitempty" bson:"brand,omitempty"`
	DiscountPrice float64            `json:"discountPrice,omitempty" bson:"discountPrice,omitempty"`
	Stock         int                `json:"stock" bson:"stock"`
	Rating        float64            `json:"rating" bson:"rating"`
	RatingsCount  int                `json:"ratingsCount" bson:"ratingsCount"`
	NumReviews    string             `json:"numReviews" bson:"numReviews"`
	CreatedAt     time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt     time.Time          `json:"updatedAt" bson:"updatedAt"`
}
