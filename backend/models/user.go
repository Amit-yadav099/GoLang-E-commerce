package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID         primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name       string           `json:"name" bson:"name"`
	Email      string           `json:"email" bson:"email"`
	Password   string           `json:"-" bson:"password"`
	Role       string           `json:"role" bson:"role"`
	OTP        string           `json:"-" bson:"otp,omitempty"`
	OTPExpires *time.Time       `json:"-" bson:"otpExpires,omitempty"`
	IsVerified bool             `json:"isVerified" bson:"isVerified"`
	CreatedAt  time.Time        `json:"createdAt" bson:"createdAt"`
	UpdatedAt  time.Time        `json:"updatedAt" bson:"updatedAt"`
}
