package utils

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"time"

	"shopease-backend/config"

	"github.com/golang-jwt/jwt/v5"
)

type TokenClaims struct {
	ID string `json:"id"`
	jwt.RegisteredClaims
}

func GenerateToken(userID string) (string, error) {
	claims := TokenClaims{
		ID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(30 * 24 * time.Hour)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.JWTSecret))
}

func RandomOTP() string {
	n, err := rand.Int(rand.Reader, big.NewInt(900000))
	if err != nil {
		return fmt.Sprintf("%06d", 100000+time.Now().UnixNano()%900000)
	}
	return fmt.Sprintf("%06d", n.Int64()+100000)
}
